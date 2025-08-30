"use client";

import React from "react";

export default function StreamingMarkdown({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const [Renderer, setRenderer] =
    React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    let mounted = true;
    import("streamdown")
      .then((m: any) => {
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
    try {
      // Try children first (common for markdown renderers); fallback to content prop
      return (
        <div className={className}>
          <Renderer>{content}</Renderer>
        </div>
      );
    } catch (_e) {
      return (
        <div className={className}>
          {/* @ts-ignore */}
          <Renderer content={content} />
        </div>
      );
    }
  }

  return (
    <pre
      className={`whitespace-pre-wrap text-[16px] leading-[24px] tracking-[-0.01em] font-geist ${className}`}
    >
      {content}
    </pre>
  );
}
