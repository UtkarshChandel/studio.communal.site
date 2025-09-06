import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "gradient";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "font-inter",
    "font-semibold",
    "rounded-lg",
    "border",
    "cursor-pointer",
    "transition-all",
    "duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "text-nowrap",
  ];

  const sizeClasses = {
    sm: "px-3 h-[33px] text-sm leading-[20px] gap-1.5",
    md: "px-[18px] h-[41px] text-[16px] leading-[24px] gap-2",
    lg: "px-6 h-[48px] text-lg leading-7 gap-2.5",
  };

  const variantClasses = {
    primary: [
      "bg-[#4361ee]",
      "text-white",
      "border-[#4361ee]",
      "shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]",
      "hover:bg-[#3651dd]",
      "hover:border-[#3651dd]",
      "focus:ring-[#4361ee]/20",
      "active:bg-[#2d47cc]",
    ],
    secondary: [
      "bg-white",
      "text-[#414651]",
      "border-[#4361ee]",
      "shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]",
      // Keep background white on hover/active for pixel-perfect match
      "hover:bg-white",
      "hover:border-[#4361ee]",
      "focus:ring-[#4361ee]/20",
      "active:bg-white",
    ],
    outline: [
      "bg-transparent",
      "text-[#414651]",
      "border-gray-300",
      "hover:bg-gray-50",
      "focus:ring-gray-500/20",
      "active:bg-gray-100",
    ],
    ghost: [
      "bg-transparent",
      "text-[#414651]",
      "border-transparent",
      "hover:bg-gray-100",
      "focus:ring-gray-500/20",
      "active:bg-gray-200",
    ],
    danger: [
      "bg-[#fee4e2]",
      "text-[#d92d20]",
      "border-[#d92d20]",
      "shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]",
      // Keep static visual per Figma
      "hover:bg-[#fee4e2]",
      "hover:border-[#d92d20]",
      "focus:ring-[#d92d20]/20",
      "active:bg-[#fee4e2]",
    ],
    gradient: [
      "text-white",
      "border-0",
      "shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]",
      "focus:ring-[#3A0CA3]/20",
    ],
  };

  const widthClasses = fullWidth ? "w-full" : "w-auto";

  // For gradient variant, we need to apply custom styles
  const isGradient = variant === "gradient";

  const gradientStyles = isGradient
    ? {
        background:
          "linear-gradient(135.55deg, #3A0CA3 0%, rgba(67, 97, 238, 0.4) 131.05%)",
      }
    : {};

  const gradientHoverStyles = isGradient
    ? {
        ":hover": {
          background:
            "linear-gradient(135.55deg, #2d0b8c 0%, rgba(53, 81, 221, 0.4) 131.05%)",
        },
        ":active": {
          background:
            "linear-gradient(135.55deg, #22076b 0%, rgba(45, 71, 204, 0.4) 131.05%)",
        },
      }
    : {};

  const allClasses = [
    ...baseClasses,
    sizeClasses[size],
    ...variantClasses[variant],
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      );
    }

    return (
      <>
        {icon && iconPosition === "left" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </>
    );
  };

  return (
    <button
      type={type}
      className={allClasses}
      style={{
        ...gradientStyles,
        ...(isGradient && !disabled && !loading
          ? {
              transition: "all 0.2s",
            }
          : {}),
      }}
      onMouseEnter={(e) => {
        if (isGradient && !disabled && !loading) {
          e.currentTarget.style.background =
            "linear-gradient(135.55deg, #2d0b8c 0%, rgba(53, 81, 221, 0.4) 131.05%)";
        }
      }}
      onMouseLeave={(e) => {
        if (isGradient && !disabled && !loading) {
          e.currentTarget.style.background =
            "linear-gradient(135.55deg, #3A0CA3 0%, rgba(67, 97, 238, 0.4) 131.05%)";
        }
      }}
      onMouseDown={(e) => {
        if (isGradient && !disabled && !loading) {
          e.currentTarget.style.background =
            "linear-gradient(135.55deg, #22076b 0%, rgba(45, 71, 204, 0.4) 131.05%)";
        }
      }}
      onMouseUp={(e) => {
        if (isGradient && !disabled && !loading) {
          e.currentTarget.style.background =
            "linear-gradient(135.55deg, #2d0b8c 0%, rgba(53, 81, 221, 0.4) 131.05%)";
        }
      }}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {renderContent()}
    </button>
  );
}

//example usage

{
  /* <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Button Variants
              </h3>
                             <div className="flex flex-wrap gap-4">
                 <Button variant="primary">Primary Button</Button>
                 <Button variant="secondary">Secondary Button</Button>
                 <Button variant="gradient">Gradient Button</Button>
                 <Button variant="outline">Outline Button</Button>
                 <Button variant="ghost">Ghost Button</Button>
                 <Button variant="danger">Danger Button</Button>
               </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <Button loading>Loading...</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div> */
}
