import React from "react";

// Figma-exported copy vector asset
const copyIconAsset =
  "http://localhost:3845/assets/210181dfda084d63f316e2cf1c9b9f0614e8043a.svg";

interface CopyIconProps {
  size?: number;
  className?: string;
  alt?: string;
}

export default function CopyIcon({
  size = 16,
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
