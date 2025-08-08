import React, { useState } from "react";

const sendIcon =
  "http://localhost:3845/assets/c7f5f9a1104035eb331d7aea391f1974fa37eddd.svg";

interface ChatInputTextAreaProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

export default function ChatInputTextArea({
  onSubmit,
  placeholder = "What expertise are we scaling today?",
  disabled = false,
  loading = false,
}: ChatInputTextAreaProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !loading) {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative w-full">
      {/* Gradient Border Container */}
      <div
        className={`relative rounded-[14px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] ${loading ? "p-[3px]" : "p-[2px]"}`}
        style={{
          background: loading
            ? `conic-gradient(from 0deg, #8b5cf6, #3b82f6, #8b5cf6, #a855f7, #8b5cf6)`
            : `linear-gradient(90deg, #a78bfa, #60a5fa, #a78bfa)`,
          animation: loading ? "gradient-rotate 3s linear infinite" : undefined,
        }}
      >
        {/* Background Container */}
        <div className="bg-[#f9f9f9] rounded-xl h-[136px] w-full relative">
          <form onSubmit={handleSubmit} className="h-full flex">
            {/* Text Area */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || loading}
              className={`
                  flex-1 bg-transparent border-none outline-none resize-none
                  px-[35px] py-6 
                  font-inter font-normal text-[16px] leading-[18.2px] tracking-[-0.2px]
                  text-[#424242] placeholder:text-[#424242] placeholder:opacity-80
                  ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              rows={4}
            />

            {/* Send Button */}
            <div className="flex items-end p-4">
              <button
                type="submit"
                disabled={!message.trim() || disabled || loading}
                className={`
                    w-11 h-[41px] rounded-lg 
                    bg-gradient-to-r from-violet-700 to-violet-400 
                    hover:from-violet-900 hover:to-violet-700
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center
                    transition-all duration-200 shadow-sm
                    ${loading ? "animate-pulse" : ""}
                  `}
                aria-label={loading ? "Sending..." : "Send message"}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <img src={sendIcon} alt="Send" className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient-rotate {
          0% {
            background: conic-gradient(
              from 0deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
          25% {
            background: conic-gradient(
              from 90deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
          50% {
            background: conic-gradient(
              from 180deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
          75% {
            background: conic-gradient(
              from 270deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
          100% {
            background: conic-gradient(
              from 360deg,
              #8b5cf6,
              #3b82f6,
              #8b5cf6,
              #a855f7,
              #8b5cf6
            );
          }
        }
      `}</style>
    </div>
  );
}
