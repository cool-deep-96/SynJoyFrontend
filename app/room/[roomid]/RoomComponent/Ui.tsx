import React, { useEffect, useState, useRef, useCallback } from "react";
import LiveChat from "./LiveChat";
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import { VideoProvider } from "./VideoPlayer/VideoPlayerContext";
import { useSocketUser } from "../SocketContextProvider/SocketContext";
import Info from "./Info";
import LiveChatHead from "./LiveChatHead";

export const Ui = () => {
  const [direction, setDirection] = useState<"vertical" | "horizontal">(
    "vertical"
  );
  const [chatWidth, setChatWidth] = useState<number>(30);
  const { openChat } = useSocketUser();
  const [isResizing, setIsResizing] = useState(false);
  const resizableRef = useRef<HTMLDivElement | null>(null);

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
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (direction === "horizontal") {
      openChat ? setChatWidth(30) : setChatWidth(0);
    }
    if (direction === "vertical") {
      openChat ? setChatWidth(70) : setChatWidth(0);
    }
  }, [openChat, direction]);

  // Start resizing for both mouse and touch
  const handleStartResize = (e: any) => {
    setIsResizing(true);
  };

  // Handle resizing movement for both mouse and touch
  const handleResizeMove = useCallback(
    (e: any) => {
      if (!isResizing || !resizableRef.current) return;
      const resizableRect = resizableRef.current.getBoundingClientRect();
      let clientX: number, clientY: number;

      // Extract touch or mouse positions
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      if (direction === "horizontal") {
        // Horizontal resizing (adjust width)
        const newChatWidth =
          ((resizableRect.right - clientX) / window.innerWidth) * 100;
        setChatWidth(
          newChatWidth > 5 ? (newChatWidth < 95 ? newChatWidth : 95) : 5
        ); // Limit to 5% - 95%
      } else {
        // Vertical resizing (adjust height)
        const newChatHeight =
          ((resizableRect.bottom - clientY) / window.innerHeight) * 100;
        setChatWidth(
          newChatHeight > 5 ? (newChatHeight < 95 ? newChatHeight : 95) : 5
        ); // Limit to 5% - 95%
      }
    },
    [direction, isResizing]
  );

  // Stop resizing for both mouse and touch
  const handleEndResize = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    // Add event listeners for mouse and touch events
    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleEndResize);
    window.addEventListener("touchmove", handleResizeMove);
    window.addEventListener("touchend", handleEndResize);

    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleEndResize);
      window.removeEventListener("touchmove", handleResizeMove);
      window.removeEventListener("touchend", handleEndResize);
    };
  }, [isResizing, direction, handleResizeMove]);

  return (
    <div className="flex flex-col h-screen w-full">
      <div
        ref={resizableRef}
        className={`flex ${
          direction === "horizontal" ? "flex-row" : "flex-col"
        } w-full h-full`}
      >
        {/* Video Panel */}
        <div
          className={`flex items-center justify-center ${
            direction === "horizontal" ? "h-full" : "w-full"
          }`}
          style={{
            flexBasis: `${100 - chatWidth}%`,
          }}
        >
          <VideoPlayer />
        </div>

        {/* Resizable Handle */}
        <div
          onMouseDown={handleStartResize}
          onTouchStart={handleStartResize} // Start resizing on touch
          className={`${
            direction === "horizontal"
              ? "w-2 bg-gray-800 cursor-ew-resize"
              : "cursor-ns-resize"
          }`}
          style={{ flexShrink: 0 }}
        >
          <div
            className={`${
              direction === "horizontal"
                ? "hidden"
                : "border-gray-800 border-t border-b "
            }`}
          >
            <Info />
            <LiveChatHead />
          </div>
        </div>

        {/* Chat Panel */}
        <div
          className={`overflow-y-auto scrollable-div flex  h-full  flex-col  ${
              direction === "horizontal"
                ? "justify-between "
                : ""
          } `}
          style={{
            flexBasis: `${chatWidth}%`,
          }}
        >
          <LiveChat direction={direction}/>
        </div>
      </div>
    </div>
  );
};
