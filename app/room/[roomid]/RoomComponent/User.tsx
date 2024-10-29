import React, { useEffect, useState } from "react";
import { useSocketUser } from "../SocketContextProvider/SocketContext";
import PopUpBox from "@/app/Component/PopUpBox";
import toast from "react-hot-toast";
import { roomEndPoints, SERVER_URL } from "@/app/ApiHandler/api_list";
import apiCall from "@/app/ApiHandler/api_call";
import Rectangle from "@/app/Component/Skeleton/Rectangle";

interface userProps {
  room_id: string;
}

const User = ({ room_id }: userProps) => {
  const userName =
    typeof window !== "undefined"
      ? window.localStorage.getItem("userName")
      : null;
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && userName != null) {
      userSync(room_id, userName);
    }
  }, [userName, room_id]);

  const userSync = async (room_id: string, userName: string) => {
    try {
      const url = roomEndPoints.USER_REQUEST;
      const method = "POST";
      const data = {
        room_id: room_id,
        userName: userName,
      };
      const response = await apiCall(method, url, data);
      setData(response.userName);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="absolute bg-gray-700 right-0 w-72  py-3 px-2 rounded-xl h-72 lg:h-96  overflow-scroll overflow-x-hidden overflow-y-hidden">
      {data.length === 0 ? (
        <div className="h-full w-full">
          <Rectangle h="h-8" rounded="rounded-lg" m="mt-4" />
          <Rectangle h="h-8" rounded="rounded-lg" m="mt-4" />
          <Rectangle h="h-8" rounded="rounded-lg" m="mt-4" />
          <Rectangle h="h-8" rounded="rounded-lg" m="mt-4" />
          <Rectangle h="h-8" rounded="rounded-lg" m="mt-4" />
          <Rectangle h="h-8" rounded="rounded-lg" m="mt-4" />
        </div>
      ) : (
        data.map((user, index) => {
          return (
            <div
              key={index}
              className={`my-2 ${
                "bg-gray-600"
              }  px-2 py-1  rounded-md flex flex-row justify-between items-center`}
            >
              ~{user}
            </div>
          );
        })
      )}
    </div>
  );
};

interface userButtonProps {
  handleUserSwitch: () => void;
  room_id: string;
  open: boolean;
}

interface UserRequesting {
  id: string,
  roomId: string,
  userName: string
}

export const UserButton = ({
  handleUserSwitch,
  open,
}: userButtonProps) => {
  const socket = useSocketUser()?.socket;
  const [popUp, setPopUp] = useState<string | null>();
  const [userRequesting, setUserRequesting] = useState<UserRequesting | null>();
  const { token } = useSocketUser()!

  const renderComponent = () => {
    switch (popUp) {
      case "C":
        return (
          <PopUpBox
            Heading="Request Received"
            action="Accept"
            handleClose={() => setPopUp("")}
            handle={handleAccept}
            decline={handleDecline}
            userRequesting={userRequesting?.userName}
          />
        );
      default:
        return null; // or a default component or message
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on(
        "join-request-channel",
        ( data ) => {
          console.log('received request', data)
          setUserRequesting(data);
          setPopUp("C");
        }
      );

      return () => {
        socket.off("join-request-channel");
      };
    }
  }, [socket]);

  const handleAccept = async () => {
      try {
        const url = roomEndPoints.ADMIT_ROOM;
        const method = 'PUT'
        const data = {
          userId: userRequesting?.id,
          userName: userRequesting?.userName
        }
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        console.log("calling..... ,", data)
        const response = await apiCall(method, url, data, headers)
        toast.success(response.message)
        resetState();
      } catch (error) {
        toast.error((error as Error).message)
      }
  };

  const handleDecline = () => {
// Send `false` indicating decline.
      resetState();
  };

  const resetState = () => {
    setUserRequesting(null);
    setPopUp(""); // Hide the popup if necessary.
  };

  return (
    <>
      {renderComponent()}
      <button
        onClick={handleUserSwitch}
        className={`${
          open ? "bg-slate-900 text-white" : "bg-slate-600 text-white"
        } px-3 py-1 rounded-xl `}
      >
        Users
      </button>
    </>
  );
};

export default User;
