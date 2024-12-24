import { SendHorizontal, Smile } from "lucide-react";
import React, { useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useChat } from "./ChatProvider";
import { init, SearchIndex } from "emoji-mart";

init({ data });

const InputBox = () => {
  const { sendMessage } = useChat();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSuggestions, setEmojiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const updateMessageWithEmoji = (emoji: string, caretPosition: number) => {
    const beforeText = message.slice(0, caretPosition);
    const afterText = message.slice(caretPosition);
    const updatedMessage = `${beforeText}${emoji}${afterText}`;
    setMessage(updatedMessage);

    const newCaretPosition = caretPosition + emoji.length;

    inputRef.current?.setSelectionRange(newCaretPosition, newCaretPosition);
    inputRef.current?.focus();
  };

  const handleEmojiSelect = (emoji: any) => {
    const caretPosition = inputRef.current?.selectionStart || 0;
    updateMessageWithEmoji(emoji.native, caretPosition);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      setLoading(true);
      await sendMessage(message);
      setMessage("");
      setEmojiSuggestions([]);
      setLoading(false);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    const caretPosition = e.target.selectionStart || 0;
    const match = value.slice(0, caretPosition).match(/:\w*$/);
    if (match) {
      const query = match[0].slice(1);
      if (query) {
        const emojis = await SearchIndex.search(query);
        setEmojiSuggestions(
          emojis.map((emoji: typeof emojis) => emoji?.skins[0].native)
        );
      }
    } else {
      setEmojiSuggestions([]);
    }
  };

  const handleSuggestionClick = (emoji: string) => {
    const caretPosition = inputRef.current?.selectionStart || 0;
    const match = message.slice(0, caretPosition).match(/:\w*$/);

    if (match) {
      const startIndex = match.index || 0;
      const beforeText = message.slice(0, startIndex);
      const afterText = message.slice(caretPosition);
      const updatedMessage = `${beforeText}${emoji}${afterText}`;
      setMessage(updatedMessage);

      const newCaretPosition = beforeText.length + emoji.length;
      inputRef.current?.setSelectionRange(newCaretPosition, newCaretPosition);
      setEmojiSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Emoji Picker Toggle */}
        <div
          className="absolute left-3 bottom-3  cursor-pointer"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smile color="yellow" />
        </div>

        {/* Input Field */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          placeholder="Type your message here..."
          className="w-full text-sm md:text-base bg-gray-600 text-gray-100 py-3 pl-10 pr-14 rounded-lg resize-none focus:outline-none focus:border-green-300 scrollable-div"
          rows={2}
        />

        {/* Send Button */}
        <button
          type="submit"
          className={`absolute right-3 bottom-3 p-1 rounded-full transition-transform ${
            loading ? "animate-shimmer -rotate-45" : "hover:scale-110 hover:cursor-pointer"
          }`}
          disabled={loading}
        >
          <SendHorizontal />
        </button>
      </form>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute left-0 bottom-[100%] z-10">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            onClickOutside={() => setShowEmojiPicker(false)}
          />
        </div>
      )}

      {/* Emoji Suggestions */}
      {emojiSuggestions.length > 0 && (
        <div className="absolute flex left-0 bottom-[100%] z-20 bg-gray-700 text-white rounded-lg p-2 shadow-lg w-full overflow-hidden">
          {emojiSuggestions.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(emoji)}
              className="block text-left px-3 py-1 hover:bg-gray-600 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputBox;
