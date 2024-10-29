import Room from "./RoomComponent/Room";
import { SocketProvider } from "./SocketContextProvider/SocketContext";

export default function App() {

  return (
    <SocketProvider>
      <Room/>
    </SocketProvider>
  );
}
