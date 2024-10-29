import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UsersRound } from "lucide-react";
import MembersList from "./MembersList";

const Members = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <p className="flex text-gray-400 items-center">
          <UsersRound className="w-4 h-4 lg:w-6 lg:h-6"/>+ 3
        </p>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-900 border-0 right-0 pb-5 w-full md:w-[30vw] border-t border-gray-900">
        <MembersList/>
      </DrawerContent>
    </Drawer>
  );
};

export default Members;
