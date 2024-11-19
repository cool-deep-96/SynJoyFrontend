import React, {
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { formatTime } from "./utils";
import { SycVideoPayload, useVideo } from "./VideoPlayerContext";
import MuteUnmute from "./MuteUnmute";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";

const ProgressBar = () => {
  const progressBeforeRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [seekingTime, setSeekTime] = useState<number>(0);
  const seekingTimeRef = useRef<number>(0);
  const [showSeekTime, setShowSeekTime] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  const { currentTime, duration, source, emitVideoSyncToServer, url } =
    useVideo();
  const { tokenData } = useSocketUser();

  // Update progress bar width when currentTime or duration changes
  useEffect(() => {
    if (!isDragging && progressBeforeRef.current && duration > 0) {
      const fraction = currentTime / duration;
      const newWidth = fraction * 100;
      progressBeforeRef.current.style.width = `${newWidth}%`;
    }
  }, [currentTime, duration, isDragging]);

  const handleShowSeekTime = () => {
    if (!isDragging) {
      setShowSeekTime(false);
    }
  };

  // Handle the progress bar seeking logic on click
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && progressBeforeRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const progressBarWidth = rect.width;
      const fraction = clickX / progressBarWidth;
      const newWidth = fraction * 100;
      progressBeforeRef.current.style.width = `${newWidth}%`;

      const payload: SycVideoPayload = {
        currentTime: fraction * duration,
        isPlaying: false,
        source,
        tokenData,
        url,
      };
      emitVideoSyncToServer(payload);
    }
  };

  // Common logic to handle progress bar movement for both mouse and touch events
  const slideThumb = (clientX: number) => {
    if (progressBarRef.current && thumbRef.current) {
      setIsDragging(true);
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const progressBarWidth = rect.width;
      const fraction = Math.min(Math.max(clickX / progressBarWidth, 0), 1); // Ensure it's between 0 and 1

      const thumbPosition = fraction * progressBarWidth;
      thumbRef.current.style.left = `${thumbPosition}px`;

      // Update both the state and the ref with the latest seeking time
      const newSeekingTime = fraction * duration;
      setSeekTime(newSeekingTime);
      seekingTimeRef.current = newSeekingTime;
    }
  };

  const drag = (e: MouseEvent<HTMLDivElement>) => {
    const handleMouseMove = (event: any) => {
      slideThumb(event.clientX);
    };

    const handleMouseUp = () => {
      if (progressBeforeRef.current) {
        const newWidth = (seekingTimeRef.current / duration) * 100;
        progressBeforeRef.current.style.width = `${newWidth}%`;
      }
      const payload: SycVideoPayload = {
        currentTime: seekingTimeRef.current,
        isPlaying: false,
        source,
        tokenData,
        url,
      };
      emitVideoSyncToServer(payload);
      setIsDragging(false);
      setShowSeekTime(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Touch drag handling
  const touchDrag = (e: TouchEvent<HTMLDivElement>) => {
    const handleTouchMove = (event: any) => {
      slideThumb(event.touches[0].clientX); // Use the touch X position
    };

    const handleTouchEnd = () => {
      const payload: SycVideoPayload = {
        currentTime: seekingTimeRef.current,
        isPlaying: false,
        source,
        tokenData,
        url,
      };
      emitVideoSyncToServer(payload); // Finalize seek time
      setIsDragging(false);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  // Handle hover to show the time at the hover position
  const handleHover = (e: MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const hoverX = e.clientX - rect.left;
      const progressBarWidth = rect.width;
      const hoverFraction = Math.min(Math.max(hoverX / progressBarWidth, 0), 1); // Ensure it's between 0 and 1

      // Calculate hover time and set it in state
      setSeekTime(hoverFraction * duration);
      setShowSeekTime(true);
    }
  };

  // Clear hover time when not hovering

  return (
    <div className="flex flex-col gap-3 md:flex-col-reverse select-none">
      {/* Current time display */}
      <div className="text-xs md:text-sm select-none flex gap-3 lg:gap-5 items-center justify-start py-1 px-2 lg:py-3">
        <p className="min-w-28">
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
        <MuteUnmute />
      </div>

      <div
        className="progress-area relative group/progress hover:cursor-pointer bg-gray-200 h-1 lg:h-2 rounded-full w-full"
        ref={progressBarRef}
        onClick={handleClick}
        onMouseMove={handleHover}
        onMouseLeave={handleShowSeekTime}
      >
        {/* Progress before (filled part) */}
        <div
          className={`absolute left-0 h-full bg-red-500 rounded-full flex  ${
            isDragging ? "" : " justify-end"
          } items-center`}
          ref={progressBeforeRef}
        >
          <div
            ref={thumbRef}
            className={`${
              isDragging ? "absolute" : ""
            } h-2 w-2 lg:h-3 lg:w-3 hover:h-3 hover:w-3 lg:hover:h-4 lg:hover:w-4 active:bg-blue-500 translate-x-[50%] rounded-full hover:cursor-pointer bg-red-700 duration-300 transition-colors ease-in-out`}
            onMouseDown={drag}
            onTouchStart={touchDrag}
          ></div>
        </div>

        {/* Hover time display */}

        <div
          className={`absolute left-[50%] -translate-x-1/2 bottom-full text-sm font-light -translate-y-7 bg-black px-1 rounded-md ${
            showSeekTime ? "flex" : "hidden"
          }  select-none duration-300 transition-all ease-in-out`}
        >
          {formatTime(seekingTime)}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
