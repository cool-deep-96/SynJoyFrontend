import { useState } from "react";

interface Props {
  Heading?: string;
  action?: string;
  decline?: () => void;
  userRequesting?: string | null;
  handle:( (userName: string, password: string) => void ) | ( ()=> void);
  handleClose?: () => void;
  loading?: boolean;
}

const PopUpBox = ({
  Heading,
  action,
  handle,
  handleClose,
  decline,
  userRequesting,
  loading,
}: Props) => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="fixed h-screen w-screen top-0 left-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-70 z-20">
      <div className="flex flex-col justify-between border-2 p-3 rounded-xl bg-black bg-opacity-100">
        <div className="flex pb-5 gap-10 flex-row justify-between">
          <div className="">{Heading}</div>
          <button
            onClick={handleClose}
            className=" bg-gray-900 px-3 text-sm py-2 rounded-lg"
          >
            close
          </button>
        </div>
        <div className="flex flex-col">
          {!decline ? (
            <div className="flex flex-col gap-3">
              <input
                onChange={(event) => setUserName(event.target.value)}
                className="  bg-gray-600 px-2 text-xl p-2 rounded-md "
                placeholder="Enter User Name"
                type="text"
              />
              <input
                onChange={(event) => setPassword(event.target.value)}
                className="mx-1  bg-gray-600 px-2 text-xl p-2 rounded-md "
                placeholder="Enter Password"
                type="text"
              />
            </div>
          ) : (
            <div>{userRequesting || userName}</div>
          )}
          <div className="pt-5 justify-between flex">
            {decline && (
              <button
                onClick={decline}
                className=" bg-gray-900 px-3 text-sm py-2 rounded-lg"
              >
                decline
              </button>
            )}
            <button
              className=" bg-gray-900 px-3 text-sm py-2 rounded-lg disabled:bg-slate-600"
              disabled={loading}
              onClick={() => handle(userName, password)}
            >
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpBox;
