"use client";

import React, {
  createContext,
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
}

const SocketUserContext = createContext<SocketUserContextProps>({
  socket: null,
  tokenData: null,
  token: null,
  updateTokenData: () => {},
});

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Memoize headers to avoid unnecessary recalculations

  // Function to verify the token with the server
  const verifyTokenWithServer = useCallback(
    async (token: string) => {
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
          // router.push("/room"); // Use router.push for client-side redirect
        }
        toast.error((error as Error).message);
        return false;
      }
    },
    [router]
  );

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
        // router.push("/room"); // Redirect if no token is found
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

  // // Render loading state or the UI
  // if (loading) {
  //   return <div>Loading...</div>; // Show a loading indicator while verifying the token
  // }

  return (
    <SocketUserContext.Provider
      value={{ socket, tokenData, token, updateTokenData }}
    >
      {children}
    </SocketUserContext.Provider>
  );
};

export const useSocketUser = (): SocketUserContextProps | undefined => {
  return useContext(SocketUserContext);
};
