"use client";
import React, { useRef } from "react";

export default function ClickExample() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    alert("Button clicked!");
  };

  const triggerClick = () => {
    // প্রোগ্রাম্যাটিকভাবে ক্লিক করানো হচ্ছে
    buttonRef.current?.click();
  };

  return (
    <div className="p-4 space-y-3">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Real Button
      </button>

      <button
        onClick={triggerClick}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Trigger Button Click
      </button>
    </div>
  );
}
