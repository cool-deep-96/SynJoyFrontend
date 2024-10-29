"use client"

import React, { useEffect, useState } from 'react'
import { useSocketUser } from '../SocketContextProvider/SocketContext';
import toast from 'react-hot-toast';
import { roomEndPoints } from '@/app/ApiHandler/api_list';
import apiCall from '@/app/ApiHandler/api_call';
import { redirect } from 'next/navigation';
import { Check, Ellipsis } from 'lucide-react';

interface Props {
    room_id: string
}

enum MessageStatus {
    SENDING = 'SENDING',
    SENT = 'sent'
}
interface MessageBox {
    message: string,
    sentBy: string,
    status: MessageStatus
}

const Chat = ({ room_id }: Props) => {
    const socket = useSocketUser()?.socket;
    const [chat, setChat] = useState<MessageBox[]>([]);
    const [message, setMessage] = useState<string>("");
    const userName = typeof window !== 'undefined' ? window.localStorage.getItem('userName') : null;

    useEffect(() => {
        if (typeof window !== 'undefined' && userName != null) {
            chatSync(room_id, userName);
        } else if (typeof window !== 'undefined' && userName == null) {
            redirect('/room');
        }
    }, [userName, room_id])


    useEffect(() => {
        if (socket) {
            socket.on('roomMessage', (message: MessageBox) => {
                setChat((chat) => [...chat, message]);
            })
        }
    }, [socket]);

    const chatSync = async (room_id: string, userName: string) => {
        try {
            const url = roomEndPoints.CHAT_REQUEST;
            const method = 'POST';
            const data = {
                room_id: room_id,
                userName: userName
            }


            const response = await apiCall(
                method,
                url,
                data
            )
            console.log(response.chat.map(cha => {
                cha.status = MessageStatus.SENT
                return cha
            }))
            setChat(response.chat)
            toast.success(`${response.message}`);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const handleSendMessage = (e: any) => {
        e.preventDefault();
        if (message == '') {
            return;
        }
        if (socket) {
            try {
                const messageBox: MessageBox = {
                    message,
                    sentBy: userName!,
                    status: MessageStatus.SENDING

                }
                setChat((chat) => [...chat, messageBox]);
                socket.emit("roomMessage", [message, room_id, userName], (error: string | null, acknowledgement?: string | null) => {
                    if (error) {
                        toast.error(error);
                    } else {
                        toast.success(acknowledgement || '');
                    }
                });
                setMessage("");
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    }
    return (
        <div className=" bg-gray-500  md:h-full h-4/6 relative px-4 md:w-6/12 w-full flex flex-col rounded-xl ">
            <div className='mb-14 h-full overflow-scroll overflow-x-hidden'>
                <div className=''>
                    {
                        chat.map((message, index) => (
                            <div key={index} className={`flex ${message.sentBy === userName ? 'justify-end' : ""}`}>
                                <div className="m-2 px-2 py-1  bg-gray-700 rounded-r-xl rounded-bl-xl max-w-fit w-2/4">
                                    <div className='text-xs lg:text-sm '>~ {message.sentBy}</div>
                                    <div className='bg-gray-600 px-1 md:px-2 lg:text-base md:text-sm rounded-lg md:py-1'>{message.message}</div>
                                    <div className={`flex justify-end ${message.status === MessageStatus.SENDING ? "animate-bounce" : ""}`}>{message.status === MessageStatus.SENT ? <Check size={14} /> : <Ellipsis size={14} />}</div>
                                </div>
                            </div>

                        ))
                    }

                </div>

            </div>

            <div className="bottom-0 absolute left-0 w-full">
                <div className='flex md:w-full justify-center'>
                    <form onSubmit={(e) => handleSendMessage(e)}>
                        <input onChange={(event) => setMessage(event.target.value)}
                            className=' px-2 md:w-56 lg:w-auto lg:text-lg py-3 rounded-l-xl bg-gray-600'
                            type="text" value={message} placeholder="Type Message..." />
                        <button type='submit'
                            className="px-2 rounded-r-xl bg-gray-900 py-3 lg:text-lg">Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Chat;
