import { CircleUserRound } from "lucide-react";

const Message = () => {
  return (
    <div className={`flex  gap-2 w-fit my-2 max-w-[80%]`}>
      <CircleUserRound className="w-4 h-6 lg:w-6 lg:h-6"/>
      <div className="relative bg-[#6A6767] lg:p-2 p-1 rounded-lg ">
        <p className="absolute lg:text-xs text-[0.60rem] font-medium right-1 bottom-1 lg:right-2 lg:bottom-2 opacity-60">
          07:28 pm
        </p>
        <p className="text-[#FA5F05] text-sm">Atul</p>
        <p className="text-white pb-4 text-sm lg:text-base">Hello kuldeep How r u?</p>
      </div>
    </div>
  );
};

const SelfMessage = () => {
  return (
    <div className={`flex justify-self-end gap-2 w-fit my-2 max-w-[80%]`}>
      <div className="relative bg-[#6A6767] lg:p-2 p-1 rounded-lg ">
        <p className="absolute text-xs font-medium right-1 bottom-1 lg:right-2 lg:bottom-2 opacity-60">
          07:28 pm
        </p>
        <p className="text-white text-sm lg:text-base pb-4">Hello kuldeep How r u? kahfudklbia haikjb iuhdijhbdsk iuhkjnd iuha kj</p>
      </div>
    </div>  
  );
}

export default Message;
export {SelfMessage}
