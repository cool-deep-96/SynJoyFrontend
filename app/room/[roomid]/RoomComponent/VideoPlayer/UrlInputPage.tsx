import React, { ChangeEvent, useState } from "react";
import { SycVideoPayload, useVideo } from "./VideoPlayerContext";
import { Source } from "@/interfaces/interfaces";
import { Upload } from "lucide-react";
import { useSocketUser } from "../../SocketContextProvider/SocketContext";

const UrlInputPage: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");

  const { setUrl, setSource, setTitle, setIsPlaying, emitVideoSyncToServer } =
    useVideo();
  const { tokenData } = useSocketUser();

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    const videoTitle = file?.name.replace(/\.[^/.]+$/, "");
    if (videoTitle) {
      setVideoTitle(videoTitle);
    }
  };

  // Handle URL input change
  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setYoutubeUrl(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault(); // Prevent page refresh
    if (youtubeUrl) {
      const payload: SycVideoPayload = {
        source: Source.YOUTUBE,
        isPlaying: false,
        currentTime: 0,
        tokenData,
        url: youtubeUrl,
      };
      emitVideoSyncToServer(payload);
    } else if (videoFile) {
      setSource(Source.FILE);
      const videoTitle = videoFile.name.replace(/\.[^/.]+$/, "");
      const fileUrl = URL.createObjectURL(videoFile);
      setUrl(fileUrl);
      setIsPlaying(false);
      setTitle(videoTitle);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 text-white shadow-md rounded-lg space-y-6"
    >
      <div>
        <label
          htmlFor="fileUpload"
          className="flex gap-5 text-lg font-medium  mb-2"
        >
          Select From File <Upload />
        </label>
        <input
          type="file"
          id="fileUpload"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="line-clamp-1 hover:line-clamp-none">{videoTitle}</p>
      </div>

      <div>
        <label htmlFor="youtubeUrl" className="block text-lg font-medium mb-2">
          Or paste YouTube URL:
        </label>
        <input
          type="url"
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={handleUrlChange}
          placeholder="https://www.youtube.com/watch?v=example"
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Confirm
      </button>
    </form>
  );
};

export default UrlInputPage;
