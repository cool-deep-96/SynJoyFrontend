import { ScrollArea } from "@/components/ui/scroll-area";
import { CircleUserRound } from "lucide-react";
import React from "react";
import Message, { SelfMessage } from "./Message";

const ChatBox = () => {
  return (
    <ScrollArea className="flex flex-col mx-5">
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <SelfMessage/>
      <Message/>
      <Message/>
      <SelfMessage/>
      <Message/>
      <Message/>
      <Message/>
      <Message/>
      <SelfMessage/>
    </ScrollArea>
  );
};

export default ChatBox;
