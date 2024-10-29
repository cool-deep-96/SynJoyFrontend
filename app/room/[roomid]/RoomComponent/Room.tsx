"use client";
import {
  SocketProvider,
  useSocketUser,
} from "./../SocketContextProvider/SocketContext";
import Chat from "./Chat";
import VideoPlayer from "./VideoPlayer";
import Waiting from "./Waiting"; // Import the Waiting component
import { useState } from "react";
import User, { UserButton } from "./User";
import toast from "react-hot-toast";
import { Ui } from "./Ui";

export default function Room() {
  const [userSwitch, setUserSwitch] = useState<boolean>(false);
  const { tokenData } = useSocketUser()!

  return (
    <section className="">
      {/* Conditionally render the Waiting component based on the user's approval status */}
      {tokenData?.approved ? (
        <Waiting /> // Render the Waiting component if the user is not approved
      ) : 
      <Ui/>
      }
    </section>
  );
}
