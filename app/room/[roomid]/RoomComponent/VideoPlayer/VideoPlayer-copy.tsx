import { Pause, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import SettingDrawer from "./SettingDrawer";
import { useVideo } from "./VideoPlayerContext";

const VideoPlayer = () => {
  const {
    videoRef,
    duration,
    currentTime,
    isPlaying,
    captions,
    setCaptions,
    setCurrentTime,
    setIsPlaying,
    setDuration,
  } = useVideo();
  const controlsRef = useRef<HTMLDivElement | null>(null);

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
        videoElement.currentTime = newTime;
        setCurrentTime(newTime);
      } else {
        // Skip backward 10 seconds
        const newTime = Math.max(videoElement.currentTime - skipTime, 0);
        videoElement.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative flex items-center h-full w-full">
      <video
        ref={videoRef}
        preload="metadata"
        src="/Godzilla.mkv"
        autoPlay={false}
      ></video>

      {/* controls */}
      {videoRef.current && (
        <div
          ref={controlsRef}
          onDoubleClick={handleDoubleClick}
          className="absolute h-full w-full "
        >
          <div className="relative h-full w-full left-0 right-0 bg-black/30">
            <div
              onClick={handlePlayPause}
              className="absolute left-[50%] top-[50%] hover:cursor-pointer -translate-x-1/2 -translate-y-1/2 text-white self-center p-2 bg-black/50 rounded-full"
            >
              {isPlaying ? <Pause /> : <Play />}
            </div>

            <div className="absolute bottom-2 px-1 w-full">
              <ProgressBar/>
            </div>

            <div className="absolute right-2">
              <SettingDrawer />
            </div>
          </div>
        </div>
      )}

      {/* controls */}
    </div>
  );
};

export default VideoPlayer;
