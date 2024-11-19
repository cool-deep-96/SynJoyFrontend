"use client";

import { useState } from "react";
import CreateUserDialog from "./components/CreateUserDialog";
import { generateRoomId } from "@/utils/utils";
import { roomEndPoints } from "../ApiHandler/api_list";
import apiCall from "../ApiHandler/api_call";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [roomIdInput, setRoomIdInput] = useState<string>("");

  // Handle the room ID form submission to check if the room exists
  const checkRoomIdExist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomIdInput.trim()) {
      toast.error("Please enter a valid Room ID");
      return;
    }

    setLoading(true);

    router.push(`/room/${roomIdInput}`);

    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-full text-center select-none text-xl">
      {/* Create Room Dialog */}
      <CreateUserDialog
      type={0}
        buttonText="Create A New Room"
        roomId={generateRoomId()}
        actionText="Create Room"
      />

      {/* Join Room Section */}
      <form
        onSubmit={checkRoomIdExist}
        className=" max-w-xs lg:max-w-md lg:text-base"
      >
        <div className="flex text-base md:text-xl flex-col ">
          <label
            htmlFor="roomId"
            className=" mb-2 font-medium text-left text-gray-300"
          >
            Room Id
          </label>
          <div className="flex flex-wrap gap-5 justify-center">
            <input
              type="text"
              id="roomId"
              name="roomId"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              className="px-3 py-2 flex-grow bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter Room Id"
              required
            />
            <button
              type="submit"
              className=" whitespace-nowrap px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? "Processing..." : "Join Room"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
