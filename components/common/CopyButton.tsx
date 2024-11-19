import {
  Check,
  CheckIcon,
  CopyCheck,
  CopyCheckIcon,
  CopyIcon,
} from "lucide-react";
import React, { useState } from "react";

interface CopyButtonProps {
  textToCopy: string | undefined;
}

const CopyButton = ({ textToCopy }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy || "")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text", err);
      });
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center text-xs opacity-80 lg:text-sm font-normal gap-2 px-2 text-white rounded-md transition-all duration-200 ${
        copied ? "bg-green-700" : ""
      }`}
    >
      {textToCopy}
      {copied ? (
        <CheckIcon className="w-3 h-3 lg:w-4 lg:h-4" />
      ) : (
        <CopyIcon className="w-3 h-3 lg:w-4 lg:h-4" />
      )}
    </button>
  );
};

export default CopyButton;
