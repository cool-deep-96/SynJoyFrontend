"use client"

import { SERVER_URL } from '@/app/ApiHandler/apiList';
import { redirect } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Socket, io } from 'socket.io-client';

interface SocketContextProps {
  children: React.ReactNode;
  room_id: string,
}

interface SocketUserContextProps {
  socket: Socket | null;
  liveUsers: string[];

}

const SocketUserContext = createContext<SocketUserContextProps>({
  socket: null,
  liveUsers: []

});

export const SocketProvider: React.FC<SocketContextProps> = ({ children , room_id}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userName, setUserName] = useState<string | null>(
    typeof window !== 'undefined' ? window.localStorage.getItem('userName') : null
  );
  const [liveUsers, setLiveUsers] = useState<string[]>([])

  useEffect(() => {
    if(userName != null){
      try{

        const socketInstance = io(SERVER_URL||'');
        socketInstance.emit('roomjoin', room_id, userName, (error: string|null, acknowledgement?: string|null)=>{
          if(error){
            toast.error(error);
            window.localStorage.clear(); 
          }else {
            
            toast.success(acknowledgement || '');
          }
        });

        socketInstance.on('connect_error', ()=>{
          toast.error('Failed to connect to the server. Please try again later.')
        });
        
        socketInstance.on('notify', (arg)=>{
            toast.success(arg)
        });

        socketInstance.on('liveusers', (liveUsers)=>{
          setLiveUsers(liveUsers)
        } )



        setSocket(socketInstance);
      }catch(error:any){
        toast.error('Recconneting....')
      }
    }
  }, [userName, room_id]);

  useEffect(() => {
    if (typeof window !== 'undefined' && userName == null) {
      // redirect('/room');
    }
  }, [userName]);
  

  return (
    <SocketUserContext.Provider value={{ socket, liveUsers}}>
      {children}
    </SocketUserContext.Provider>
  );


};


export const useSocketUser = (): SocketUserContextProps |null => {
  return useContext(SocketUserContext);
};

