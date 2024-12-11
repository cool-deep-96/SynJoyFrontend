import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useChat } from "./ChatProvider";
import MessageComp, { SelfMessage } from "./MessageComp";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";
import { useEffect, useRef, useState } from "react";
import { ArrowDownToDot } from "lucide-react";

const ChatBox = () => {
  const { messages } = useChat();
  const { tokenData } = useSocketUser()!;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  return (
    <div className="relative h-full">
      <ScrollArea
        ref={scrollRef}
        className="flex flex-col px-5 overflow-auto h-full w-full scrollable-div"
        onScroll={handleScroll}
      >
        {messages.map((message, index) => {
          if (tokenData!.id === message.sentById) {
            return (
              <div key={index} className="justify-self-end">
                <SelfMessage message={message} />
              </div>
            );
          } else {
            return <MessageComp key={index} message={message} />;
          }
        })}
      </ScrollArea>
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute right-4 bottom-4 p-2 bg-blue-500 text-white rounded-full shadow-md"
        >
          <ArrowDownToDot/>
        </button>
      )}
    </div>
  );
};

export default ChatBox;
