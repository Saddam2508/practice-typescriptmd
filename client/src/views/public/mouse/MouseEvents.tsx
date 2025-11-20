"use client";

import React, { FC, useState, useRef, MouseEvent } from "react";

export const MouseEvents: FC = () => {
  const [moveCount, setMoveCount] = useState(0);
  const [mouseOver, setMouseOver] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => alert("Clicked!");
  const handleDoubleClick = () => alert("Double Clicked!");

  const handleContextMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert("Right Click (Context Menu)!");
  };

  const handleMouseOver = (e: MouseEvent<HTMLButtonElement>) => {
    setMouseOver((prev) => {
      if (e.type !== "mouseover") {
        return "";
      } else {
        return prev + "" + e.type;
      }
    });
  };
  const handleMouseOut = () => console.log("Mouse out");
  const handleMouseMove = () => {
    setMoveCount((prev) => prev + 1);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // নতুন টাইমার চালাও
    timerRef.current = setTimeout(() => {
      setMoveCount(0); // কিছুক্ষণ পর রিসেট
    }, 1000); // 1000ms = 1 সেকেন্ড
  };
  const handleMouseDown = () => console.log("Mouse down");
  const handleMouseUp = () => console.log("Mouse up");

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Hover / Click Me
      </button>
      <p>Mouse Move: {moveCount}</p>

      <p>Mouse over: {mouseOver}</p>
    </div>
  );
};
