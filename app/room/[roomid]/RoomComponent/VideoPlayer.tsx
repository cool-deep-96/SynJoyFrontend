"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useSocketUser } from '../SocketContextProvider/SocketContext';
import toast from 'react-hot-toast';
import { Forward, FullScreen, MuteButton, PauseButton, PictureInPictureAlt, PlayButton, Rewind, SlowMotionVideo, Unmute } from '@/app/Component/AllIcons';


interface Props {
    room_id: string,
    userName: string | null
}

const VideoPlayer = ({ room_id, userName }: Props) => {
    const socket = useSocketUser()?.socket;
    const [file, setFiles] = useState<any>();

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);

    const [videoUrl, setVideoUrl] = useState<string>('');

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [isControls, setIsControls] = useState<boolean>(true);
    const [isPlaybackOption, setIsPlaybackOptions] = useState<boolean>(false);

    const [duration, setDuration] = useState<number>(0);
    const [currentTimePlayed, setCurrentTimePlayed] = useState<number>(0);
    const progressBarRef = useRef<HTMLInputElement | null>(null);
    
    let animationId:number;

    useEffect(() => {
        if (socket) {
            socket.on('pause', (second, userName) => {
                if (videoRef.current) {
                    progressBarRef.current!.value = `${second}`
                    setCurrentTimePlayed(second)
                    videoRef.current!.currentTime = second;
                    videoRef?.current?.pause();
                    setIsControls(true);
                }
                setIsPlaying(false);
            });

            socket.on('play', (second, userName) => {

                if (videoRef.current) {
                    progressBarRef.current!.value = `${second}`
                    setCurrentTimePlayed(second);
                    videoRef.current!.currentTime = second;
                    videoRef?.current?.play();
                }
                setIsPlaying(true);
            });

        } else {
            
        }

    }, [socket]);

  
    videoRef.current?.addEventListener("loadedmetadata", ()=>{
        setDuration(videoRef.current?.duration || 0);
    })

    const handleFileChange = (e: any) => {
        setIsPlaying(false)
        const files = e.target.files[0];

      
        setFiles(files);
        if (files) {
            setVideoUrl(URL.createObjectURL(files));
        }
        videoRef.current?.load();
    }


    const formatTime = (time: number) => {
        let seconds: number = Math.floor(time % 60)
        let minutes: number = Math.floor(time / 60) % 60
        let hours: number = Math.floor(time / 3600)
        if (hours == 0) {
            return `${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`
        }
        return `${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
    }

    const hideControls = () => {
        if (!isPlaying) return;
        setTimeout(() => {
            setIsControls(false);
        }, 1000);
    }

    // onPause={() => { socket && socket.emit('pause', videoRef!.current!.getCurrentTime(), userName) }}
    // onPlay={() => { socket && socket.emit('play', videoRef!.current!.getCurrentTime(), userName) }}

    const handleVideo = () =>{
        if(!isPlaying){
            socket && socket.emit('play', videoRef!.current!.currentTime, userName)
          sliding();
        } else {
           
            socket && socket.emit('pause', videoRef!.current!.currentTime, userName)
          cancelAnimationFrame(animationId); 
        }
      }

    const handleSkip = (number: number)=>{
        socket && socket.emit('play', videoRef!.current!.currentTime + number , userName)
    }

    

    const sliding = ()=>{
        progressBarRef.current!.value =`${videoRef.current?.currentTime}` ||"0";
        setCurrentTimePlayed(parseInt(progressBarRef.current?.value|| "0", 10));
        progressBarRef.current?.style.setProperty('--selected-region', `${(parseInt(progressBarRef.current?.value || "0", 10)/ duration )* 100}%`)
        animationId = requestAnimationFrame(sliding);
    }

    const changeRange = ()=>{
        const currentTimeInSeconds = parseInt(progressBarRef.current?.value || "0", 10);
        videoRef.current!.currentTime = currentTimeInSeconds;
        progressBarRef.current?.style.setProperty('--selected-region', `${(parseInt(progressBarRef.current?.value|| "0", 10)/ duration )* 100}%`)
        setCurrentTimePlayed(parseInt(progressBarRef.current?.value|| "0", 10));
        videoRef?.current?.pause();
        setIsPlaying(false);
        socket && socket.emit('pause', currentTimeInSeconds, userName);
      }


    return (
        <div className="w-full md:h-full py-4 lg:h-full flex flex-col justify-center items-center bg-gray-900">
            <div>
                <input type="file" onChange={(e) => handleFileChange(e)} />
            </div>

                <div className={`relative flex justify-center h-full w-full mx-4 ${videoUrl !== ''? '':'hidden'}`} onMouseLeave={() => hideControls()} onMouseOver={() => setIsControls(true)} onTouchStart={()=> setIsControls(true)}
      onTouchEnd={()=>hideControls()}>
                    <video className='' ref={videoRef} onClick={handleVideo} >
                        <source src={videoUrl} />
                    </video>

                    <div className={`wrapper ${isControls ? '' : 'hidden'} absolute bottom-0 flex flex-col w-full h-20 md:h-28 lg:h-36`}>

                        <div className="my-4" >
                            <div className="progress-area flex flex-col">
                                <input type="range" className='w-full' defaultValue="0" ref={progressBarRef} max={`${duration}`} onChange={changeRange} />
                            </div>
                        </div>

                        <div className="flex flex-row justify-between md:my-2">

                            <div className="mx-1 flex flex-row gap-2">
                                <button className="" onClick={()=>{setIsMuted(!isMuted); videoRef.current!.muted= !isMuted}}>{isMuted? <MuteButton />:<Unmute />}</button>
                                
                                <div className="">
                                    {`${formatTime(currentTimePlayed || 0)}/${formatTime(duration || 0)}`}
                                </div>
                            </div>

                            <div className="flex flex-row gap-3 md:gap-5 lg:gap-10">
                                <button className="skip-backward" onClick={()=>handleSkip(-10)}><Rewind /></button>
                                <button className="play-pause" onClick={handleVideo}>{isPlaying?<PauseButton />:<PlayButton />}</button>
                                <button className="skip-forward" onClick={()=>handleSkip(10)}><Forward /></button>
                            </div>


                            <div className="mr-1 flex flex-row gap-3 md:gap-5">
                                <div className="flex relative">
                                    <div className= {`${isPlaybackOption? '':'hidden'} absolute bottom-0 mb-10 -left-8 bg-white rounded-lg text-black px-4`} >
                                        <div data-speed="2" className={`my-2`}>2x</div>
                                        <div data-speed="1.5" className={`my-2`}>1.5x</div>
                                        <div data-speed="1" className={`my-2`} >Normal</div>
                                        <div data-speed="0.75" className={`my-2`}>0.75x</div>
                                        <div data-speed="0.5" className={`my-2`}>0.5x</div>
                                    </div>
                                    <button className="" onClick={()=>setIsPlaybackOptions(!isPlaybackOption)}><SlowMotionVideo /></button>
                                </div>
                                <button className="pic-in-pic"><PictureInPictureAlt /></button>
                                <button className="fullscreen"><FullScreen /></button>
                            </div>
                        </div>
                    </div>
                </div>
            
        </div>
    )
}

export default VideoPlayer;
