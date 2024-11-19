import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMember } from "../Members/MemberProvider";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";

const RoomLeave = () => {
  const { removeMember } = useMember();
  const { tokenData } = useSocketUser();
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <p className="text-red-600">Leave Room</p>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg bg-[#3B3B3B] p-5">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Notice</AlertDialogTitle>
          <AlertDialogDescription className=" lg:text-lg py-5 text-[#C2C2C2]">
            You are about to Leave this room, You have to re-request the owner
            to join again. Are you still sure you want to leave the room??
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              if (tokenData) removeMember(tokenData.id, tokenData.userName);
            }}
            className="bg-green-600"
          >
            Continue
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoomLeave;
