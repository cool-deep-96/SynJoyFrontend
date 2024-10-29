import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Settings, UsersRound } from "lucide-react";
import React from "react";
import MembersList from "../MembersList";
import SettingPage from "./SettingPage";

const SettingDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <p className="flex text-gray-400 items-center">
          <Settings className="w-4 h-4"/>
        </p>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-900 border-0 right-0 pb-5 w-full md:w-[30vw] border-t border-gray-900">
        <SettingPage/>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingDrawer;
