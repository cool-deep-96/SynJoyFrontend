"use client"

import React, {  useEffect, useState } from 'react'
import { useSocketUser } from '../SocketContextProvider/SocketContext';
import toast from 'react-hot-toast';
import { roomEndPoints } from '@/app/ApiHandler/apiList';
import apicall from '@/app/ApiHandler/apicall';
import { redirect } from 'next/navigation';

interface Props{
    room_id : string
}

interface message{
    message: string,
    sentBy: string
}

const Chat = ({room_id}: Props) => {
    const socket  = useSocketUser()?.socket;
    const [chat,  setChat] = useState<message[]>([]);
    const [message, setMessage] = useState<string>("");
    const userName = typeof window !== 'undefined' ? window.localStorage.getItem('userName') : null;

    useEffect(()=>{
        if(typeof window !== 'undefined' &&  userName != null){
            chatSync(room_id, userName);
        }else if(typeof window !== 'undefined' &&  userName == null){
            console.log('hhh');
            redirect('/room');
        }
    },[userName])


    useEffect(()=>{
        if(socket){
            socket.on('roomMessage', (message:message)=>{
                setChat((chat)=>[...chat, message]);
            })
        }
    },[socket]); 

    const chatSync = async (room_id:string, userName:string)=>{
        try{
            const url = roomEndPoints.CHAT_REQUEST;
            const method = 'POST';
            const data = {
              room_id: room_id,
              userName: userName
            }
            
            
            const response = await apicall(
              method,
              url,
              data
            )
            setChat(response.chat)
            toast.success(`${response.message}`);
          }catch(error:any){
            toast.error(error.message);
          }
    }

    const handleSendMessage=(e:any)=>{
        e.preventDefault();
        if(socket){
            try{

                socket.emit("roomMessage", [message, room_id, userName], (error: string|null, acknowledgement?: string|null)=>{
                    if(error){ 
                      toast.error(error);
                      
    
                    }else {
                      toast.success(acknowledgement || '');
                    }
                  });
    
                setMessage("");
            } catch(error:any) {
                console.log('hhh');
                toast.error(error.message);
            }
        }
    }
    return (
        <div className=" bg-gray-500  md:h-2/4 md:h-full h-4/6 relative px-4 md:w-6/12 w-full flex flex-col rounded-xl ">
            <div className='mb-14 h-full overflow-hidden overflow-scroll overflow-x-hidden'>

                {
                    chat.map((message, index) => (
                        <div key={index} className={`flex ${message.sentBy === userName ? 'justify-end':""}`}>

                            <div  className="m-2 px-2 py-1  bg-gray-700 rounded-r-xl rounded-bl-xl max-w-fit w-2/4">
                                <div className='text-xs lg:text-sm '>~ {message.sentBy}</div>
                                <div className='bg-gray-600 px-2 lg:text-base md:text-sm rounded-lg py-1'>{message.message}</div>
                            </div>
                        </div>

                    ))
                }
            </div>

            <div className="bottom-0 absolute left-0 w-full">
                <div className='flex md:w-full justify-center'>
                    <form onSubmit={(e)=>handleSendMessage(e)}>

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
