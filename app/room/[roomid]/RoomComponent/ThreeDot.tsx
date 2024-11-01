import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EllipsisVertical } from "lucide-react";
import RoomDelete from "./alert_dialog/RoomDelete";

const ThreeDot = () => {
  return (
    <Popover>
      <PopoverTrigger><EllipsisVertical className="w-5 h-5 lg:h-8 lg:w-8"/></PopoverTrigger>
      <PopoverContent className="flex flex-col p-2 lg:p-4 w-fit gap-2 lg:gap-5 text-sm lg:text-lg">
        <p>Share Room</p>
        <RoomDelete/>
      </PopoverContent>
    </Popover>
  );
};

export default ThreeDot;
