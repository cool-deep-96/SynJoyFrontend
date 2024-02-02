import React, { useEffect, useState } from 'react'
import { useSocketUser } from '../SocketContextProvider/SocketContext'
import PopUpBox from '@/app/Component/PopUpBox'
import toast from 'react-hot-toast'
import { roomEndPoints } from '@/app/ApiHandler/apiList'
import apicall from '@/app/ApiHandler/apicall'

interface userProps{
    room_id: string
}

const User = ({room_id}: userProps) => {
    const userName = typeof window !== 'undefined' ? window.localStorage.getItem('userName') : null;
    const liveUsers = useSocketUser()?.liveUsers;
    const [data, setData] = useState<string[]>([]);


    useEffect(()=>{
        if(typeof window !== 'undefined' &&  userName != null){
            userSync(room_id, userName);
        }
    },[userName, room_id])

    const userSync = async (room_id:string, userName:string)=>{
        try{
            const url = roomEndPoints.USER_REQUEST;
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
            setData(response.userName)
          }catch(error:any){
            toast.error(error.message);
          }
    }




  return (
    <div className='absolute bg-gray-700 right-0 w-72 bg-gray-200 p-2 rounded-xl h-72 lg:h-96 overflow-hidden overflow-scroll overflow-x-hidden'>
        {
            data.map((user, index)=>{
                return(
                    <div key={index}
                     className={`my-2 ${liveUsers?.includes(user)?'bg-green-900': 'bg-gray-600' }  px-2 py-1  rounded-md flex flex-row justify-between items-center`}
                    >
                        ~{user}
                        
                    </div>
                )
            })
        }
        
    </div>
  )
}


interface userButtomProps{
    handleUserSwitch: ()=> void,
    room_id: string
}


export const UserButton = ({handleUserSwitch, room_id}: userButtomProps)=>{
    const socket = useSocketUser()?.socket
    const [popUp, setPopUp] = useState<string|null>();
    const [userRequesting, setUserRequesting] = useState<string|null>()


    const renderComponent = () => {
        switch (popUp) {
          case 'C':
            return <PopUpBox Heading="Request Received" action="Accept" handleClose={()=>setPopUp('')} handle={()=>handleGrantPermission(true)} decline={()=>handleGrantPermission(false)} userRequesting={userRequesting}/>;
          default:
            return null; // or a default component or message
        }
      };

    useEffect(() => {
        if (socket) {
            socket.on('requestjoin', (userName: string) => {
                setPopUp('C')
                setUserRequesting(userName)
                
            })
        }
    }, [socket])

    const handleGrantPermission =(accepted:boolean)=>{
        if(socket){
            socket.emit('responsejoin', userRequesting, room_id, accepted, (error:string|null, acknowledgement:string|null)=>{
                if(error){
                    toast.error(error);
                }else{
                    toast.success(acknowledgement || '')
                }
            });
            setPopUp('')
        }
    }

    return(
        <>
        {renderComponent()}
        <button onClick={handleUserSwitch}
        className="bg-gray-900 px-2 py-1 rounded-xl">users</button>
        
        </>
        
    )
}

export default User;
