import { SendHorizontal, Smile } from "lucide-react";
import React from "react";

const InputBox = () => {
  return (
    <div className="w-full relative">
      <div className="absolute h-full w-auto items-center flex flex-col justify-center">
        <Smile color="black" className="mx-3" />
      </div>
      <div className="absolute right-0 h-full w-auto items-center flex flex-col justify-center">
        <SendHorizontal color="black" className="mx-3" />
      </div>
      <input
        placeholder="Type your message here..."
        className="w-full bg-white text-black py-4 lg:py-5 px-12 rounded-lg text-lg"
      />
    </div>
  );
};

export default InputBox;
