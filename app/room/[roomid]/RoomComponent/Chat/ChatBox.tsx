import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useChat } from "./ChatProvider";
import MessageComp, { SelfMessage } from "./MessageComp";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";

const ChatBox = () => {
  const { messages } = useChat();
  const { tokenData } = useSocketUser()!;
  return (
    <ScrollArea className="flex flex-col  mx-5">
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
  );
};

export default ChatBox;
