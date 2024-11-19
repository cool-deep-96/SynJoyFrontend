import React from "react";
import ThreeDot from "./ThreeDot";
import MemberProvider from "./Members/MemberProvider";

const Info = () => {
  return (
    <div className="p-2 select-none flex justify-between items-center">
      <p>Three idiots</p>
      <MemberProvider>
        <ThreeDot />
      </MemberProvider>
    </div>
  );
};

export default Info;
