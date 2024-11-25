import InputBox from "./Chat/InputBox";
import LiveChatHead from "./LiveChatHead";
import Info from "./Info";
import ChatBox from "./Chat/ChatBox";
import ChatProvider from "./Chat/ChatProvider";
import { VideoProvider } from "./VideoPlayer/VideoPlayerContext";

const LiveChat = () => {
  return (
    <div className="flex h-full flex-col justify-between text-sm lg:text-base">
      <Info />

      <LiveChatHead />
      <div className="flex-grow overflow-y-auto scrollable-div">
        <ChatBox />
      </div>

      <InputBox />
    </div>
  );
};

export default LiveChat;
