"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PopUpBox from "../Component/PopUpBox";
import apicall from '../ApiHandler/apicall';
import {SERVER_URL, roomEndPoints} from '../ApiHandler/apiList'
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";





export default function Page() {
  const router = useRouter();
  const [room_id, setRoom_id] = useState<string>("");
  const [popUp, setPopUp] = useState<string>("");
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [loading, setLoading]= useState<boolean>(false);
  

  useEffect(()=>{
    if(socketInstance){
        socketInstance.on('responsejoin', (userName, accepted)=>{
          if(accepted){
            handleJoinRoom(userName);
          }else{
            setPopUp('')
            toast.error('Request Declined');
          }
        })
    }

  },[socketInstance]);



  const createRoomHandle = async (userName:string) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);

    }
    setLoading(true);
    try{
      
      const url = roomEndPoints.CREATE_REQUEST;
      const method = 'POST';
      const data = {
        room_id: result,
        userName: userName
      }
      const response = await apicall(
        method,
        url,
        data
      )
      toast.success(`${response.message}`)
      localStorage.setItem('userName', response.room.owner);

      router.push('/room/' + result);
    } catch (error:any){

      toast.error(error.message);
    } 
    setLoading(false);
    
  }

  const handleJoinRoom = async (userName:String) => {
    try{
      const url = roomEndPoints.JOIN_REQUEST;
      const method = 'PUT';
      const data = {
        room_id: room_id,
        userName: userName
      }
      const response = await apicall(
        method,
        url,
        data
      )
      toast.success(`${response.message}`);
      localStorage.setItem('userName', response.userName);
      router.push('/room/' + response.room_id);
    }catch(error:any){
      toast.error(error.message);
    } 
  }

  const requestJoin = (userName:string)=>{
    const maxtimes = 3;
    let tried = 0;
    try{
      

      const socketInstance = io(SERVER_URL || '');

      socketInstance.on('connect_error', ()=>{
        toast.error('Failed to connect to the server. Please try again later.')
        tried++
      });

      socketInstance.emit('requestjoin', userName, room_id, (error: string|null, acknowledgement?: string|null)=>{
        if(error){
          toast.error(error)
        }else {
          if(acknowledgement === 'true'){
            handleJoinRoom(userName);
          }
          setPopUp('C');
          toast.success(acknowledgement || '');
        }
        
      })
      setSocketInstance(socketInstance);
    } catch (error:any){
      toast.error(error.message);
    }

  }

  const renderComponent = () => {
    switch (popUp) {
      case 'A':
        return <PopUpBox Heading="Creating Room" action="Create Room" handleClose={()=>setPopUp('')} handle={createRoomHandle} loading={loading}/>;
      case 'B':
        return <PopUpBox Heading="Joining Room" action="Request to Join" handleClose={()=>setPopUp('')} handle={requestJoin}/>;
      case 'C':
        return <PopUpBox Heading="Requested...." action="Resend request" handleClose={()=>setPopUp('')} handle={requestJoin} decline={()=>setPopUp('')}/>;
      default:
        return null; // or a default component or message
    }
  };

  return (
    <div className="text-center text-xl py-10 flex flex-col ">
      {renderComponent()}
      <div>
        <button className='my-10 bg-gray-900 px-3 text-xl py-2 rounded-lg' onClick={() => setPopUp("A")}> Create New Room </button>
      </div>

      <div>
        <input onChange={(event) => setRoom_id(event.target.value)}
          className="mx-1 bg-gray-600 px-2 text-xl py-1 rounded-xl " placeholder="Enter Room Id" type='text' />
        <button onClick={() => setPopUp("B")}
          className="bg-gray-900 px-2 py-1 rounded-xl">Join Room</button>
      </div>
    </div>
  )
}