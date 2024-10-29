enum Source {
  YOUTUBE = "youtube",
  FILE = "file",
}

enum EventType {
  JOINING_REQUEST = "joiningRequest",
  JOINING_RESPONSE = "joiningResponse",
  JOIN_ROOM = "joinRoom",
  PAUSE = "pause",
  PLAY = "play",
  VIDEO_ID = "videoId",
  ROOM_MESSAGE = "roomMessage",
}

interface JoinChannelMessage {
  roomId: string;
  userName: string;
  password: string;
}

interface JoinChannelResponse {
  message: string;
  payload: {
    _id: string;
    roomId: string;
    userName: string;
  };
}

interface CookiesPayload {
    _id: string;
    roomId: string;
    password: string;
    userName: string;
}

interface VideoSyncChannelMessage {
  eventType: EventType;
  source?: Source;
  requestDuration?: number;
  youtubeVideoId?: string;
  userName: string;
  roomId?: string;
}

enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
}
interface MessageBox {
  message: string;
  sentBy: string;
  status: MessageStatus;
}

interface CreateRoomPayload {
  roomId: string;
  userName: string;
  password: string;
}
interface JoinRoomPayload {
  roomId: string;
  userName: string;
  password: string;
}

interface TokenData {
  id: string;
  userName: string;
  roomId: string;
  approved: boolean;
}

export type {
  JoinChannelMessage,
  TokenData,
  JoinChannelResponse,
  VideoSyncChannelMessage,
  CookiesPayload,
  MessageBox,
  CreateRoomPayload,
  JoinRoomPayload,
};

export { Source, EventType, MessageStatus };
