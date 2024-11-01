import { CircleUser, Triangle } from "lucide-react";
import React, { useState } from "react";
import RemoveUser from "../alert_dialog/RemoveUser";
import { useMember } from "./MemberProvider";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";

const MembersList = () => {
  const { tokenData } = useSocketUser()!;
  const { joinedMembers, removeMember, requestedMembers, acceptMember } =
    useMember();
  const [openSection, setOpenSection] = useState<"joined" | "requests">(
    (tokenData?.isOwner && requestedMembers.length) ? "requests" : "joined"
  );

  const handleToggle = (section: "joined" | "requests") => {
    if (openSection !== section) {
      setOpenSection(section); // Only change the section if a different section is clicked
    }
  };

  return (
    <div className="px-1 text-lg max-h-[90vh] flex flex-col bg-slate-900 text-white">
      {/* Requests section */}
      {tokenData?.isOwner && (
        <div>
          <div
            onClick={() => handleToggle("requests")}
            className="cursor-pointer text-sm lg:text-base rounded-lg border border-gray-800 px-5 py-2 flex justify-between items-center"
          >
            <p className="text-green-500 font-semibold">requests +{requestedMembers.length}</p>
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
            {requestedMembers.map((requestedMember, index) => {
              return (
                <div
                  className="lg:px-5 px-2 py-2 flex justify-between items-center my-1 lg:my-2 text-sm lg:text-base"
                  key={index}
                >
                  <p className="flex gap-5 items-center">
                    <CircleUser />
                    {requestedMember.userName}
                  </p>
                  <div className="flex lg:gap-5 gap-2 text-xs lg:text-base">
                    <button
                      onClick={() =>
                        acceptMember(
                          requestedMember.id,
                          requestedMember.userName
                        )
                      }
                      className="text-white  bg-green-600 rounded-md p-1 lg:p-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        removeMember(
                          requestedMember.id,
                          requestedMember.userName
                        )
                      }
                      className="border border-red-600 text-red-600 rounded-md lg:p-1 p-2"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Joined section */}
      <div>
        <div
          onClick={() => handleToggle("joined")}
          className="cursor-pointer rounded-lg text-sm lg:text-base md:text-base border border-gray-800 px-5 py-2 flex justify-between items-center"
        >
          <p className="text-green-500 font-semibold">joined +{joinedMembers.length-1}</p>
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
          {joinedMembers.map((joinedMember, index) => {
            return (
              <div
                className="px-2 lg:px-5 py-2 my-2 flex justify-between items-center"
                key={index}
              >
                <p className="flex lg:gap-5 gap-3 items-center text-sm lg:text-base">
                  <CircleUser />
                  {joinedMember.userName}
                </p>
                {tokenData?.isOwner && tokenData.id != joinedMember.id && (
                  <RemoveUser member={joinedMember} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MembersList;
