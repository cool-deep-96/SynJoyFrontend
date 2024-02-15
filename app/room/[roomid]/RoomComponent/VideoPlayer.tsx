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

    const [videoUrl, setVideoUrl] = useState<string>('');
    const [youtubeUrl, setYoutubeUrl] = useState<string | null>('');
    const [videoId, setVideoId] = useState<string>('')

    const videoRef = useRef<HTMLVideoElement | null>(null);


    const [isControls, setIsControls] = useState<boolean>(true);
    const [isPlaybackOption, setIsPlaybackOptions] = useState<boolean>(false);

    const [duration, setDuration] = useState<number>(0);
    const [currentTimePlayed, setCurrentTimePlayed] = useState<number>(0);
    const progressBarRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [isFullScreen, setIsFullScreen] = useState<Boolean>(false);

    let animationId: number;


    const videoType = () => {
        if (videoId) {
            return false;
        } else {
            return true;
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('pause', async (second, userName) => {
                if (videoRef.current || videoId) {
                    progressBarRef.current!.value = `${second}`
                    setCurrentTimePlayed(second)
                    videoType()? videoRef.current!.currentTime = second : await player?.seekTo(second);;
                    videoType() ? videoRef.current?.pause() : player?.pauseVideo();
                    setIsControls(true);
                }
                setIsPlaying(false);
            });

            socket.on('play', async (second, userName) => {
                if (videoRef.current || videoId) {
                    progressBarRef.current!.value = `${second}`;
                    setCurrentTimePlayed(second);
                    videoType()? videoRef.current!.currentTime = second : await player?.seekTo(second);
                    videoType() ? videoRef.current?.play() : player?.playVideo();
                }
                setIsPlaying(true);
            });

            socket.on('videoId',(videoId, userName)=>{
                setVideoUrl('');
                setVideoId(videoId);
                setYoutubeUrl('');
            });

        } else {

        }

    }, [socket]);

    const youtubeMetaData = async () => {
        const time = await player?.getDuration();
        setDuration(time);
        let iframe: HTMLIFrameElement|null = document.querySelector('iframe');
        iframe?.addEventListener('click',()=>{
            console.log('clicked iframe')
        })

    }

    useEffect(() => {
        if (videoId !== '') {
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
    }, [videoUrl])


    const handleFileChange = (e: any) => {
        setIsPlaying(false)
        const files = e.target.files[0];
        setFiles(files);
        if (files) {
            setVideoId('');
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
            const time = videoType() ? videoRef.current?.currentTime : await player?.getCurrentTime()
            socket && socket.emit('play', time, userName)
            sliding();
        } else {
            // videoType() ? videoRef.current?.pause() : player?.pauseVideo();
            // setIsPlaying(false);
            const time = videoType() ? videoRef.current?.currentTime : await player?.getCurrentTime()
            socket && socket.emit('pause', videoRef!.current!.currentTime, userName)
            cancelAnimationFrame(animationId);
        }
    }

    const handleSkip =async (number: number) => {
        const time = videoType() ? videoRef.current?.currentTime : await player?.getCurrentTime()
        socket && socket.emit(isPlaying ? 'play' : 'pause', time + number, userName)
    }



    const sliding = async () => {
        const time = await player?.getCurrentTime()
        progressBarRef.current!.value = `${videoId === '' ? videoRef.current?.currentTime : time}` || "0";
        setCurrentTimePlayed(parseInt(progressBarRef.current?.value || "0", 10));
        progressBarRef.current?.style.setProperty('--selected-region', `${(parseInt(progressBarRef.current?.value || "0", 10) / duration) * 100}%`)
        animationId = requestAnimationFrame(sliding);
    }

    const changeRange = async () => {
        const currentTimeInSeconds = parseInt(progressBarRef.current?.value || "0", 10);
        videoType()? videoRef.current!.currentTime = currentTimeInSeconds : await player?.seekTo(currentTimeInSeconds);
        progressBarRef.current?.style.setProperty('--selected-region', `${(parseInt(progressBarRef.current?.value || "0", 10) / duration) * 100}%`)
        setCurrentTimePlayed(parseInt(progressBarRef.current?.value || "0", 10));
        socket && socket.emit('pause', currentTimeInSeconds, userName);
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


    return (
        <>
            <div className="w-full md:h-full py-4 lg:h-full flex flex-col justify-center items-center bg-gray-900">
                <div className='flex gap-5 justify-center items-center'>
                    <label htmlFor='ChooseFile' className='hover:cursor-pointer bg-white text-black px-2 py-1 rounded-lg border-b-4 border-r-4  border-yellow-300 hover:border-0'>Choose Video File</label>
                    <input id='ChooseFile' type="file" className='hidden'
                        onChange={(e) => handleFileChange(e)} />
                    <form onSubmit={handleYoutUbeUrl}>
                        <input className='text-lg px-2 py-1 rounded-md bg-red-100 border-red-600 border-2 text-black '
                            placeholder='Paste YouTube Url'
                            type='text'
                            value={youtubeUrl || ''}
                            onChange={(e) => setYoutubeUrl(e.target.value)} />
                        <input type='submit' className='hidden' />
                    </form>
                </div>
                <div className={`relative  flex justify-center h-full w-full mx-4 ${videoUrl !== '' || videoId !== '' ? '' : 'hidden'}`} ref={containerRef}>
                    <div 
                        className={`${videoId !== '' ? '' : 'hidden'} h-[30vh]  w-full  md:h-full bg-red-100 bg-opacity-20`}
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
                        <source src={videoUrl === '' ? '' : videoUrl} />
                    </video>}
                    <div className={`${isControls ? '' : 'hidden'} absolute bottom-0  w-full h-16 md:h-24 lg:h-28 z-10 bg-black bg-opacity-40`}
                        onMouseOver={() => { clearTimeout(timer) }}>
                        <div className={` w-full flex flex-col `}  >
                            <div className="mb-4" >
                                <div className="progress-area flex flex-col">
                                    <input type="range" className='w-full' defaultValue="0" ref={progressBarRef} max={`${duration}`}
                                        onChange={changeRange} />
                                </div>
                            </div>
                            <div className="flex flex-row justify-between md:my-2">
                                <div className="mx-1 flex flex-row gap-2">
                                    <button className=""
                                        onClick={() => { setIsMuted(!isMuted); videoType()? videoRef.current!.muted = !isMuted : (isMuted? player?.unMute() :player?.mute())}}>{isMuted ? <MuteButton /> : <Unmute />}</button>
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