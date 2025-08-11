import React, { useState, useRef } from "react";

const SendIcon = ({
  className = "",
  width = 16,
  height = 16,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.71935 13.0296C9.64943 12.9599 9.59395 12.8771 9.5561 12.786C9.51824 12.6948 9.49876 12.5971 9.49876 12.4984C9.49876 12.3997 9.51824 12.3019 9.5561 12.2108C9.59395 12.1196 9.64943 12.0368 9.71935 11.9671L12.9375 8.749L3.74997 8.749C3.55106 8.749 3.3603 8.66998 3.21965 8.52933C3.07899 8.38867 2.99997 8.19791 2.99997 7.999C2.99997 7.80008 3.07899 7.60932 3.21965 7.46867C3.3603 7.32801 3.55106 7.249 3.74998 7.249L12.9375 7.249L9.71935 4.02962C9.57845 3.88872 9.4993 3.69763 9.4993 3.49837C9.4993 3.29911 9.57845 3.10802 9.71935 2.96712C9.86025 2.82622 10.0513 2.74707 10.2506 2.74707C10.4499 2.74707 10.641 2.82622 10.7818 2.96712L15.2818 7.46712C15.3518 7.5368 15.4072 7.61959 15.4451 7.71076C15.483 7.80192 15.5024 7.89966 15.5024 7.99837C15.5024 8.09708 15.483 8.19482 15.4451 8.28599C15.4072 8.37715 15.3518 8.45994 15.2818 8.52962L10.7818 13.0296C10.7122 13.0995 10.6294 13.155 10.5382 13.1929C10.447 13.2307 10.3493 13.2502 10.2506 13.2502C10.1519 13.2502 10.0541 13.2307 9.96299 13.1929C9.87182 13.155 9.78903 13.0995 9.71935 13.0296Z"
      fill="white"
    />
  </svg>
);

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !loading) {
      onSubmit(message.trim());
      setMessage("");
      // Ensure focus stays on the textarea after submit
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
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
        className={`relative rounded-[14px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] ${
          loading ? "p-[3px]" : "p-[2px]"
        }`}
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
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
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
                  <SendIcon className="w-4 h-4" />
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
