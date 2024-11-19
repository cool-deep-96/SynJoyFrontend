"use client"
import { useRouter } from "next/router";
import Room from "./RoomComponent/Room";
import { SocketProvider } from "./SocketContextProvider/SocketContext";

interface Params {
  params: { roomid: string },
}

export default function App({ params }: Params) {
  const roomId = params?.roomid;
  console.log(roomId)
  return (
    <SocketProvider roomId={roomId}>
      <Room />
    </SocketProvider>
  );
}
