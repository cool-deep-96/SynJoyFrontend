import { useVideo } from "./VideoPlayerContext";
import Controller from "./Controller";
import { Source } from "@/interfaces/interfaces";
import YoutubePlayer from "./YoutubePlayer";
import { BellDot, LucideMessageSquareText } from "lucide-react";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";

const VideoPlayer = () => {
  const { videoRef, url, source, player, isMuted, playerCreating } = useVideo();
  const { setOpenChat } = useSocketUser()!;

  return (
    <div className="relative flex justify-center items-center h-full w-full">
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
      {!playerCreating && (videoRef.current || player.current) && (
        <Controller />
      )}
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
