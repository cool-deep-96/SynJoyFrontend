"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useSocketUser } from '../SocketContextProvider/SocketContext';
import ReactPlayer from 'react-player';
import toast from 'react-hot-toast';

interface Props {
    room_id: string,
    userName: string | null
}

const VideoPlayer = ({ room_id, userName }: Props) => {
    const socket = useSocketUser()?.socket;
    const [file, setFiles] = useState<any>();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [videoUrl, setVideoUrl] = useState<string | undefined>();
    const videoRef = useRef<ReactPlayer | null>(null);
    const [willEmit, setWillEmit] = useState<boolean>(true);

    useEffect(() => {
        if (socket) {
            socket.on('pause', (second) => {
                if (videoRef.current) {
                    videoRef.current.seekTo(second, 'seconds');
                }
                
                setIsPlaying(false);
                
            });

            socket.on('play', (second) => {

                if (videoRef.current) {
                    videoRef.current.seekTo(second, 'seconds');
                }
                
                setIsPlaying(true);
                
            });

        } else{
            toast.error('your are not connected')
        }

    }, [socket])


    const handleFileChange = (e: any) => {
        const files = e.target.files[0];
        setFiles(files);
        if(files){

            setVideoUrl(URL.createObjectURL(files));
        }
    }



    return (
        <div className="w-full md:h-full py-4 lg:h-full flex flex-col justify-center items-center bg-gray-900">
            <div>

                <input type="file" onChange={(e) => handleFileChange(e)} />
                
                        
            </div>


            {videoUrl && <ReactPlayer

                ref={videoRef}
                url={videoUrl}
                controls={false}
                onPause={() => { socket && socket.emit('pause', videoRef!.current!.getCurrentTime(), userName ) }}
                onPlay={() => { socket &&  socket.emit('play', videoRef!.current!.getCurrentTime(), userName) }}
                playing={isPlaying}
                width='100%'
                height='100%'
                onSeek={()=> {setIsPlaying(false)}}

            />

            }

        </div>
    )
}

export default VideoPlayer;
