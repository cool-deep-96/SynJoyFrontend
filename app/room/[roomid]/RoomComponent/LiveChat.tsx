import InputBox from "./InputBox";
import LiveChatHead from "./LiveChatHead";
import ChatBox from "./ChatBox";
import Info from "./Info";

const LiveChat = () => {
  return (
    <div className="flex h-full flex-col justify-between text-sm lg:text-base">
      <Info />
      <LiveChatHead />
      <div className="flex-grow overflow-y-auto ">
        <ChatBox />
      </div>
      <InputBox />
    </div>
  );
};

export default LiveChat;
