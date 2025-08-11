import React from "react";
import Button from "./Button";
import CopyIcon from "./icons/CopyIcon";

interface SettingsOptionCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  // Optional background behind the icon container.
  // Pass "none" to remove the default tinted background.
  iconBg?: string;
  // Optional link display row as per Figma
  linkUrl?: string;
  onCopyLink?: () => void;
  // Optional extra action (e.g., Unpublish)
  extraAction?: {
    label: string;
    onClick: () => void;
    variant?: Parameters<typeof Button>[0]["variant"];
  };
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: Parameters<typeof Button>[0]["variant"];
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: Parameters<typeof Button>[0]["variant"];
  };
  className?: string;
}

export default function SettingsOptionCard({
  icon,
  title,
  description,
  iconBg,
  linkUrl,
  onCopyLink,
  extraAction,
  primaryAction,
  secondaryAction,
  className = "",
}: SettingsOptionCardProps) {
  return (
    <div
      className={`w-full rounded-[10px] border border-[#e2e2e2] bg-white p-4 ${className}`}
    >
      <div className="flex items-start gap-4 min-h-[72px]">
        {icon && (
          <div
            className={`w-[33px] h-[33px] rounded-[5px] flex items-center justify-center shrink-0 ${
              iconBg === "none"
                ? ""
                : iconBg
                ? iconBg
                : "bg-[rgba(67,97,238,0.19)]"
            }`}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-inter font-medium text-[16px] leading-[24px] text-[#3f3f3f]">
            {title}
          </div>
          {description && (
            <div className="font-inter text-[14px] leading-[21px] text-[#9c9c9c]">
              {description}
            </div>
          )}

          {linkUrl && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center justify-between h-[43px] rounded-[10px] bg-[rgba(67,97,238,0.11)] pl-[17px] pr-2 flex-1">
                <div className="font-inter text-[15px] leading-[22.141px] text-[rgba(0,0,0,0.8)] truncate">
                  {linkUrl}
                </div>
                <button
                  type="button"
                  aria-label="Copy link"
                  onClick={onCopyLink}
                  className="p-2 rounded-md hover:bg-black/5"
                >
                  <CopyIcon
                    className="w-[20px] h-[20px] cursor-pointer"
                    size={16}
                  />
                </button>
              </div>
              {extraAction && (
                <Button
                  variant={extraAction.variant || "secondary"}
                  onClick={extraAction.onClick}
                  size="md"
                >
                  {extraAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
        <div className={`flex items-center gap-3 ${linkUrl ? "hidden" : ""}`}>
          {primaryAction && !linkUrl && (
            <Button
              variant={primaryAction.variant || "secondary"}
              onClick={primaryAction.onClick}
              size="md"
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "primary"}
              onClick={secondaryAction.onClick}
              size="md"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
