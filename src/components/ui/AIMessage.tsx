import React, { useState } from "react";
import StreamingMarkdown from "@/components/ui/StreamingMarkdown";

const LikeIcon = ({
  className = "",
  width = 20,
  height = 20,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => (
  <img
    src="/icons/like.svg"
    alt="Like"
    width={width}
    height={height}
    className={className}
  />
);

const DislikeIcon = ({
  className = "",
  width = 20,
  height = 20,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => (
  <img
    src="/icons/dislike.svg"
    alt="Dislike"
    width={width}
    height={height}
    className={className}
  />
);

const CopyIcon = ({
  className = "",
  width = 20,
  height = 20,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => (
  <img
    src="/icons/copy.svg"
    alt="Copy"
    width={width}
    height={height}
    className={className}
  />
);

interface AIMessageProps {
  message: string;
  showActions?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
  className?: string;
  showCaret?: boolean;
}

export default function AIMessage({
  message,
  showActions = true,
  onLike,
  onDislike,
  onCopy,
  className = "",
  showCaret = false,
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <StreamingMarkdown content={message} />
          {showCaret && (
            <span className="inline-block w-3 h-[1.2em] align-[-0.2em] ml-0.5 animate-pulse bg-gray-300 rounded-sm" />
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 mt-1 sm:mt-1 justify-end sm:justify-start">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                likeState === "liked" ? "text-green-600" : "text-gray-400"
              }`}
              aria-label="Like message"
            >
              <LikeIcon className="h-5 w-5" />
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
              <DislikeIcon className="h-5 w-5" />
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
              <CopyIcon className="h-5 w-5" />
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
