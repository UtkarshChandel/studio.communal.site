import React from "react";

// Use the local public asset instead of the temporary localhost MCP URL
const copyIconAsset = "/icons/copy.svg";

interface CopyIconProps {
  size?: number;
  className?: string;
  alt?: string;
}

export default function CopyIcon({
  size = 20,
  className = "",
  alt = "copy",
}: CopyIconProps) {
  return (
    <img
      src={copyIconAsset}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
