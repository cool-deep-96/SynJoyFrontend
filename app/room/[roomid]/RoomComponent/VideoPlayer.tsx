"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useSocketUser } from '../SocketContextProvider/SocketContext';
import { ExitFullscreen, Forward, FullScreen, MuteButton, PauseButton, PictureInPictureAlt, PlayButton, Rewind, SlowMotionVideo, Unmute } from '@/app/Component/AllIcons';
import toast from 'react-hot-toast';
import YouTubePlayer from 'youtube-player';

interface Props {
    room_id: string,
    userName: string | null
}

var timer: any;
var player: any;

const VideoPlayer = ({ room_id, userName }: Props) => {
    const socket = useSocketUser()?.socket;
    const [file, setFiles] = useState<any>();

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);

    const [videoUrl, setVideoUrl] = useState<string|null>('');
    const [youtubeUrl, setYoutubeUrl] = useState<string | null>('');
    var [videoId, setVideoId] = useState<string|null>('')

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const progressBeforeRef = useRef<HTMLDivElement| null>(null); 
    const containerRef = useRef<HTMLDivElement | null>(null);
    const seekBoxRef = useRef<HTMLDivElement| null>(null);
    

    const [isControls, setIsControls] = useState<boolean>(true);
    const [isPlaybackOption, setIsPlaybackOptions] = useState<boolean>(false);

    const [duration, setDuration] = useState<number>(0);
    const [currentTimePlayed, setCurrentTimePlayed] = useState<number>(0);
    const [seekTime, setSeekTime]= useState<number>(0);

    const [isFullScreen, setIsFullScreen] = useState<Boolean>(false);

    let animationId: number;

    useEffect(() => {
        if (socket) {
            socket.on('pause', async (second, userName) => {
                if (videoRef.current || videoId) {
                    progressBeforeRef.current!.style.width = `${(second/duration)*100}%`
                    setCurrentTimePlayed(second)
                    videoId?  await player?.seekTo(second) : videoRef.current!.currentTime = second ;
                    videoId?  player?.pauseVideo():videoRef.current?.pause();
                    setIsControls(true);
                    cancelAnimationFrame(animationId);
                }
                setIsPlaying(false);
            });

            socket.on('play', async (second, userName) => {
                if (videoRef.current || videoId) {
                    progressBeforeRef.current!.style.width = `${(second/duration)*100}%`
                    setCurrentTimePlayed(second);
                    videoId?  await player?.seekTo(second) : videoRef.current!.currentTime = second ;
                    videoId? player?.playVideo() : videoRef.current?.play();
                    sliding();
                }
                setIsPlaying(true);
            });

            socket.on('videoId',(videoId, userName)=>{
                setVideoUrl('');
                setYoutubeUrl('');
                setVideoId(videoId);
            });

        } else {

        }

    }, [socket, videoId, duration]);

    const youtubeMetaData = async () => {
        const time = await player?.getDuration();
        setDuration(time);
    }

    useEffect(() => {
        if (videoId) {
            player?.destroy();
            player = YouTubePlayer('youtubePlayer', {
                videoId: `${videoId}`,
                playerVars: {
                    controls: 0
                },
            });
            player?.addEventListener("onReady", youtubeMetaData());
        } else {
            player?.destroy();
        }
    }, [videoId]);

    useEffect(() => {
        videoRef.current?.load();
        videoRef.current?.addEventListener("loadedmetadata", () => {
            setDuration(videoRef.current?.duration || 0);
        });
    }, [videoId])


    const handleFileChange = (e: any) => {
        setIsPlaying(false)
        const files = e.target.files[0];
        setFiles(files);
        if (files) {
            setVideoId(null);
            setVideoUrl(URL.createObjectURL(files));
        }

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
        timer = setTimeout(() => {
            setIsControls(false);
        }, 1000);
    }


    const handleVideo = async () => {
        if (!isPlaying) {
            const time = videoId?  await player?.getCurrentTime():videoRef.current?.currentTime
            socket && socket.emit('play', time, userName)
            
        } else {
            const time = videoId ? await player?.getCurrentTime() : videoRef.current?.currentTime
            socket && socket.emit('pause', time, userName)
            
        }
    }

    const handleSkip =async (number: number) => {
        const time = videoId? await player?.getCurrentTime() :videoRef.current?.currentTime 
        socket && socket.emit(isPlaying ? 'play' : 'pause', time + number, userName)
    }



    const sliding = async () => {
        if(progressBarRef.current && progressBeforeRef.current){

            const time = videoId? await player?.getCurrentTime() :videoRef.current?.currentTime 
            progressBeforeRef.current.style.width = `${(time/duration)*100}%`
            setCurrentTimePlayed(time);
            animationId = requestAnimationFrame(sliding);
        }
    }

    const changeRange = async () => {
        if(progressBarRef.current && progressBeforeRef.current)
        {
            const currentTimeInSeconds = seekTime;
            videoId? await player?.seekTo(currentTimeInSeconds):videoRef.current!.currentTime = currentTimeInSeconds 
            progressBeforeRef.current.style.width = `${(seekTime/duration)*100}%`
            setCurrentTimePlayed(seekTime);
            
            socket && socket.emit('pause', currentTimeInSeconds, userName);
        }
    }

    const handleYoutUbeUrl = (e: any) => {
        e.preventDefault();
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|y\/|\/v\/|\/e\/|watch\?v=|&v=|watch\?.+&v=|&v=|\/vi?\/)([^"&?\/\s]{11})/;
        const match = youtubeUrl?.match(regex);

        if (match) {
            socket && socket.emit('videoId', match[1], userName);
        } else {
            toast.error('Invalid Youtube Url')
            setYoutubeUrl('');
        }

    }

    const fullScreenHandle = () => {
        if (isFullScreen) {
            document.exitFullscreen();
            setIsFullScreen(false);
        } else {
            containerRef.current?.requestFullscreen();
            setIsFullScreen(true);
        }
    }

    const seekingHandle = (e:MouseEvent)=>{
        if(progressBarRef.current && seekBoxRef.current){
            const range = progressBarRef.current.getBoundingClientRect();
    

            if(e.clientX + seekBoxRef.current.clientWidth <= range.right){
                seekBoxRef.current.style.left = `${e.clientX}px`
            } else {
                seekBoxRef.current.style.left = `${range.right-(seekBoxRef.current.clientWidth + 5)}px`
            }

            if(e.clientX>range.left && e.clientX<range.right){
                const todisplayTime = (((e.clientX - range.left) )/range.width) * duration;
                setSeekTime(todisplayTime);
            }

            
        }
        

    }


    return (
        <>
            <div className="w-full md:h-full py-4 lg:h-full flex flex-col justify-center items-center bg-gray-900">
                <div className='flex gap-5 justify-center items-center'>
                    <label htmlFor='ChooseFile' className='hover:cursor-pointer bg-white text-sm text-black px-2 py-1 rounded-lg border-b-4 border-r-4  border-yellow-300 hover:border-0'>Choose Video File</label>
                    <input id='ChooseFile' type="file" className='hidden'
                        onChange={(e) => handleFileChange(e)} />
                    <form onSubmit={handleYoutUbeUrl}>
                        <input className='text-md px-2 py-1 rounded-l-md bg-red-100 w-40 border-red-600 border text-black '
                            placeholder='Paste YouTube Url'
                            type='text'
                            value={youtubeUrl || ''}
                            onChange={(e) => setYoutubeUrl(e.target.value)} />
                        <input type='submit' className='bg-red-600 text-md px-2 py-1 rounded-r-md' value="GO"/>
                    </form>
                </div>
                <div className={`relative  flex justify-center h-full w-full mx-4 ${videoUrl || videoId ? '' : 'hidden'}`} ref={containerRef}>
                    <div 
                        className={`${videoId? '' : 'hidden'} h-[30vh]  w-full  md:h-full bg-red-100 bg-opacity-20`}
                        onClick={handleVideo}
                        onMouseMove={() => { setIsControls(true); clearTimeout(timer); hideControls() }}
                        onTouchStart={() => setIsControls(true)}
                        onTouchEnd={() => hideControls()} >
                        
                            <div id='youtubePlayer' className='h-full w-full' style={{ pointerEvents: 'none' }}></div>
                        
                    </div>
                    {videoUrl && <video
                   
                        ref={videoRef}
                        onClick={handleVideo}
                        onMouseMove={() => { setIsControls(true); clearTimeout(timer); hideControls() }}
                        onTouchStart={() => setIsControls(true)}
                        onTouchEnd={() => hideControls()} >
                        <source src={videoUrl === '' ? '' : videoUrl} 
                        />
                    </video>}
                    <div className={`${isControls ? '' : 'hidden'} absolute bottom-0  w-full h-16 md:h-24 lg:h-28 z-10 bg-black bg-opacity-40`}
                        onMouseOver={() => { clearTimeout(timer) }}>
                        <div className={` w-full flex flex-col `}  >
                            <div className="mb-4" >
                                <div className="progress-area flex flex-col relative group/progress bg-white h-[6px] mx-1 rounded-full"
                                    onMouseMove={(e: any)=>seekingHandle(e)} ref={progressBarRef}
                                    onClick={()=>{changeRange()}}
                                >
                                    <div className='absolute left-0 h-full bg-blue-500 rounded-full flex justify-end items-center' ref={progressBeforeRef}>
                                        <div className='h-[15px] w-[15px] bg-blue-500 rounded-full'></div>
                                    </div>
                                    <div className='absolute bottom-full text-sm font-light -translate-y-2 bg-black px-1 rounded-md group-hover/progress:flex hidden' ref={seekBoxRef}>
                            
                                           {`${formatTime(seekTime || 0)}`}
                                       
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between md:my-2">
                                <div className="mx-1 flex flex-row gap-2">
                                    <button className=""
                                        onClick={() => { setIsMuted(!isMuted); videoId? (isMuted? player?.unMute() :player?.mute()): videoRef.current!.muted = !isMuted}}>{isMuted ? <MuteButton /> : <Unmute />}</button>
                                    <div className="">
                                        {`${formatTime(currentTimePlayed || 0)}/${formatTime(duration || 0)}`}
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3 md:gap-5 lg:gap-10">
                                    <button className="skip-backward" onClick={() => handleSkip(-10)}><Rewind /></button>
                                    <button className="play-pause" onClick={handleVideo}>{isPlaying ? <PauseButton /> : <PlayButton />}</button>
                                    <button className="skip-forward" onClick={() => handleSkip(10)}><Forward /></button>
                                </div>
                                <div className="mr-1 flex flex-row gap-3 md:gap-5">
                                    <div className="flex relative">
                                        <div className={`${isPlaybackOption ? '' : 'hidden'} absolute bottom-0 mb-10 -left-8 bg-white rounded-lg text-black px-4`} >
                                            <div data-speed="2" className={`my-2`}>2x</div>
                                            <div data-speed="1.5" className={`my-2`}>1.5x</div>
                                            <div data-speed="1" className={`my-2`} >Normal</div>
                                            <div data-speed="0.75" className={`my-2`}>0.75x</div>
                                            <div data-speed="0.5" className={`my-2`}>0.5x</div>
                                        </div>
                                        <button className="" onClick={() => setIsPlaybackOptions(!isPlaybackOption)}><SlowMotionVideo /></button>
                                    </div>
                                    <button className="pic-in-pic"><PictureInPictureAlt /></button>
                                    <button className="" onClick={() => fullScreenHandle()}>{isFullScreen ? <ExitFullscreen /> : <FullScreen />}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VideoPlayer;