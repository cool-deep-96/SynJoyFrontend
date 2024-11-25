import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useSocketUser } from "../SocketContextProvider/SocketContext";
import { tokenEndPoints } from "@/app/ApiHandler/api_list";
import apiCall from "@/app/ApiHandler/api_call";
import { jwtDecode } from "jwt-decode";
import { TokenData } from "@/interfaces/interfaces";

const Waiting: React.FC = () => {
  const { socket, tokenData, token, updateTokenData } = useSocketUser()!;

  // Listen to the 'join-request-channel' for updates
  useEffect(() => {
    if (socket) {
      socket.on("join-approve-channel", async (payload) => {
        if (payload.isMember) {
          try {
            // Fetch a new token from your refresh endpoint
            const url = tokenEndPoints.REFRESH_TOKEN;
            const method = "GET";
            const headers = {
              Authorization: `Bearer ${token}`,
            };
            const response = await apiCall(method, url, null, headers);

            localStorage.setItem("jwtToken", response.jwtToken);
            // Update the user state to reflect the approval and set the new token
            updateTokenData(jwtDecode<TokenData>(response.jwtToken));

            toast.success("Your join request has been approved!");
          } catch (error) {
            console.log(error);
            toast.error("Failed to refresh token. Please try again.");
          }
          toast.success("Your join request has been approved!");
        } else {
          toast.error(
            "Your join request was rejected. Please try again later."
          );
        }
      });

      // Cleanup the event listener on unmount
      return () => {
        console.log("join-approve-channel cleanup called");
        socket.off("join-approve-channel");
      };
    }
  }, [socket, token, updateTokenData]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Waiting for approval from room owner
        </h2>
        <p className="text-gray-600">
          <span className="font-medium">Room ID:</span> {tokenData?.roomId}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-medium">User Name:</span> {tokenData?.userName}
        </p>
      </div>
    </div>
  );
};

export default Waiting;
