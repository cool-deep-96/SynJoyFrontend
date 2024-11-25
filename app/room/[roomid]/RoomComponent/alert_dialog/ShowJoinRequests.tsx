import { toast } from "react-hot-toast";
import { Member } from "../Members/MemberProvider";

const showJoinRequestToast = (
  data: Member,
  onAccept: (id: string, userName: string) => Promise<void>,
  onDecline: (id: string, userName: string) => Promise<void>
) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-xs  md:max-w-md w-full bg-gray-800 p-5 shadow-lg rounded-lg pointer-events-auto flex flex-col text-sm md:text-base`} // Dark background
      >
        <div className="flex justify-between items-center">
          <p className="text-gray-100">
            {" "}
            {/* Light text for dark theme */}
            <span className="font-semibold text-green-500">
              {data.userName}
            </span>{" "}
            has requested to join the room.
          </p>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-400 hover:text-gray-200 ml-4 text-lg" // Adjust button text for dark theme
          >
            ✕
          </button>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              onDecline(data.id, data.userName);
              toast.dismiss(t.id);
            }}
            className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-md lg:p-1 p-2 transition-colors duration-300" // Hover effect
          >
            Decline
          </button>
          <button
            onClick={() => {
              onAccept(data.id, data.userName);
              toast.dismiss(t.id);
            }}
            className="text-white bg-green-600 hover:bg-green-500 rounded-md p-1 lg:p-2 transition-colors duration-300"
          >
            Accept
          </button>
        </div>
      </div>
    ),
    {
      position: "bottom-right",
      duration: 30000, // 30sec
    }
  );
};

export default showJoinRequestToast;
