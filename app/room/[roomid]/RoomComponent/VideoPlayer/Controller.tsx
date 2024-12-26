import React, { useEffect, useRef } from "react";
import { SycVideoPayload, useVideo } from "./VideoPlayerContext";
import { Pause, Play } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";
import VideoLoader from "@/components/common/Skeleton/VideoLoader";

const Controller = () => {
  const controlsRef = useRef<HTMLDivElement | null>(null);

  const {
    videoRef,
    player,
    duration,
    source,
    isPlaying,
    currentTime,
    title,
    isBuffering,
    emitVideoSyncToServer,
    url,
  } = useVideo();
  const {  tokenData } = useSocketUser()!;

  const handleDoubleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!controlsRef.current || !(videoRef.current || player.current)) return;

    const controlsElement = controlsRef.current;
    const videoElement = videoRef.current;

    const boundingRect = controlsElement.getBoundingClientRect();
    const clickX = event.clientX;

    const isRightSide = clickX > boundingRect.left + boundingRect.width / 2;
    const skipTime = isRightSide ? 10 : -10;
    let newTime = 0;

    if (videoElement) {
      newTime = Math.max(
        0,
        Math.min(videoElement.currentTime + skipTime, duration)
      );
      videoElement.currentTime = newTime;
    } else if (player.current) {
      const currentTime = await player.current.getCurrentTime();
      newTime = Math.max(0, Math.min(currentTime + skipTime, duration));
      await player.current.seekTo(newTime, true);
    }

    const payload: SycVideoPayload = {
      currentTime: newTime,
      isPlaying: false,
      source,
      tokenData,
      url,
    };

    emitVideoSyncToServer(payload);
  };

  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
    if (player.current) {
      isPlaying ? player.current.playVideo() : player.current.pauseVideo();
    }
  }, [isPlaying, videoRef, player]);

  const handlePlayPause = (is: boolean) => {
    const payload: SycVideoPayload = {
      currentTime,
      isPlaying: is,
      source,
      tokenData,
      url,
    };
    emitVideoSyncToServer(payload);
  };

  return (
    <div
      ref={controlsRef}
      onDoubleClick={handleDoubleClick}
      className="absolute h-full w-full"
    >
      <div className="relative h-full w-full left-0 right-0 bg-black/30">
        <p className="absolute left-3 right-3 text-lg font-bold text-white line-clamp-1 w-[60%]">
          {title}
        </p>
        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-white self-center p-2 bg-black/50 rounded-full">
          {isBuffering ? (
            <VideoLoader />
          ) : isPlaying ? (
            <Pause className=" hover:cursor-pointer " onClick={()=>handlePlayPause(false)} />
          ) : (
            <Play className=" hover:cursor-pointer " onClick={()=>handlePlayPause(true)} />
          )}
        </div>

        <div className="absolute bottom-2 px-1 w-full">
          <ProgressBar />
        </div>

      </div>
    </div>
  );
};

export default Controller;
