"use client";

import React, { FC, useRef } from "react";

const CssPractice: FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const ITEM_WIDTH = 170;
  const SCROLL_MOUNT = ITEM_WIDTH;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_MOUNT, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_MOUNT, behavior: "smooth" });
  };

  return (
    <div className="container w-full h-screen bg-amber-100 relative group flex items-center justify-center">
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2  bg-amber-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        {" "}
        ◀
      </button>
      <div
        ref={scrollRef}
        className="bg-gray-300 w-[90%] h-screen m-5 flex gap-4 justify-start items-center overflow-x-auto scroll"
      >
        {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((d) => (
          <div
            key={d}
            className="bg-blue-500 h-50 min-w-[140px] flex justify-center items-center rounded-md text-white font-semibold"
          >
            {d}
          </div>
        ))}
      </div>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-amber-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        {" "}
        ▶
      </button>
    </div>
  );
};

export default CssPractice;
