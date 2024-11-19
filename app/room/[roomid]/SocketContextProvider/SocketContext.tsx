"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import apiCall from "@/app/ApiHandler/api_call";
import { roomEndPoints, SERVER_URL } from "@/app/ApiHandler/api_list";
import { useRouter } from "next/navigation";
import { Socket, io } from "socket.io-client";
import { TokenData } from "@/interfaces/interfaces";
import { jwtDecode } from "jwt-decode";
import CreateUserDialog from "../../components/CreateUserDialog";
import toast from "react-hot-toast";

interface SocketContextProps {
  children: React.ReactNode;
  roomId: string;
}

interface SocketUserContextProps {
  socket: Socket | null;
  tokenData: TokenData | null;
  token: string | null;
  updateTokenData: (tokenData: TokenData) => void;
  openChat: boolean;
  setOpenChat: Dispatch<SetStateAction<boolean>>;
}

const SocketUserContext = createContext<SocketUserContextProps | undefined>(
  undefined
);

export const SocketProvider: React.FC<SocketContextProps> = ({
  children,
  roomId,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [openChat, setOpenChat] = useState<boolean>(true);
  const [room, setRoom] = useState<{ roomId: string; owner: string }>();
  const router = useRouter();

  // Handle the room ID form submission to check if the room exists
  const checkRoomIdExist = useCallback(async () => {
    if (!roomId.trim()) {
      router.push("/room");
    }

    setLoading(true);
    try {
      console.log(roomId)
      const response = await apiCall(
        "GET",
        `${roomEndPoints.CREATE_REQUEST}${roomId}`,
        null
      );
      toast.success(response.message);
      setRoom({
        owner: response.payload.owner,
        roomId: response.payload.roomId,
      });
    } catch (error: any) {
      const errorMessage = (error as Error).message;
      if (errorMessage !== "Network Error") {
        router.push("/room");
      }
    } finally {
      setLoading(false);
    }
  }, [roomId, router]);

  // Function to verify the token with the server
  const verifyTokenWithServer = useCallback(async (token: string) => {
    const url = roomEndPoints.ATTEMPT_ROOM;
    const method = "PUT";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await apiCall(method, url, null, headers);

      const newToken = response.jwtToken;
      const decodedTokenData = jwtDecode<TokenData>(newToken);

      // Update local storage and state
      localStorage.setItem("jwtToken", newToken);
      updateTokenData(decodedTokenData);
      setToken(newToken);
      return true;
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage !== "Network Error") {
        localStorage.removeItem("jwtToken");
      }
      console.error("Token verification failed:", errorMessage);
      return false;
    } finally {
      setLoading(false); // Ensure loading is false no matter what
    }
  }, []);

  // Create a socket instance and handle events
  const createSocketInstance = useCallback((tokenData: TokenData) => {
    const socketInstance = io(SERVER_URL || "");

    socketInstance.on("connect", () => {
      console.log(
        `Connected to socket server with ID: ${socketInstance.id} UserID: ${tokenData.id}`
      );
      socketInstance.emit("register", {
        userId: tokenData.id,
        roomId: tokenData.roomId,
      });
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(socketInstance);

    // Clean up socket on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("Socket disconnected on cleanup");
      }
    };
  }, []);

  // Effect to handle token verification and socket creation
  useEffect(() => {
    checkRoomIdExist();
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("jwtToken");

      if (storedToken) {
        verifyTokenWithServer(storedToken).then((isVerified) => {
          if (isVerified) {
            const decodedTokenData = jwtDecode<TokenData>(storedToken);
            createSocketInstance(decodedTokenData);
          }
        });
      }
    }
    setLoading(false);
  }, [verifyTokenWithServer, createSocketInstance, checkRoomIdExist, token]);

  const updateTokenData = (newTokenData: TokenData) => {
    setTokenData(newTokenData);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center select-none">
        <div className="loader"></div>
      </div>
    ); // Show a loading indicator while verifying the token
  }

  if (!token) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="p-10 bg-slate-800 rounded-md">
          <p className="text-xl my-5 text-white opacity-70">
            RoomId: {room?.roomId}
          </p>
          <p className="text-xl my-5 text-white opacity-70">
            RoomId: {room?.owner}
          </p>
          <CreateUserDialog
            type={1}
            actionText="Create User & Request to Join"
            buttonText="Request To Join"
            roomId={roomId}
            defaultOpen={true}
            setToken={setToken}
          />
        </div>
      </div>
    );
  }

  return (
    <SocketUserContext.Provider
      value={{
        socket,
        tokenData,
        token,
        updateTokenData,
        openChat,
        setOpenChat,
      }}
    >
      {children}
    </SocketUserContext.Provider>
  );
};

export const useSocketUser = (): SocketUserContextProps => {
  const context = useContext(SocketUserContext);
  if (context === undefined) {
    throw new Error("useSocketUser must be used within a SocketProvider");
  }
  return context;
};
