import React from "react";

// Figma-exported SVG asset URL (vector) — use directly per MCP guidance
const linkIconAsset =
  // This file is kept at: front-end/src/components/ui/icons/LinkIcon.tsx
  "/link.svg";

interface LinkIconProps {
  size?: number; // pixel size, defaults to 24 (matches Figma size-6)
  className?: string;
  alt?: string;
}

export default function LinkIcon({
  size = 24,
  className = "",
  alt = "link",
}: LinkIconProps) {
  return (
    <img
      src={linkIconAsset}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
