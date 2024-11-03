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
    isMuted
  } = useVideo();
  const [videoId, setVideoId] = useState<string>("");
  const currentTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extracts the video ID from the URL using regex and updates state
  const handleYouTubeUrl = useCallback(
    (url: string) => {
      const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|y\/|\/v\/|\/e\/|watch\?v=|&v=|watch\?.+&v=|&v=|\/vi?\/)([^"&?\/\s]{11})/;
      const match = url?.match(regex);

      if (match) {
        setVideoId(match[1]);
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
      setIsBuffering(false)
    }
  }, [player, setDuration]);

  const updateCurrentTime = useCallback(async () => {
    if (player.current) {
      const currentTime = await player.current.getCurrentTime();
      setCurrentTime(currentTime);
      setIsBuffering(false);
    }
  }, [player, setCurrentTime]);

  // Start updating the current time at regular intervals
  const startUpdatingCurrentTime = useCallback(() => {
    currentTimeIntervalRef.current = setInterval(updateCurrentTime, 1000); // update every second
  }, [updateCurrentTime]);

  // Stop updating the current time
  const stopUpdatingCurrentTime = useCallback(() => {
    if (currentTimeIntervalRef.current) {
      clearInterval(currentTimeIntervalRef.current);
      currentTimeIntervalRef.current = null;
    }
  }, []);

  // Effect to initialize or update the YouTube player when videoId changes
  useEffect(() => {
    if (videoId) {
      if (player.current) {
        player.current?.destroy(); // Clean up previous player instance if it exists
      }

      player.current = YouTubePlayer("youtubePlayer", {
        videoId,
        playerVars: {
          controls: 0,
        },
      });

      player.current?.on("ready", updateDuration); // Use event listener to update metadata// Store the YouTube player instance
      player.current?.on("stateChange", (event: any) => {
        if (event.data === 1) {
          startUpdatingCurrentTime();
        } else if (event.data === 2) {
          stopUpdatingCurrentTime(); // Stop updating when video is paused or ended
        } else if (event.id === 0) {
          stopUpdatingCurrentTime();
          setIsPlaying(false);
        } else if(event.id === 3) {
          setIsBuffering(true)
        }
      });
      return () => {
        if (player.current) player.current?.destroy(); // Clean up player on component unmount
      };
    }
  }, [
    videoId,
    player,
    updateDuration,
    updateCurrentTime,
    startUpdatingCurrentTime,
    stopUpdatingCurrentTime,
  ]);

  // Effect to handle the URL change
  useEffect(() => {
    if (url) handleYouTubeUrl(url);
  }, [url, handleYouTubeUrl]);


  return <div className="hidden"></div>;
};

export default YoutubePlayer;
