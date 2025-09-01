"use client";

import React from "react";
import { logger } from "@/lib/logger";

export default function StreamingMarkdown({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  logger.component("StreamingMarkdown", "render - content:", content);
  logger.component(
    "StreamingMarkdown",
    "render - content length:",
    content?.length
  );
  const [Renderer, setRenderer] = React.useState<React.ComponentType<{
    content: string;
    className?: string;
  }> | null>(null);

  React.useEffect(() => {
    let mounted = true;
    import("streamdown")
      .then((m: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!mounted) return;
        const Comp = m.Streamdown || m.default || null;
        if (Comp) setRenderer(() => Comp);
      })
      .catch(() => {
        // fallback silently
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (Renderer) {
    logger.component("StreamingMarkdown", "using Renderer component");
    try {
      // Try children first (common for markdown renderers); fallback to content prop
      return (
        <div className={className}>
          <Renderer content={content} />
        </div>
      );
    } catch (_e) {
      logger.component("StreamingMarkdown", "Renderer failed, using fallback");
      return (
        <div className={className}>
          <Renderer content={content} />
        </div>
      );
    }
  }

  logger.component("StreamingMarkdown", "using fallback <pre> element");
  return (
    <pre
      className={`whitespace-pre-wrap text-[15.88px] leading-[26.4px] tracking-[-0.24px] font-inter font-normal ${className}`}
    >
      {content}
    </pre>
  );
}
