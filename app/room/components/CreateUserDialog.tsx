import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons from lucide-react
import { CreateRoomPayload, JoinRoomPayload } from "@/interfaces/interfaces";
import { roomEndPoints } from "@/app/ApiHandler/api_list";
import apiCall from "@/app/ApiHandler/api_call";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { validateCreateRoomPayload } from "@/utils/utils";

interface CreateUserDialogProps {
  type: 0 | 1;
  roomId: string;
  buttonText: string;
  actionText: string;
  defaultOpen?: boolean;
  setToken?: Dispatch<SetStateAction<string | null>>;
}

const CreateUserDialog = ({
  roomId,
  buttonText,
  actionText,
  defaultOpen,
  type,
  setToken,
}: CreateUserDialogProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createRoomHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const createRoomPayload: CreateRoomPayload = {
      userName: formData.userName,
      password: formData.password,
      roomId,
    };

    try {
      validateCreateRoomPayload(createRoomPayload);
      const response = await apiCall("POST", roomEndPoints.CREATE_REQUEST, {
        createRoomPayload,
      });
      toast.success(response.message);
      localStorage.setItem("jwtToken", response.jwtToken);
      router.push(`/room/${roomId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const requestJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const joinRoomPayload: JoinRoomPayload = {
      userName: formData.userName,
      password: formData.password,
      roomId,
    };
    try {
      validateCreateRoomPayload(joinRoomPayload);
      const response = await apiCall("PUT", roomEndPoints.JOIN_REQUEST, {
        joinRoomPayload,
      });
      localStorage.setItem("jwtToken", response.jwtToken);
      setToken && setToken(response.jwtToken);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger className="bg-blue-600 select-none whitespace-nowrap text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
        {buttonText}
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-white p-6 max-w-sm lg:max-w-lg w-full rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center opacity-60">
            Room ID: {roomId}
          </DialogTitle>
        </DialogHeader>
        <p className="opacity-60">Create/Login User for this room</p>
        <form
          className="space-y-4 w-full select-none"
          onSubmit={type ? requestJoin : createRoomHandle}
        >
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <div
              className="absolute top-[50%] right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-white transition" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-white transition" />
              )}
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-fit bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Processing..." : actionText}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
