"use client";
import { useVideo } from "./VideoPlayerContext";
import Controller from "./Controller";
import { Source } from "@/interfaces/interfaces";
import YoutubePlayer from "./YoutubePlayer";
import { BellDot, LucideMessageSquareText } from "lucide-react";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";
import { useEffect, useRef, useState } from "react";

const VideoPlayer = () => {
  const { videoRef, url, source, player, isMuted, playerCreating } = useVideo();
  const { setOpenChat } = useSocketUser()!;
  const [showController, setShowController] = useState<boolean>(true);

  const timer = useRef<NodeJS.Timeout | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Function to reset timer and show the controller
  const resetTimer = () => {
    setShowController(true);
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setShowController(false);
    }, 2000);
  };

  useEffect(() => {
    const handleMouseMove = () => resetTimer();
    const handleTouchStart = () => resetTimer();

    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchstart", handleTouchStart);
    }

    // Clean up
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchstart", handleTouchStart);
      }
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      ref={playerContainerRef}
      className="relative flex justify-center items-center h-full w-full"
    >
      <div
        className={`h-full md:h-screen w-full flex items-center justify-center ${
          source === Source.YOUTUBE ? "" : "hidden"
        }`}
      >
        <div
          id="youtubePlayer"
          className={`w-full max-h-screen`}
          style={{ pointerEvents: "none" }}
        ></div>
      </div>
      {source && url && source === Source.FILE ? (
        <video
          ref={videoRef}
          preload="metadata"
          src={url}
          className="w-fit  md:w-full h-full max-h-screen"
          muted={isMuted}
        ></video>
      ) : (
        <YoutubePlayer />
      )}
      {/* controls */}
      {showController &&
        !playerCreating &&
        (videoRef.current || player.current) && <Controller />}
      {/* controls */}

      <div
        className="absolute bottom-0 z-3 right-0 my-4 px-5  md:flex cursor-pointer"
        onClick={() => setOpenChat((prev) => !prev)}
      >
        <div className="relative">
          <BellDot className="absolute left-[75%] w-3 p-[1px] h-3 bg-red-600 rounded-full " />
          <LucideMessageSquareText className="text-green-300  md:w-8 h-auto" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
