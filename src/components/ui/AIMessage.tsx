import React, { useState } from "react";

const copyIcon =
  "http://localhost:3845/assets/6840e2d9af27456a3a0a5563409156d2e4a122d3.svg";
const likeIcon =
  "http://localhost:3845/assets/2162967405db7d11abb82092c39ec6fcac15cda6.svg";
const dislikeIcon =
  "http://localhost:3845/assets/bf7057eec01d1255f014259cda2e128ada22625f.svg";

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

  const handleLike = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCopied(false);
    const newState = likeState === "liked" ? "none" : "liked";
    setLikeState(newState);
    onLike?.();
  };

  const handleDislike = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCopied(false);
    const newState = likeState === "disliked" ? "none" : "disliked";
    setLikeState(newState);
    onDislike?.();
  };

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
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
      {/* AI Message Content with inline action buttons */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-900 whitespace-pre-wrap text-[16px] leading-[24px] tracking-[-0.01em] font-geist">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 mt-1">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                likeState === "liked" ? "text-green-600" : "text-gray-400"
              }`}
              aria-label="Like message"
            >
              <img src={likeIcon} alt="Like" className="h-5 w-5" />
            </button>

            {/* Dislike Button */}
            <button
              type="button"
              onClick={handleDislike}
              className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                likeState === "disliked" ? "text-red-600" : "text-gray-400"
              }`}
              aria-label="Dislike message"
            >
              <img src={dislikeIcon} alt="Dislike" className="h-5 w-5" />
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                copied ? "text-blue-600" : "text-gray-400"
              }`}
              aria-label={copied ? "Copied!" : "Copy message"}
            >
              <img src={copyIcon} alt="Copy" className="h-5 w-5" />
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
    </div>
  );
}
