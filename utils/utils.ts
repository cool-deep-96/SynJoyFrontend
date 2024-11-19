import { CreateRoomPayload, JoinChannelMessage, JoinRoomPayload } from "@/interfaces/interfaces";

export const generateRoomId = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomId = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomId += characters.charAt(randomIndex);
  }
  return roomId;
};

export const validateCreateRoomPayload = (
  payload: CreateRoomPayload | JoinRoomPayload | JoinChannelMessage
): void => {
  const { roomId, userName, password } = payload;

  const missingFields: string[] = [];

  if (!roomId) {
    missingFields.push("roomId");
  }
  if (!userName) {
    missingFields.push("userName");
  }
  if (!password) {
    missingFields.push("password");
  }

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}.`);
  }

  const userNameRegex = /^[a-z0-9_]+$/;
  if (!userNameRegex.test(userName)) {
    throw new Error(
      "userName should contain only lowercase letters (a-z), digits (0-9), and underscores (_)."
    );
  }
};

export const formatAMPM = (dateString: string) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // If the hour is 0, set it to 12
  minutes = minutes < 10 ? 0 + minutes : minutes; // Add leading zero if needed
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
