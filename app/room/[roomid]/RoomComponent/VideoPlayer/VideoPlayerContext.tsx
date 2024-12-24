import { Source, TokenData } from "@/interfaces/interfaces";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  RefObject,
  MutableRefObject,
} from "react";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";
import { SOCKET_CHANNEL } from "@/interfaces/socket_channels";

// types.ts

export interface SycVideoPayload {
  source: Source;
  currentTime: number;
  isPlaying: boolean;
  tokenData: TokenData | null;
  url: string | null;
}
export interface VideoContextType {
  videoRef: RefObject<HTMLVideoElement>;
  source: Source;
  url: string | null;
  title: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  isMuted: boolean;
  isFullScreen: boolean;
  isBuffering: boolean;
  playerCreating: boolean;
  player: MutableRefObject<YouTubePlayer | undefined>;
  setSource: Dispatch<SetStateAction<Source>>;
  setUrl: Dispatch<SetStateAction<string | null>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setDuration: Dispatch<SetStateAction<number>>;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
  setIsFullScreen: Dispatch<SetStateAction<boolean>>;
  setIsBuffering: Dispatch<SetStateAction<boolean>>;
  setPlayerCreating: Dispatch<SetStateAction<boolean>>;
  emitVideoSyncToServer: (payload: SycVideoPayload) => void;
}

// Default values for the context
const VideoContext = createContext<VideoContextType | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<Source>(Source.YOUTUBE);
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string | null>("https://youtu.be/bS-0X0Rw7f0?si=7w0mpUuDyD856Am7");
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [playerCreating, setPlayerCreating] = useState<boolean>(false);
  const player = useRef<YouTubePlayer>();
  const { socket } = useSocketUser();

  const emitVideoSyncToServer = (payload: SycVideoPayload) => {
    if (socket) {
      socket.emit(SOCKET_CHANNEL.SYNC_VIDEO_CHANNEL, payload);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
        setIsBuffering(false);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
      };

      const handleWaiting = () => {
        setIsBuffering(true);
      };

      const handleCanPlay = () => {
        setIsBuffering(false);
      };

      videoElement.load();
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("waiting", handleWaiting);
      videoElement.addEventListener("canplay", handleCanPlay);
      setIsBuffering(true);

      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [url]);

  useEffect(() => {
    if (socket) {
      socket.on(
        SOCKET_CHANNEL.SYNC_VIDEO_CHANNEL,
        (payload: SycVideoPayload) => {
          if (payload.source === Source.FILE && videoRef.current) {
            setSource(payload.source);
            setCurrentTime(payload.currentTime);
            videoRef.current.currentTime = payload.currentTime;
            setIsPlaying(payload.isPlaying);
          } else if (payload.source === Source.YOUTUBE && payload.url) {
            setSource(payload.source);
            setUrl(payload.url);
            setCurrentTime(payload.currentTime);
            if (player.current) {
              player.current.seekTo(payload.currentTime, true);
              setIsPlaying(payload.isPlaying);
            }
            setTitle("");
          }
        }
      );
    }
  }, [socket]);

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        source,
        url,
        title,
        duration,
        currentTime,
        isPlaying,
        isMuted,
        isFullScreen,
        player,
        isBuffering,
        playerCreating,
        setSource,
        setUrl,
        setTitle,
        setDuration,
        setCurrentTime,
        setIsPlaying,
        setIsMuted,
        setIsFullScreen,
        setIsBuffering,
        emitVideoSyncToServer,
        setPlayerCreating,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

// Hook to use the VideoContext in functional components
export const useVideo = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};
