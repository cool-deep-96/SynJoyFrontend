"use client"
import { SocketProvider, useSocketUser } from "./SocketContextProvider/SocketContext";
import Chat from "./RoomComponent/Chat";
import VideoPlayer from "./RoomComponent/VideoPlayer";
import { useEffect, useState } from "react";
import User, { UserButton } from "./RoomComponent/User";
import toast from "react-hot-toast";


interface Params {
    params: { roomid: string },
}

export default function Room({ params }: Params) {
    const room_id = params?.roomid;
    const [isClient, setIsClient] = useState(false);
    const [userSwitch, setUserSwitch] = useState<boolean>(false);

    const userName = typeof window !== 'undefined' ? window.localStorage.getItem('userName') : null;
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <SocketProvider room_id={room_id} >

            <div className="h-5/6 flex flex-col items-center justify-between">
                <div className="text-lg pt-2 pb-4 w-full flex flex-row justify-between px-4">
                    <div>~{isClient ? userName : ''}</div>
                 <div className="hover:cursor-pointer" onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(room_id) } toast.success('Room Id Copied') }}> {room_id}</div>
                    <div className="relative z-10">
                        <UserButton handleUserSwitch={() => setUserSwitch(!userSwitch)} room_id={room_id} />
                        {userSwitch && <User room_id={room_id} />}
                    </div>
                </div>
                <div className="w-full flex flex-col md:flex-row justify-between h-full lg:justify-start">
                    <VideoPlayer room_id={room_id} userName={userName} />
                    <Chat room_id={room_id} />
                </div>
            </div>

        </SocketProvider>

    )
}