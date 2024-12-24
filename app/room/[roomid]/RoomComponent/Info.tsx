import React, { useEffect } from "react";
import ThreeDot from "./ThreeDot";
import MemberProvider from "./Members/MemberProvider";
import { useVideo } from "./VideoPlayer/VideoPlayerContext";
import SettingDrawer from "./alert_dialog/SettingDrawer";

const Info = () => {
  const { title } = useVideo();
  console.log(title);
  // useEffect(()=>{},[title])
  return (
    <div className="p-2 select-none flex justify-between items-center">
      <p className="w-[80%] line-clamp-1 ">{title}</p>
      <div className="flex items-center">
        <SettingDrawer />
        <ThreeDot />
      </div>
    </div>
  );
};

export default Info;
