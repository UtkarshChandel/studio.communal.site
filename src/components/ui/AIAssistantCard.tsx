"use client";

import { ReactNode } from "react";
import Image from "next/image";

interface FloatingIcon {
  icon: ReactNode;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size?: "sm" | "md" | "lg";
}

interface AIAssistantCardProps {
  name: string;
  role: string;
  description: string;
  floatingIcons: FloatingIcon[];
  image?: string;
  className?: string;
}

export default function AIAssistantCard({
  name,
  role,
  description,
  floatingIcons,
  image,
  className = "",
}: AIAssistantCardProps) {
  const getIconSize = (size: "sm" | "md" | "lg" = "md") => {
    const sizes = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };
    return sizes[size];
  };

  return (
    <div className={`relative ${className}`}>
      {/* Floating Icons */}
      {floatingIcons.map((iconData, index) => (
        <div
          key={index}
          className={`absolute z-10 ${getIconSize(
            iconData.size
          )} bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100`}
          style={iconData.position}
        >
          {iconData.icon}
        </div>
      ))}

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* Image Thumbnail */}
        {image && (
          <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden rounded-t-lg">
            <Image
              src={image}
              alt={`${name} - ${role}`}
              fill
              className="object-cover object-top transition-all duration-300 hover:scale-105 hover:brightness-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={true}
            />
          </div>
        )}

        {/* Card Content */}
        <div className={`p-8 ${image ? "pt-6" : "pt-12"}`}>
          <h3 className="font-dm-sans font-bold text-xl text-gray-900 mb-3">
            {role}, {name}
          </h3>

          <p className="font-geist text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
