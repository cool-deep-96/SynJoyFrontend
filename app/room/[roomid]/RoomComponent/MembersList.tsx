import { CircleUser, Triangle, UserRoundMinus } from "lucide-react";
import React, { useState } from "react";
import RemoveUser from "./alert_dialog.tsx/RemoveUser";

const MembersList = () => {
  const [openSection, setOpenSection] = useState<"joined" | "requests">(
    "requests"
  ); // Default state is "joined"

  // Toggle the visibility of the sections
  const handleToggle = (section: "joined" | "requests") => {
    if (openSection !== section) {
      setOpenSection(section); // Only change the section if a different section is clicked
    }
  };

  return (
    <div className="px-1 text-lg max-h-[90vh] flex flex-col bg-slate-900 text-white">
      {/* Requests section */}
      <div>
        <div
          onClick={() => handleToggle("requests")}
          className="cursor-pointer text-sm lg:text-base rounded-lg border border-gray-800 px-5 py-2 flex justify-between items-center"
        >
          <p className="text-green-500 font-semibold">requests +3</p>
          <Triangle
            className={`transition-transform duration-300 ${
              openSection === "requests" && "rotate-180"
            }`}
          />
        </div>
        <div
          className={`overflow-y-scroll transition-all duration-500 ease-in-out ${
            openSection === "requests"
              ? "h-[60vh] opacity-100 "
              : "max-h-0 opacity-0"
          }`}
        >
          {new Array(50).fill(undefined).map((_, index) => {
            return (
              <div
                className="lg:px-5 px-2 py-2 flex justify-between items-center my-1 lg:my-2 text-sm lg:text-base"
                key={index}
              >
                <p className="flex gap-5 items-center">
                  <CircleUser />
                  Atul{index}
                </p>
                <div className="flex lg:gap-5 gap-2 text-xs lg:text-base">
                  <button className="text-white  bg-green-600 rounded-md p-1 lg:p-2">
                    Accept
                  </button>
                  <button className="border border-red-600 text-red-600 rounded-md lg:p-1 p-2">
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Joined section */}
      <div>
        <div
          onClick={() => handleToggle("joined")}
          className="cursor-pointer rounded-lg text-sm lg:text-base md:text-base border border-gray-800 px-5 py-2 flex justify-between items-center"
        >
          <p className="text-green-500 font-semibold">joined +3</p>
          <Triangle
            className={`transition-transform duration-300 ${
              openSection === "joined" && "rotate-180"
            }`}
          />
        </div>
        <div
          className={`overflow-y-scroll transition-all duration-500 ease-in-out  ${
            openSection === "joined"
              ? "h-[60vh] opacity-100 "
              : "max-h-0 opacity-0"
          }`}
        >
          {new Array(2).fill(undefined).map((_, index) => {
            return (
              <div
                className="px-2 lg:px-5 py-2 my-2 flex justify-between items-center"
                key={index}
              >
                <p className="flex lg:gap-5 gap-3 items-center text-sm lg:text-base">
                  <CircleUser />
                  Atul{index}
                </p>
                <RemoveUser/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MembersList;
