import React, { useState } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

export const ChatInput = ({ onSubmit }: ChatInputProps): React.JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSubmit(searchQuery);
      setSearchQuery("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full h-16 bg-gray-50 rounded-2xl border-2 border-purple-800 flex items-center"
        role="search"
      >
        {/* Input Field */}
        <input
          id="expertise-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-full px-6 text-gray-700 text-base font-inter placeholder-gray-600 bg-transparent border-none outline-none focus:ring-0"
          placeholder="What expertise are we scaling today?"
          aria-label="Search for expertise"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!searchQuery.trim()}
          className="mr-2 w-12 h-12 rounded-xl bg-gradient-to-r from-violet-700 to-violet-400 hover:from-violet-900 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-sm"
          aria-label="Search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.71935 13.0296C9.64943 12.9599 9.59395 12.8771 9.5561 12.786C9.51824 12.6948 9.49876 12.5971 9.49876 12.4984C9.49876 12.3997 9.51824 12.3019 9.5561 12.2108C9.59395 12.1196 9.64943 12.0368 9.71935 11.9671L12.9375 8.749L3.74997 8.749C3.55106 8.749 3.3603 8.66998 3.21965 8.52933C3.07899 8.38867 2.99997 8.19791 2.99997 7.999C2.99997 7.80008 3.07899 7.60932 3.21965 7.46867C3.3603 7.32801 3.55106 7.249 3.74998 7.249L12.9375 7.249L9.71935 4.02962C9.57845 3.88872 9.4993 3.69763 9.4993 3.49837C9.4993 3.29911 9.57845 3.10802 9.71935 2.96712C9.86025 2.82622 10.0513 2.74707 10.2506 2.74707C10.4499 2.74707 10.641 2.82622 10.7818 2.96712L15.2818 7.46712C15.3518 7.5368 15.4072 7.61959 15.4451 7.71076C15.483 7.80192 15.5024 7.89966 15.5024 7.99837C15.5024 8.09708 15.483 8.19482 15.4451 8.28599C15.4072 8.37715 15.3518 8.45994 15.2818 8.52962L10.7818 13.0296C10.7122 13.0995 10.6294 13.155 10.5382 13.1929C10.447 13.2307 10.3493 13.2502 10.2506 13.2502C10.1519 13.2502 10.0541 13.2307 9.96299 13.1929C9.87182 13.155 9.78903 13.0995 9.71935 13.0296Z"
              fill="white"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
