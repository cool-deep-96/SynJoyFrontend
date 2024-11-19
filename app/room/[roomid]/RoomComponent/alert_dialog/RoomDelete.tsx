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

const RoomDelete = () => {
  const 
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <p className="text-red-600">Delete Room</p>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg bg-[#3B3B3B] p-5">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Notice</AlertDialogTitle>
          <AlertDialogDescription className=" lg:text-lg py-5 text-[#C2C2C2]">
            This may delete the information related to the room and the member
            details also will be deleted. Are you still sure you want to delete
            the room??
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-green-600">
            Continue
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoomDelete;
