import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";
import { membersEndPoints } from "@/app/ApiHandler/api_list";
import apiCall from "@/app/ApiHandler/api_call";
import toast from "react-hot-toast";
import { SOCKET_CHANNEL } from "@/interfaces/socket_channels"; // Assuming this is the path
import showJoinRequestToast from "../alert_dialog/ShowJoinRequests";

export interface Member {
  id: string;
  userName: string;
  roomId: string;
  isMember: boolean;
  isOwner: boolean;
  isSelf?: boolean;
}

interface MemberContextType {
  joinedMembers: Member[];
  requestedMembers: Member[];
  newRequests: Member[];
  setNewRequests: React.Dispatch<React.SetStateAction<Member[]>>;
  acceptMember: (id: string, userName: string) => void;
  removeMember: (id: string, userName: string) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const MemberProvider = ({ children }: { children: React.ReactNode }) => {
  const [joinedMembers, setJoinedMembers] = useState<Member[]>([]);
  const [requestedMembers, setRequestedMembers] = useState<Member[]>([]);
  const [newRequests, setNewRequests] = useState<Member[]>([]);
  const [isSilent, setIsSilent] = useState<boolean>(true);

  const { socket, tokenData, token } = useSocketUser()!;

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  // Get all members (joined and requested)
  const getAllMembers = useCallback(async () => {
    if (!tokenData?.roomId) return;
    try {
      const { payload } = await apiCall(
        "GET",
        `${membersEndPoints.GET_USER}/${tokenData.roomId}/members`,
        null,
        headers
      );
      setJoinedMembers(payload.joinedMembers);
      setRequestedMembers(payload.requestedMembers);
    } catch (error) {
      console.log(tokenData.roomId);
      toast.error((error as Error).message);
    }
  }, [headers, tokenData?.roomId]);

  const acceptMember = useCallback(
    async (id: string, userName: string) => {
      try {
        const { message } = await apiCall(
          "PUT",
          membersEndPoints.ADMIT_ROOM,
          { userId: id, userName },
          headers
        );
        toast.success(message);

        // Move the member from requested to joined
        setRequestedMembers((prev) =>
          prev.filter((member) => member.id !== id)
        );
        setJoinedMembers((prev) =>
          [
            ...prev,
            {
              id,
              userName,
              roomId: tokenData!.roomId,
              isMember: true,
              isOwner: false,
            },
          ].filter(
            (member, index, self) =>
              self.findIndex((m) => m.id === member.id) === index
          )
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    [headers, tokenData]
  );

  const removeMember = useCallback(
    async (id: string, userName: string) => {
      try {
        const { message } = await apiCall(
          "PUT",
          membersEndPoints.REMOVE_USER,
          { userId: id, userName },
          headers
        );
        toast.success(message);

        // Remove from both joined and requested members
        setJoinedMembers((prev) => prev.filter((member) => member.id !== id));
        setRequestedMembers((prev) =>
          prev.filter((member) => member.id !== id)
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    [headers]
  );

  // Handle syncing the joined member list via socket
  useEffect(() => {
    if (!socket) return;

    const handleSyncJoined = (data: Member) => {
      // If the current user is removed
      if (data.id === tokenData?.id && !data.isMember) {
        localStorage.clear();
        data.isSelf
          ? window.location.replace("/room/exit/left")
          : window.location.replace("/room/exit/removed");
        return;
      }

      setJoinedMembers((prev) =>
        data.isMember
          ? [...prev, data].filter(
              (member, index, self) =>
                self.findIndex((m) => m.id === member.id) === index
            )
          : prev.filter((member) => member.id !== data.id)
      );
    };

    socket.on(SOCKET_CHANNEL.SYNC_JOINED_LIST, handleSyncJoined);

    return () => {
      socket.off(SOCKET_CHANNEL.SYNC_JOINED_LIST, handleSyncJoined);
    };
  }, [socket, tokenData]);

  // Handle join requests via socket
  useEffect(() => {
    if (socket && tokenData?.isOwner) {
      const handleJoinRequest = (data: Member) => {
        // Append to newRequests only if the member is not already in the list
        setNewRequests((prev) => {
          const isNewRequest = !prev.some((req) => req.id === data.id);
          if (isNewRequest) {
            isSilent && showJoinRequestToast(data, acceptMember, removeMember);
            return [data, ...prev];
          }
          return prev;
        });

        setRequestedMembers((prev) => {
          const isNewMember = !prev.some((req) => req.id === data.id);
          return isNewMember ? [data, ...prev] : prev;
        });
      };

      socket.on(SOCKET_CHANNEL.JOIN_REQUEST_CHANNEL, handleJoinRequest);

      return () => {
        socket.off(SOCKET_CHANNEL.JOIN_REQUEST_CHANNEL, handleJoinRequest);
      };
    }
  }, [socket, tokenData, acceptMember, removeMember, isSilent]);

  useEffect(() => {
    getAllMembers();
  }, [getAllMembers]);

  return (
    <MemberContext.Provider
      value={{
        joinedMembers,
        requestedMembers,
        newRequests,
        setNewRequests,
        acceptMember,
        removeMember,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export default MemberProvider;

// Hook to use the MemberContext
export const useMember = (): MemberContextType => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMember must be used within a MemberProvider");
  }
  return context;
};
