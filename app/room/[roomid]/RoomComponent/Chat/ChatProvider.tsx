import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";
import { chatEndPoints } from "@/app/ApiHandler/api_list";
import apiCall from "@/app/ApiHandler/api_call";
import toast from "react-hot-toast";
import { SOCKET_CHANNEL } from "@/interfaces/socket_channels";

// Interfaces
export interface Message {
  id: string;
  sentById: string;
  sentByUserName: string;
  text: string;
  time: string;
  isRemoved: boolean;
}

export interface ChatContextType {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  sendMessage: (message: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  updateMessage: (messageId: string, text: string) => Promise<void>;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket, tokenData, token } = useSocketUser()!;

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const getAllChatsByRoomId = useCallback(async () => {
    if (!tokenData?.roomId) return;

    try {
      const url = chatEndPoints.GET_CHAT;
      const method = "GET";
      const data = { roomId: tokenData.roomId };

      const response = await apiCall(method, url, data, headers);
      setMessages(
        response.data.map((dat: Message) => ({ ...dat, status: "SAVED" }))
      );
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [headers, tokenData]);

  const sendMessage = useCallback(
    async (message: string): Promise<void> => {
      if (!message.trim()) return;

      try {
        const url = chatEndPoints.CREATE_CHAT;
        const method = "POST";
        const data = { message };

        const response = await apiCall(method, url, data, headers);

        const receivedMessage: Message = response.data;
        setMessages((prev) =>
          [
            ...prev,
            {
              id: receivedMessage.id,
              sentById: receivedMessage.sentById,
              sentByUserName: receivedMessage.sentByUserName,
              text: receivedMessage.text,
              time: receivedMessage.time,
              isRemoved: receivedMessage.isRemoved,
            },
          ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    [headers]
  );

  const updateMessage = useCallback(
    async (messageId: string, text: string): Promise<void> => {
      if (!text.trim()) return;

      try {
        const url = `${chatEndPoints.UPDATE_CHAT}${messageId}`;
        const method = "PATCH";
        const data = { updatedMessage: text };

        const response = await apiCall(method, url, data, headers);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === response.data.id
              ? {
                  ...msg,
                  text: response.data.text,
                  time: response.data.time,
                  isRemoved: response.data.isRemoved,
                }
              : msg
          )
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    [headers]
  );

  const deleteMessage = useCallback(
    async (messageId: string): Promise<void> => {
      try {
        const url = `${chatEndPoints.DELETE_CHAT}${messageId}`;
        const method = "DELETE";

        await apiCall(method, url, null, headers);

        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    [headers]
  );

  useEffect(() => {
    if (!socket) return;

    const handleSyncChat = (data: Message) => {
      console.log(data);
      setMessages((prev) => {
        if (data.isRemoved) {
          return prev.filter((msg) => msg.id !== data.id);
        }
        const existingIndex = prev.findIndex((msg) => msg.id === data.id);

        if (existingIndex !== -1) {
          const updatedMessages = [...prev];
          updatedMessages[existingIndex] = data;
          return updatedMessages;
        } else {
          return [...prev, data];
        }
      });
    };

    socket.on(SOCKET_CHANNEL.SYNC_CHAT_CHANNEL, handleSyncChat);

    return () => {
      socket.off(SOCKET_CHANNEL.SYNC_CHAT_CHANNEL, handleSyncChat);
    };
  }, [socket]);

  useEffect(() => {
    getAllChatsByRoomId();
  }, [getAllChatsByRoomId]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        deleteMessage,
        sendMessage,
        setMessages,
        updateMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
