import React from "react";

// Placeholder: same asset for now unless a different node is specified in Figma selection
const embedIconAsset = "/link.svg";

interface EmbedIconProps {
  size?: number;
  className?: string;
  alt?: string;
}

export default function EmbedIcon({
  size = 24,
  className = "",
  alt = "embed",
}: EmbedIconProps) {
  return (
    <img
      src={embedIconAsset}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
