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
  sendingMessages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  sendMessage: (message: string) => void;
  deleteMessage: (messageId: string) => void;
  updateMessage: (messageId: string, text: string) => void;
}

interface ChatProviderProps {
  children: ReactNode;
}

// Create Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ChatProvider component
const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingMessages, setSendingMessages] = useState<Message[]>([]);
  const { socket, tokenData, token } = useSocketUser()!;

  // Memoize headers to avoid unnecessary recalculations
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  // Fetch all chats by room ID
  const getAllChatsByRoomId = useCallback(async () => {
    if (!tokenData?.roomId) return;

    try {
      const url = chatEndPoints.GET_CHAT;
      const method = "GET";
      const data = { roomId: tokenData.roomId };

      const response = await apiCall(method, url, data, headers);
      setMessages(response.data);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [headers, tokenData]);

  // Send new message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return; // Prevent empty messages

      try {
        const url = chatEndPoints.CREATE_CHAT;
        const method = "POST";
        const data = { message };

        const response = await apiCall(method, url, data, headers);
        toast.success(response.message);

        const receivedMessage: Message = response.data;
        setMessages(
          (prev) =>
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
            ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i) // Ensure no duplicates
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    [headers]
  );

  // Update message
  const updateMessage = useCallback(
    async (messageId: string, text: string) => {
      if (!text.trim()) return; // Prevent empty updates

      try {
        const url = `${chatEndPoints.UPDATE_CHAT}${messageId}`; // Changed the endpoint
        const method = "PATCH";
        const data = { updatedMessage: text };

        const response = await apiCall(method, url, data, headers);
        toast.success(response.message);

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

  // Delete message
  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        const url = `${chatEndPoints.DELETE_CHAT}${messageId}`;
        const method = "DELETE";

        const response = await apiCall(method, url, null, headers);
        toast.success(response.message);

        // Remove the message from state
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    [headers]
  );

  // Socket handling for real-time message sync
  useEffect(() => {
    if (!socket) return;

    const handleSyncChat = (data: Message) => {
      console.log(data);
      setMessages((prev) => {
        if (data.isRemoved) {
          // If the message is marked as removed, filter it out from the list
          return prev.filter((msg) => msg.id !== data.id);
        }
        const existingIndex = prev.findIndex((msg) => msg.id === data.id);

        if (existingIndex !== -1) {
          // If the message exists, update it by replacing the old one
          const updatedMessages = [...prev];
          updatedMessages[existingIndex] = data; // Replace the old message with the new one
          return updatedMessages;
        } else {
          // If it's a new message, add it while maintaining the order
          return [...prev, data];
        }
      });
    };

    socket.on(SOCKET_CHANNEL.SYNC_CHAT_CHANNEL, handleSyncChat);

    return () => {
      socket.off(SOCKET_CHANNEL.SYNC_CHAT_CHANNEL, handleSyncChat);
    };
  }, [socket]);

  // Fetch all chats on component mount
  useEffect(() => {
    getAllChatsByRoomId();
  }, [getAllChatsByRoomId]);

  // Provide chat context
  return (
    <ChatContext.Provider
      value={{
        messages,
        sendingMessages,
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
