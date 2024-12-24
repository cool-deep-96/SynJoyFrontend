import InputBox from "./Chat/InputBox";
import ChatBox from "./Chat/ChatBox";
import LiveChatHead from "./LiveChatHead";
import Info from "./Info";

interface Props {
  direction: "horizontal" | "vertical";
}

const LiveChat = ({ direction }: Props) => {
  return (
    <div className="flex flex-col h-full justify-between text-sm lg:text-base max-h-full">
      <div
        className={`h-fit ${
          direction === "horizontal"
            ? "border-gray-800 border-t border-b "
            : "hidden"
        }`}
      >
        <Info />
        <LiveChatHead />
      </div>
      <div className="flex-grow overflow-y-auto scrollable-div text-sm lg:text-base">
        <ChatBox />
      </div>
      <InputBox />
    </div>
  );
};

export default LiveChat;
