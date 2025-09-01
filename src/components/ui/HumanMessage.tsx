import React from "react";

interface HumanMessageProps {
  message: string;
  userName?: string;
  userAvatar?: string;
  showAvatar?: boolean;
  className?: string;
}

export default function HumanMessage({
  message,
  userName = "You",
  userAvatar,
  showAvatar = true,
  className = "",
}: HumanMessageProps) {
  const renderAvatar = () => {
    if (!showAvatar) return null;

    return (
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#3d3d3a] flex items-center justify-center font-medium text-[12px] text-[#faf9f5]">
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="font-medium">
            {userName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`flex items-start gap-2 justify-start ${className}`}>
      {/* Avatar */}
      {renderAvatar()}

      {/* Message Bubble */}
      <div className="max-w-full sm:w-auto md:min-w-[80%] lg:max-w-[60%]">
        <div className="bg-[#e6ebff] p-[10px] rounded-xl block sm:inline-block">
          <p className="text-[15.88px] leading-[26.4px] text-[#141413] font-normal tracking-[-0.24px] whitespace-pre-wrap break-words font-inter">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
