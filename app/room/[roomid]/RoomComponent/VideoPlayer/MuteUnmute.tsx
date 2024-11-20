import React, { useCallback, useEffect } from "react";
import { useVideo } from "./VideoPlayerContext";
import { Volume2, VolumeOff } from "lucide-react";

const MuteUnmute = () => {
  const { isMuted, player, setIsMuted, playerCreating } = useVideo();

  const handleMuteUnMute = useCallback(async () => {
    setIsMuted((prev) => !prev);
  }, [setIsMuted]);

  useEffect(() => {
    if (!playerCreating && player.current) {
      isMuted ? player.current.mute() : player.current.unMute();
    }
  }, [playerCreating, player, isMuted]);

  return (
    <div className="hover:cursor-pointer " onClick={handleMuteUnMute}>
      {isMuted ? (
        <VolumeOff className="h-5 w-5 lg:h-6 lg:w-6" />
      ) : (
        <Volume2 className="h-5 w-5 lg:h-6 lg:w-6" />
      )}
    </div>
  );
};

export default MuteUnmute;
