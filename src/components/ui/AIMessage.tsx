import React, { useState } from "react";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as HandThumbUpSolidIcon,
  HandThumbDownIcon as HandThumbDownSolidIcon,
} from "@heroicons/react/24/solid";

interface AIMessageProps {
  message: string;
  showActions?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
  className?: string;
}

export default function AIMessage({
  message,
  showActions = true,
  onLike,
  onDislike,
  onCopy,
  className = "",
}: AIMessageProps) {
  const [likeState, setLikeState] = useState<"none" | "liked" | "disliked">(
    "none"
  );
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    const newState = likeState === "liked" ? "none" : "liked";
    setLikeState(newState);
    onLike?.();
  };

  const handleDislike = () => {
    const newState = likeState === "disliked" ? "none" : "disliked";
    setLikeState(newState);
    onDislike?.();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`group relative ${className}`}>
      {/* AI Message Content */}
      <div className="mb-3">
        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-[16px]">
          {message}
        </p>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
              likeState === "liked" ? "text-green-600" : "text-gray-400"
            }`}
            aria-label="Like message"
          >
            {likeState === "liked" ? (
              <HandThumbUpSolidIcon className="h-5 w-5" />
            ) : (
              <HandThumbUpIcon className="h-5 w-5" />
            )}
          </button>

          {/* Dislike Button */}
          <button
            onClick={handleDislike}
            className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
              likeState === "disliked" ? "text-red-600" : "text-gray-400"
            }`}
            aria-label="Dislike message"
          >
            {likeState === "disliked" ? (
              <HandThumbDownSolidIcon className="h-5 w-5" />
            ) : (
              <HandThumbDownIcon className="h-5 w-5" />
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
              copied ? "text-blue-600" : "text-gray-400"
            }`}
            aria-label={copied ? "Copied!" : "Copy message"}
          >
            <ClipboardDocumentIcon className="h-5 w-5" />
          </button>

          {/* Copy Feedback */}
          {copied && (
            <span className="text-sm text-blue-600 ml-2 animate-fade-in">
              Copied!
            </span>
          )}
        </div>
      )}
    </div>
  );
}
