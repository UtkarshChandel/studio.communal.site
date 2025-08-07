interface AvatarProps {
  name: string;
  role: string;
  imageUrl?: string;
  showOnlineStatus?: boolean;
  badge?: {
    text: string;
    color?: "orange" | "green" | "blue" | "gray";
  };
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export default function Avatar({
  name,
  role,
  imageUrl,
  showOnlineStatus = false,
  badge,
  size = "md",
  onClick,
}: AvatarProps) {
  const sizeClasses = {
    sm: {
      avatar: "size-8",
      container: "gap-3",
      name: "text-sm",
      role: "text-xs",
      status: "size-2.5",
      statusPosition: "bottom-0 right-0",
    },
    md: {
      avatar: "size-[50px]",
      container: "gap-3",
      name: "text-[16px]",
      role: "text-[13px]",
      status: "size-[13px]",
      statusPosition: "bottom-0.5 right-0.5",
    },
    lg: {
      avatar: "size-16",
      container: "gap-4",
      name: "text-lg",
      role: "text-sm",
      status: "size-4",
      statusPosition: "bottom-0 right-0",
    },
  };

  const badgeColors = {
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`flex items-center ${currentSize.container} ${
        onClick
          ? "cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
          : ""
      }`}
      onClick={onClick}
    >
      {/* Avatar Container */}
      <div className="relative flex-shrink-0">
        <div
          className={`${currentSize.avatar} rounded-full bg-gray-200 border-2 border-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] overflow-hidden flex items-center justify-center`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium text-lg">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>

        {/* Online Status Indicator */}
        {showOnlineStatus && (
          <div
            className={`absolute ${currentSize.statusPosition} ${currentSize.status} bg-green-500 rounded-full border-2 border-white`}
          />
        )}
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className={`font-medium text-[#101828] leading-tight ${currentSize.name} truncate`}
          >
            {name}
          </h3>
          {badge && (
            <span
              className={`px-2 py-1 rounded-full border text-xs font-medium ${
                badgeColors[badge.color || "orange"]
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        <p
          className={`font-normal text-[#667085] leading-tight ${currentSize.role} truncate mt-0.5`}
        >
          {role}
        </p>
      </div>
    </div>
  );
}
