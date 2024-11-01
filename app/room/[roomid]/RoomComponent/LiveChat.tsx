import InputBox from "./Chat/InputBox";
import LiveChatHead from "./LiveChatHead";
import Info from "./Info";
import ChatBox from "./Chat/ChatBox";
import ChatProvider from "./Chat/ChatProvider";

const LiveChat = () => {
  return (
    <div className="flex h-full flex-col justify-between text-sm lg:text-base">
      <Info />
      <LiveChatHead />
      <div className="flex-grow overflow-y-auto ">
        <ChatProvider>
          <ChatBox />
        </ChatProvider>
      </div>
      <ChatProvider>
        <InputBox />
      </ChatProvider>
    </div>
  );
};

export default LiveChat;
