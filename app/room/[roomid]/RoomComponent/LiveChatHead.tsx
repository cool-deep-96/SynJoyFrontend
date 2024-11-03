import { Copy } from "lucide-react";
import React from "react";
import Members from "./Members/Members";
import MemberProvider from "./Members/MemberProvider";
import { useSocketUser } from "../SocketContextProvider/SocketContext";

const LiveChatHead = () => {
  const {tokenData} = useSocketUser()!
  
  return (
    <div className="px-2 lg:py-5 py-2 font-medium flex items-center justify-between border-b">
      <div className="flex lg:gap-5 gap-3 ">
        <p className="opacity-80">Live chat</p>
        <MemberProvider>
          <Members />
        </MemberProvider>
      </div>
      <div>
        <p className="text-xs opacity-80 lg:text-sm font-normal flex gap-1 items-center">
          {tokenData?.roomId}{" "}
          <span>
            <Copy className="w-4 h-4 lg:w-6 lg:h-6" />
          </span>
        </p>
      </div>
    </div>
  );
};

export default LiveChatHead;
