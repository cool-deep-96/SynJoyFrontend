import { Pause, Play } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import ProgressBar from "./VideoPlayer/ProgressBar";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Load metadata and update current time on time update
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => setDuration(videoElement.duration);
    const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // Play/Pause handler
  const handlePlayPause = useCallback(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      isPlaying ? videoElement.pause() : videoElement.play();
      setIsPlaying((prev) => !prev);
    }
  }, [isPlaying]);

  // Handle double click for forward/backward skip
  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const controlsElement = controlsRef.current;
      const videoElement = videoRef.current;
      if (!controlsElement || !videoElement) return;

      const boundingRect = controlsElement.getBoundingClientRect();
      const clickX = event.clientX;
      const isRightSide = clickX > boundingRect.left + boundingRect.width / 2;
      const skipTime = 10; // seconds
      const newTime = isRightSide
        ? Math.min(currentTime + skipTime, duration)
        : Math.max(currentTime - skipTime, 0);

      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [currentTime, duration]
  );

  return (
    <div className="relative flex items-center h-full w-full">
      <video ref={videoRef} preload="metadata" src="/Godzilla.mkv" />

      {/* Controls */}
      <div
        ref={controlsRef}
        onDoubleClick={handleDoubleClick}
        className="absolute h-full w-full"
      >
        <div className="relative h-full w-full left-0 right-0 bg-white/30">
          {/* Play/Pause Button */}
          <div
            onClick={handlePlayPause}
            className="absolute left-[50%] top-[50%] hover:cursor-pointer -translate-x-1/2 -translate-y-1/2 text-white p-2 bg-black/50 rounded-full"
          >
            {isPlaying ? <Pause /> : <Play />}
          </div>

          {/* ProgressBar */}
          <div className="absolute bottom-2 px-1 w-full">
            <ProgressBar
              duration={duration}
              currentTime={currentTime}
              onProgressBarChange={(time:number) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = time;
                  setCurrentTime(time);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
