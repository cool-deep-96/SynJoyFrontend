import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
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
import { SOCKET_CHANNEL } from "@/interfaces/socket_channels";

export interface Member {
  id: string;
  userName: string;
  roomId: string;
  isMember: boolean;
  isOwner: boolean;
}

interface MemberContextType {
  joinedMembers: Member[];
  requestedMembers: Member[];
  newRequests: Member[];
  setNewRequests: Dispatch<SetStateAction<Member[]>>;
  acceptMember: (id: string, userName: string) => void;
  removeMember: (id: string, userName: string) => void;
}

interface MemberProviderProps {
  children: ReactNode;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const MemberProvider = ({ children }: MemberProviderProps) => {
  const [joinedMembers, setJoinedMembers] = useState<Member[]>([]);
  const [requestedMembers, setRequestedMembers] = useState<Member[]>([]);
  const [newRequests, setNewRequests] = useState<Member[]>([]);

  const { socket, tokenData, token } = useSocketUser()!;

  // Memoize headers to avoid unnecessary recalculations
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const getAllMembers = useCallback(async () => {
    try {
      const url = membersEndPoints.GET_USER;
      const method = "GET";
      const data = { roomId: tokenData!.roomId };

      const response = await apiCall(method, url, data, headers);
      const { joinedMembers, requestedMembers } = response.payload;

      setJoinedMembers(joinedMembers);
      setRequestedMembers(requestedMembers);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [headers, tokenData]);

  const acceptMember = useCallback(
    async (id: string, userName: string) => {
      try {
        const url = membersEndPoints.ADMIT_ROOM;
        const method = "PUT";
        const data = { userId: id, userName };

        const response = await apiCall(method, url, data, headers);
        toast.success(response.message);

        // Update member lists
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
          ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
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
        const url = membersEndPoints.REMOVE_USER;
        const method = "PUT";
        const data = { userId: id, userName };

        const response = await apiCall(method, url, data, headers);
        toast.success(response.message);

        // Remove from both joinedMembers and requestedMembers
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

  useEffect(() => {
    if (socket) {
      const handleSyncJoined = (data: Member) => {
        // Check if the current user is being removed
        if (data.id === tokenData?.id && !data.isMember) {
          console.log("You have been removed from the room");

          // Clear local storage
          localStorage.clear();

          // Redirect to a "removed" page (using window.location or React Router)
          window.location.replace("/room/removed"); // Replace '/removed-page' with the actual URL
          return; // Exit early to avoid further state updates
        }

        setJoinedMembers((prev) =>
          data.isMember
            ? [...prev, data].filter(
                (v, i, a) => a.findIndex((t) => t.id === v.id) === i
              ) // Ensure no duplicates
            : prev.filter((member) => member.id !== data.id)
        );
      };

      socket.on(SOCKET_CHANNEL.SYNC_JOINED_LIST, handleSyncJoined);

      return () => {
        socket.off(SOCKET_CHANNEL.SYNC_JOINED_LIST, handleSyncJoined);
      };
    }
  }, [socket, setJoinedMembers, tokenData]);

  useEffect(() => {
    if (socket && tokenData?.isOwner) {
      const handleJoinRequest = (data: Member) => {
        setNewRequests((prev) =>
          prev.some((req) => req.id === data.id) ? prev : [data, ...prev]
        );
        setRequestedMembers((prev) =>
          prev.some((req) => req.id === data.id) ? prev : [data, ...prev]
        );
      };

      socket.on(SOCKET_CHANNEL.JOIN_REQUEST_CHANNEL, handleJoinRequest);

      return () => {
        socket.off(SOCKET_CHANNEL.JOIN_REQUEST_CHANNEL, handleJoinRequest);
      };
    }
  }, [socket, tokenData]);

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

// Hook to use the MemberContext in functional components
export const useMember = (): MemberContextType => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error("useMember must be used within a MemberProvider");
  }
  return context;
};
