import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { UsersRound } from "lucide-react";
import MembersList from "./MembersList";
import { useMember } from "./MemberProvider";

const Members = () => {
  const { newRequests, joinedMembers, setNewRequests } = useMember();
  return (
    <Drawer>
      <DrawerTrigger onClick={() => setNewRequests([])}>
        <div className="relative flex gap-1 text-gray-400 items-center">
          <UsersRound className="w-4 h-4 lg:w-6 lg:h-6" />
          <p>+ {joinedMembers.length-1}</p>
          {newRequests.length ? (
            <p className=" bg-red-600 p-1 aspect-square rounded-full  text-xs text-white">
              {newRequests.length}
            </p>
          ) : (<></>)}
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-900 border-0 right-0 pb-5 w-full md:w-[30vw] border-t border-gray-900">
        <MembersList />
      </DrawerContent>
    </Drawer>
  );
};

export default Members;
