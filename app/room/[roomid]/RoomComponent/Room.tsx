"use client";
import {
  useSocketUser,
} from "./../SocketContextProvider/SocketContext";
import Waiting from "./Waiting"; // Import the Waiting component
import { Ui } from "./Ui";

export default function Room() {
  const { tokenData } = useSocketUser()!

  return (
    <section className="">
      {/* Conditionally render the Waiting component based on the user's approval status */}
      {!tokenData?.isMember ? (
        <Waiting /> // Render the Waiting component if the user is not approved
      ) : 
      <Ui/>
      }
    </section>
  );
}
