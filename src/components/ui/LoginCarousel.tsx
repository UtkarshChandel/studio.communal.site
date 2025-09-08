"use client";

import React, { useState, useEffect, useRef } from "react";

interface CarouselItem {
  type: "title" | "role";
  title: string;
  description: string;
  quote?: string;
  subtitle?: string;
  bulletPoints?: string[];
  quoteText?: string;
  primaryAction?: {
    text: string;
    url: string;
  };
  secondaryAction?: {
    text: string;
    url: string;
  };
  icon?: string;
}

interface LoginCarouselProps {
  className?: string;
  autoSlide?: boolean;
  autoSlideIntervalMs?: number;
  onBookCall?: () => void;
  buttonText?: string;
  buttonHref?: string;
}

export default function LoginCarousel({
  className = "",
  autoSlide = false,
  autoSlideIntervalMs = 5000,
  onBookCall,
  buttonText = "Book a Call",
  buttonHref,
}: LoginCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const isSwipingRef = useRef<boolean>(false);
  const SWIPE_THRESHOLD = 50;

  const carouselData: CarouselItem[] = [
    {
      type: "title",
      title: "Who is Communal AI Studio for?",
      description:
        "Build your AI Clone to scale your expertise, stay responsive, and grow stress-free..",
      quote:
        "Consultants & Consulting Firms\nVCs/Founders/Operators\nEducators\nSocial Influencers",
    },
    {
      type: "role",
      title: "For Consultants & Consulting Firms",
      description:
        "Tired of repeating yourself to clients?\nStay responsive even when you're unavailable",
      quote:
        "Scale your expertise without burning out\nStay responsive even when you're unavailable\nBuild consistent client relationships",
      icon: "🧠",
    },
    {
      type: "role",
      title: "For VCs, Founders & Operators",
      description: "Our AI Clone is our new Chief of Staff.",
      quote:
        "Align your entire team with consistent messaging\nScale your thought leadership and expertise\nBuild your personal brand while you focus on strategy",
      icon: "🚀",
    },
    {
      type: "role",
      title: "For Educators",
      description: "Now every student gets 1:1 time..",
      quote:
        "Provide 1:1 mentorship to every student\nAnswer common questions instantly\nScale your teaching impact without limits",
      icon: "🎓",
    },
  ];

  // Optional auto-advance carousel
  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideIntervalMs);

    return () => clearInterval(interval);
  }, [autoSlide, autoSlideIntervalMs, carouselData.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? carouselData.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === carouselData.length - 1 ? 0 : currentIndex + 1
    );
  };

  const currentItem = carouselData[currentIndex];

  return (
    <div
      className={`block relative mx-auto lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 
        w-full max-w-[360px] sm:max-w-[380px] lg:max-w-[420px] xl:max-w-[450px] 
        lg:h-[420px] xl:h-[440px] touch-pan-y ${className}`}
      onTouchStart={(e) => {
        const t = e.touches[0];
        touchStartXRef.current = t.clientX;
        touchStartYRef.current = t.clientY;
        touchDeltaXRef.current = 0;
        isSwipingRef.current = false;
      }}
      onTouchMove={(e) => {
        if (
          touchStartXRef.current === null ||
          touchStartYRef.current === null
        ) {
          return;
        }
        const t = e.touches[0];
        const dx = t.clientX - touchStartXRef.current;
        const dy = t.clientY - touchStartYRef.current;
        if (!isSwipingRef.current) {
          if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
            isSwipingRef.current = true;
          } else {
            return;
          }
        }
        // While actively swiping horizontally, prevent vertical scroll from hijacking the gesture
        e.preventDefault();
        touchDeltaXRef.current = dx;
      }}
      onTouchEnd={() => {
        if (!isSwipingRef.current) return;
        const dx = touchDeltaXRef.current;
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          if (dx < 0) {
            // swipe left -> next
            setCurrentIndex((prev) =>
              prev === carouselData.length - 1 ? 0 : prev + 1
            );
          } else {
            // swipe right -> previous
            setCurrentIndex((prev) =>
              prev === 0 ? carouselData.length - 1 : prev - 1
            );
          }
        }
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        touchDeltaXRef.current = 0;
        isSwipingRef.current = false;
      }}
    >
      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        className="hidden lg:flex absolute left-[-50px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg border border-white/20 items-center justify-center transition-all duration-200 hover:scale-110 z-10 cursor-pointer"
        aria-label="Previous slide"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="hidden lg:flex absolute right-[-50px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg border border-white/20 items-center justify-center transition-all duration-200 hover:scale-110 z-10 cursor-pointer"
        aria-label="Next slide"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>

      {/* Main Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-7 lg:p-8 border border-white/20 h-full flex flex-col justify-between font-inter overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Dynamic Icon */}
          <div className="w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center mb-4 md:mb-6">
            {currentItem.icon || currentItem.type === "role" ? (
              <span className="text-lg md:text-2xl">{currentItem.icon}</span>
            ) : (
              <span className="text-lg md:text-2xl">🟣</span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg md:text-xl font-semibold text-[#11181c] mb-3 md:mb-4 leading-tight break-words overflow-hidden">
            {currentItem.title}
          </h2>

          {/* Quote/List Items */}
          <div className="mb-4 md:mb-6 flex-1 overflow-hidden">
            {(currentItem.quote ?? "").split("\n").map((line, index) => (
              <div key={index} className="flex items-center mb-2 last:mb-0">
                <div className="w-1.5 h-1.5 bg-[#4361ee] rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-[#5a6572] text-xs md:text-sm font-medium break-words">
                  {line}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-[#5a6572] text-xs md:text-sm leading-relaxed mb-4 md:mb-6 break-words overflow-hidden">
            {currentItem.description}
          </p>

          {/* CTA Button */}
          <div className="mb-4 md:mb-6">
            {buttonHref ? (
              <a
                href={buttonHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#4361ee] hover:bg-[#3730a3] text-white font-medium text-sm md:text-base py-3 px-6 rounded-xl transition-colors duration-200 block text-center"
              >
                {buttonText}
              </a>
            ) : (
              <button
                onClick={onBookCall}
                className="w-full bg-[#4361ee] hover:bg-[#3730a3] text-white font-medium text-sm md:text-base py-3 px-6 rounded-xl transition-colors duration-200"
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center space-x-2">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#4361ee] w-8"
                  : "bg-[#d1d5db] hover:bg-[#9ca3af]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Subtle gradient overlay for better text contrast (desktop only) */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-2xl pointer-events-none -z-10"></div>
    </div>
  );
}
