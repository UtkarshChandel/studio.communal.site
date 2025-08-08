import React from "react";

// Placeholder: same asset for now unless a different node is specified in Figma selection
const extensionIconAsset =
  "/link.svg";

interface ExtensionIconProps {
  size?: number;
  className?: string;
  alt?: string;
}

export default function ExtensionIcon({
  size = 24,
  className = "",
  alt = "extension",
}: ExtensionIconProps) {
  return (
    <img
      src={extensionIconAsset}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
