import React from "react";
import GradientBorderBox from "./GradientBorderBox";

interface MetricCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  statusBadge?: { label: string; colorClass?: string };
  className?: string;
}

export default function MetricCard({
  title,
  subtitle,
  value,
  statusBadge,
  className = "",
}: MetricCardProps) {
  return (
    <GradientBorderBox className={`w-full ${className}`} innerClassName="p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-inter font-medium text-[20px] leading-8 tracking-[-0.4px] text-[#3d3d3a]">
            {title}
          </h3>
          {statusBadge && (
            <span
              className={`px-2 py-1 rounded-[10px] text-[14px] leading-4 text-white ${
                statusBadge.colorClass || "bg-[#49bc43]"
              }`}
            >
              {statusBadge.label}
            </span>
          )}
        </div>
        {typeof value !== "undefined" && (
          <div className="font-inter font-semibold text-[52px] leading-[75px] text-[#363535]">
            {value}
          </div>
        )}
        {subtitle && (
          <p className="font-inter text-[14px] leading-[21px] text-[#7e7e7e]">
            {subtitle}
          </p>
        )}
      </div>
    </GradientBorderBox>
  );
}
