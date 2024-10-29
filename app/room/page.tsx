"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PopUpBox from "../Component/PopUpBox";
import apiCall from "../ApiHandler/api_call";
import { roomEndPoints } from "../ApiHandler/api_list";
import toast from "react-hot-toast";
import {
  CreateRoomPayload,
  JoinRoomPayload,
} from "@/interfaces/interfaces";

export default function Page() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>("");
  const [popUp, setPopUp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const createRoomHandle = async (userName: string, password: string) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let roomId = "";

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomId += characters.charAt(randomIndex);
    }
    const createRoomPayload: CreateRoomPayload = {
      userName,
      password,
      roomId,
    };
    const url = roomEndPoints.CREATE_REQUEST;
    const method = "POST";
    const data = {
      createRoomPayload,
    };
    setLoading(true);
    try {
      const response = await apiCall(method, url, data);
      toast.success(`${response.message}`);
      localStorage.setItem("jwtToken", response.jwtToken);
      router.push("/room/" + roomId);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const requestJoin = async (userName: string, password: string) => {
    try {
      const joinRoomPayload: JoinRoomPayload = {
        userName,
        password,
        roomId,
      };
      const url = roomEndPoints.JOIN_REQUEST;
      const method = "PUT";
      const data = {
        joinRoomPayload,
      };

      try {
        const response = await apiCall(method, url, data);
        localStorage.setItem("jwtToken", response.jwtToken);
        router.push("/room/" + roomId);
      } catch (error) {
        toast.error((error as Error).message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const renderComponent = () => {
    switch (popUp) {
      case "A":
        return (
          <PopUpBox
            Heading="Creating Room"
            action="Create Room"
            handleClose={() => setPopUp("")}
            handle={createRoomHandle}
            loading={loading}
          />
        );
      case "B":
        return (
          <PopUpBox
            Heading="Joining Room"
            action="Request to Join"
            handleClose={() => setPopUp("")}
            handle={requestJoin}
          />
        );
      default:
        return null; // or a default component or message
    }
  };

  return (
    <div className="text-center text-xl py-10 flex flex-col ">
      {renderComponent()}
      <div>
        <button
          className="my-10 bg-gray-900 px-3 text-xl py-2 rounded-lg"
          onClick={() => setPopUp("A")}
        >
          {" "}
          Create New Room{" "}
        </button>
      </div>

      <div>
        <input
          onChange={(event) => setRoomId(event.target.value)}
          className="mx-1 bg-gray-600 px-2 text-xl py-1 rounded-xl "
          placeholder="Enter Room Id"
          type="text"
        />
        <button
          onClick={() => setPopUp("B")}
          className="bg-gray-900 px-2 py-1 rounded-xl"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
