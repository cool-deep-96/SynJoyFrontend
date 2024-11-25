import React, { useEffect } from "react";
import ThreeDot from "./ThreeDot";
import MemberProvider from "./Members/MemberProvider";
import { useVideo } from "./VideoPlayer/VideoPlayerContext";

const Info = () => {
  const { title } = useVideo();
  console.log(title);
  // useEffect(()=>{},[title])
  return (
    <div className="p-2 select-none flex justify-between items-center">
      <p>{title}</p>
      <ThreeDot />
    </div>
  );
};

export default Info;
