"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import LiveChat from "./LiveChat";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer/VideoPlayer-copy";
import { VideoProvider } from "./VideoPlayer/VideoPlayerContext";

export const Ui = () => {
  const [direction, setDirection] = useState<"vertical" | "horizontal">(
    "vertical"
  );

  // Detect screen size and update direction
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setDirection("vertical"); // Mobile view: Vertical split
    } else {
      setDirection("horizontal"); // Desktop view: Horizontal split
    }
  };

  useEffect(() => {
    // Set initial direction based on screen size
    handleResize();

    // Add event listener to handle window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ResizablePanelGroup
      key={direction} // Force re-render on direction change
      direction={direction}
      className="rounded-lg max-h-screen min-h-screen"
    >
      <ResizablePanel
        defaultSize={direction === "vertical" ? 20 : 70}
        className="flex items-center min-h-[25vh] "
      >
        <div className="flex items-center h-fit justify-center">
          <VideoProvider>
            <VideoPlayer />
          </VideoProvider>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={direction === "vertical" ? 80 : 30}
        className="overflow-y-scroll pb-8 lg:pb-0"
      >
        <LiveChat />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
