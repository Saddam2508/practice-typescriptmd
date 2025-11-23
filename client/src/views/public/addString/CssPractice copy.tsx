"use client";

import React, { FC, useRef } from "react";

const CssPractice: FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const ITEM_WIDTH = 160; // 144px box + 16px gap
  const SCROLL_AMOUNT = ITEM_WIDTH;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-100 w-full h-screen flex items-center justify-center relative overflow-hidden group">
      {/* Left button */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        ◀
      </button>

      {/* Scroll Container */}
      <div className="w-[90%] overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar pr-4"
        >
          {["A", "B", "C", "D", "E", "F", "G", "H"].map((item) => (
            <div
              key={item}
              className="min-w-[144px] h-40 bg-blue-600 flex justify-center items-center text-white rounded-md shadow-lg"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right button */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        ▶
      </button>
    </div>
  );
};

export default CssPractice;
