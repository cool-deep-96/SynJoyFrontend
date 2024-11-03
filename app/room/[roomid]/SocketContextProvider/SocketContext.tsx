"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import apiCall from "@/app/ApiHandler/api_call";
import { roomEndPoints, SERVER_URL } from "@/app/ApiHandler/api_list";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation"; // Import useRouter
import toast from "react-hot-toast";
import { Socket, io } from "socket.io-client";
import { TokenData } from "@/interfaces/interfaces";

interface SocketContextProps {
  children: React.ReactNode;
}

interface SocketUserContextProps {
  socket: Socket | null;
  tokenData: TokenData | null;
  token: string | null;
  updateTokenData: (tokenData: TokenData) => void;
  openChat: boolean;
  setOpenChat: Dispatch<SetStateAction<boolean>>;
}

const SocketUserContext = createContext<SocketUserContextProps | undefined>(undefined);

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [openChat, setOpenChat] = useState<boolean>(true);
  const router = useRouter();

  // Memoize headers to avoid unnecessary recalculations

  // Function to verify the token with the server
  const verifyTokenWithServer = useCallback(async (token: string) => {
    try {
      const url = roomEndPoints.ATTEMPT_ROOM;
      const method = "PUT";
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await apiCall(method, url, null, headers);
      localStorage.setItem("jwtToken", response.jwtToken);
      updateTokenData(jwtDecode<TokenData>(response.jwtToken));
      setToken(token); // Decode and set the user data
      return true;
    } catch (error) {
      if ((error as Error).message !== "Network Error") {
        localStorage.removeItem("jwtToken");
        router.push("/room"); // Use router.push for client-side redirect
      }
      toast.error((error as Error).message);
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("jwtToken");
      if (token) {
        // Verify the token with the server
        verifyTokenWithServer(token).then((isVerified) => {
          if (isVerified) {
            createSocketInstance(jwtDecode<TokenData>(token));
          }
          setLoading(false); // Set loading to false after verification
        });
      } else {
        router.push("/room"); // Redirect if no token is found
      }
    }
  }, [verifyTokenWithServer, router]);

  // Function to connect to the main room socket
  const createSocketInstance = (tokenData: TokenData) => {
    const socketInstance = io(SERVER_URL || "");
    socketInstance.on("connect", () => {
      console.log(
        `Connected to socket server with ID: ${socketInstance.id} ${tokenData.id}`
      );
      socketInstance.emit("register", {
        userId: tokenData.id,
        roomId: tokenData.roomId,
      });
    });
    setSocket(socketInstance);
  };

  const updateTokenData = (newTokenData: TokenData) => {
    setTokenData(newTokenData);
  };

  // Render loading state or the UI
  if (!tokenData) {
    return (
      <div className="h-screen w-full flex justify-center items-center select-none">
        <div className="loader"></div>
      </div>
    ); // Show a loading indicator while verifying the token
  }

  return (
    <SocketUserContext.Provider
      value={{ socket, tokenData, token, updateTokenData, openChat, setOpenChat }}
    >
      {children}
    </SocketUserContext.Provider>
  );
};

export const useSocketUser = (): SocketUserContextProps => {
  const context = useContext(SocketUserContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};
