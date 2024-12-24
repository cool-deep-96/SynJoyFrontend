import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { FileVideo, Settings, UsersRound } from "lucide-react";
import React from "react";

import SettingPage from "../VideoPlayer/SettingPage";

const SettingDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="">
          <FileVideo className="w-4 h-4 lg:w-6 lg:h-6" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-900 border-0 right-0 pb-5 w-full md:w-[30vw] border-t border-gray-900">
        <SettingPage />
      </DrawerContent>
    </Drawer>
  );
};

export default SettingDrawer;
