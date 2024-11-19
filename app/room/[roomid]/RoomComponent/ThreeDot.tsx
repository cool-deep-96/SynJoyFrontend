import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EllipsisVertical } from "lucide-react";
import RoomDelete from "./alert_dialog/RoomDelete";
import RoomLeave from "./alert_dialog/LeaveRoom";
import { useSocketUser } from "../SocketContextProvider/SocketContext";

const ThreeDot = () => {
  const { tokenData } = useSocketUser()!;
  const handleShare = () => {
    const roomLink = `https://synjoy.vercel.app/room/${tokenData?.roomId}`;
    const shareData = {
      title: "Join my room!",
      text: "Check out this awesome room!",
      url: roomLink,
    };

    if (navigator.share) {
      // Use Web Share API
      navigator
        .share(shareData)
        .then(() => console.log("Room link shared successfully!"))
        .catch((err) => console.error("Error sharing the room link:", err));
    } else {
      // Fallback for browsers that do not support Web Share API
      alert(`Copy and share this link: ${roomLink}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <EllipsisVertical className="w-5 h-5 lg:h-8 lg:w-8" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col p-2 lg:p-4 w-fit gap-2 lg:gap-5 text-sm lg:text-lg">
        <button onClick={() => handleShare()}>Share Room</button>
        <RoomLeave />
        <RoomDelete />
      </PopoverContent>
    </Popover>
  );
};

export default ThreeDot;
