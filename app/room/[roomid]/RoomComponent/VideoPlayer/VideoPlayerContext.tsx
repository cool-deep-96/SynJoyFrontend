import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";

// types.ts
export interface VideoContextType {
  videoRef: React.RefObject<HTMLVideoElement>; // Ref for the video element
  currentTime: number;
  duration: number;
  captions: string;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setCaptions: (captions: string) => void;
  setCurrentTimeHandle: (number: number) => void;
}

// Default values for the context
const VideoContext = createContext<VideoContextType | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [captions, setCaptions] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
      };

      // const handleCueChange = () => {
      //   const textTracks = videoElement.textTracks;
      //   for (let i = 0; i < textTracks.length; i++) {
      //     const track = textTracks[i];
      //     track.addEventListener("cuechange", () => {
      //       if (track.activeCues && track.activeCues.length > 0) {
      //         setCaptions(track.activeCues[0].text);
      //       }
      //     });
      //   }
      // };

      videoElement.load()
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      // handleCueChange();

      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  const setCurrentTimeHandle = (time: number) => {
    if(videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }

  

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        currentTime,
        duration,
        captions,
        isPlaying,
        setIsPlaying,
        setCurrentTime,
        setDuration,
        setCaptions,
        setCurrentTimeHandle
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
