import React, { useCallback, useEffect, useRef, useState } from "react";
import YouTubePlayer from "youtube-player";
import { useVideo } from "./VideoPlayerContext";
import toast from "react-hot-toast";

const YoutubePlayer = () => {
  const {
    url,
    setDuration,
    setUrl,
    player,
    setCurrentTime,
    setIsBuffering,
    setIsPlaying,
    setPlayerCreating,
  } = useVideo();
  const [videoId, setVideoId] = useState<string>("");
  const currentTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to extract video ID from the URL
  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|y\/|\/v\/|\/e\/|watch\?v=|&v=|watch\?.+&v=|&v=|\/vi?\/)([^"&?\/\s]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };

  // Handle URL changes and validate YouTube URL
  const handleYouTubeUrl = useCallback(
    (newUrl: string) => {
      const id = extractVideoId(newUrl);
      if (id) {
        setVideoId(id);
      } else {
        toast.error("Invalid YouTube URL");
        setVideoId("");
        setUrl("");
      }
    },
    [setUrl]
  );

  // Updates the video duration using YouTube API
  const updateDuration = useCallback(async () => {
    if (player.current) {
      const duration = await player.current.getDuration();
      if (duration) setDuration(duration);
      setIsBuffering(false);
      setPlayerCreating(false);
    }
  }, [player, setDuration, setIsBuffering, setPlayerCreating]);

  // Updates the current playback time
  const updateCurrentTime = useCallback(async () => {
    if (player.current) {
      const currentTime = await player.current.getCurrentTime();
      setCurrentTime(currentTime);
    }
  }, [player, setCurrentTime]);

  // Start/Stop updating current time
  const startUpdatingCurrentTime = useCallback(() => {
    if (!currentTimeIntervalRef.current) {
      currentTimeIntervalRef.current = setInterval(updateCurrentTime, 1000);
    }
  }, [updateCurrentTime]);

  const stopUpdatingCurrentTime = useCallback(() => {
    if (currentTimeIntervalRef.current) {
      clearInterval(currentTimeIntervalRef.current);
      currentTimeIntervalRef.current = null;
    }
  }, []);

  // Initialize the YouTube player
  const initializePlayer = useCallback(() => {
    if (videoId) {
      player.current = YouTubePlayer("youtubePlayer", {
        videoId,
        playerVars: { controls: 0 },
      });

      player.current.on("ready", updateDuration);
      player.current.on("stateChange", (event: any) => {
        switch (event.data) {
          case 1: // Playing
            startUpdatingCurrentTime();
            setIsPlaying(true);
            setIsBuffering(false);
            break;
          case 2: // Paused
            stopUpdatingCurrentTime();
            setIsPlaying(false);
            setIsBuffering(false);
            break;
          case 0: // Ended
            stopUpdatingCurrentTime();
            setIsPlaying(false);
            setIsBuffering(false);
            break;
          case 3: // Buffering
            setIsBuffering(true);
            break;
          default:
            break;
        }
      });
    }
  }, [
    videoId,
    player,
    updateDuration,
    startUpdatingCurrentTime,
    stopUpdatingCurrentTime,
    setIsPlaying,
    setIsBuffering,
  ]);

  // Effect: Handle URL changes
  useEffect(() => {
    if (url) {
      handleYouTubeUrl(url);
    }
  }, [url, handleYouTubeUrl]);

  // Effect: Initialize player when videoId changes
  useEffect(() => {
    setPlayerCreating(true);
    initializePlayer();
    console.log("initialized again");

    return () => {
      stopUpdatingCurrentTime();
      if (player.current) {
        player.current.destroy();
        console.log(player.current); // Cleanup on unmount
      }
    };
  }, [initializePlayer, stopUpdatingCurrentTime, player, setPlayerCreating]);

  return <div className="hidden"></div>;
};

export default YoutubePlayer;
