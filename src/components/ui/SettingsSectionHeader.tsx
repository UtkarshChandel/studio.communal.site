import React from "react";

interface SettingsSectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SettingsSectionHeader({
  title,
  subtitle,
  className = "",
}: SettingsSectionHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <h2 className="font-inter font-semibold text-[24px] leading-[42px] tracking-[-0.48px] text-[#383838]">
        {title}
      </h2>
      {subtitle && (
        <p className="font-inter text-[14.18px] leading-[21px] text-[#484848] mt-[-6px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
