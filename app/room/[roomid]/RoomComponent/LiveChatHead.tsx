import { Copy } from "lucide-react";
import React from "react";
import Members from "./Members/Members";
import MemberProvider from "./Members/MemberProvider";
import { useSocketUser } from "../SocketContextProvider/SocketContext";
import CopyButton from "@/components/common/CopyButton";

const LiveChatHead = () => {
  const { tokenData } = useSocketUser()!;

  return (
    <div className="px-2 select-none lg:py-5 py-2 font-medium flex items-center justify-between border-b">
      <div className="flex lg:gap-5 gap-3 ">
        <p className="opacity-80">Live chat</p>
        <MemberProvider>
          <Members />
        </MemberProvider>
      </div>
      <div>
        <CopyButton textToCopy={tokenData?.roomId} />
      </div>
    </div>
  );
};

export default LiveChatHead;
