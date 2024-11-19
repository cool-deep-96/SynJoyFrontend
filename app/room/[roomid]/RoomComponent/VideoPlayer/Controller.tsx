import React, { useEffect, useRef } from "react";
import { SycVideoPayload, useVideo } from "./VideoPlayerContext";
import {
  BellDot,
  Dot,
  LucideMessageSquareText,
  Pause,
  Play,
} from "lucide-react";
import ProgressBar from "./ProgressBar";
import SettingDrawer from "./SettingDrawer";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";
import VideoLoader from "@/components/common/Skeleton/VideoLoader";

const Controller = () => {
  const controlsRef = useRef<HTMLDivElement | null>(null);

  const {
    videoRef,
    currentTime,
    setCurrentTime,
    duration,
    isPlaying,
    setIsPlaying,
    title,
    player,
    isBuffering,
    source,
    emitVideoSyncToServer,
    url,
  } = useVideo();
  const { openChat, setOpenChat, tokenData } = useSocketUser()!;

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const controlsElement = controlsRef.current;
    const videoElement = videoRef.current;

    if (controlsElement && videoElement) {
      const boundingRect = controlsElement.getBoundingClientRect();
      const clickX = event.clientX;

      // Check if the click is on the left or right half
      const isRightSide = clickX > boundingRect.left + boundingRect.width / 2;
      const skipTime = 10; // seconds

      if (isRightSide) {
        // Skip forward 10 seconds
        const newTime = Math.min(videoElement.currentTime + skipTime, duration);
        const payload: SycVideoPayload = {
          currentTime: newTime,
          isPlaying: false,
          source,
          tokenData,
          url,
        };
        emitVideoSyncToServer(payload);
      } else {
        // Skip backward 10 seconds
        const newTime = Math.max(videoElement.currentTime - skipTime, 0);
        const payload: SycVideoPayload = {
          currentTime: newTime,
          isPlaying: false,
          source,
          tokenData,
          url,
        };
        emitVideoSyncToServer(payload);
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
    if (player.current) {
      isPlaying ? player.current.playVideo() : player.current.pauseVideo();
    }
  }, [isPlaying, videoRef, player]);

  const handlePlayPause = () => {
    const payload: SycVideoPayload = {
      currentTime,
      isPlaying: !isPlaying,
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
        <div className="absolute left-[50%] top-[50%] hover:cursor-pointer -translate-x-1/2 -translate-y-1/2 text-white self-center p-2 bg-black/50 rounded-full">
          {isBuffering ? (
            <VideoLoader />
          ) : isPlaying ? (
            <Pause onClick={handlePlayPause} />
          ) : (
            <Play onClick={handlePlayPause} />
          )}
        </div>

        <div className="absolute bottom-2 px-1 w-full">
          <ProgressBar />
        </div>

        <div className="absolute right-2 top-2 md:right-3 md:top-3">
          <SettingDrawer />
        </div>

        {
          <div
            className="absolute bottom-0  right-0 my-4 px-5  md:flex cursor-pointer"
            onClick={() => setOpenChat((prev) => !prev)}
          >
            <div className="relative">
              <BellDot className="absolute left-[75%] w-3 p-[1px] h-3 bg-red-600 rounded-full " />
              <LucideMessageSquareText className="text-green-300  md:w-8 h-auto" />
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Controller;
