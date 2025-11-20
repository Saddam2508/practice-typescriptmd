"use client";

import React, { useRef, useState } from "react";

export const DomMethodsDemo = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [value, setValue] = useState("Hello World!");
  const [color, setColor] = useState("bg-gray-700");

  const handleFocus = () => inputRef.current?.focus();
  const handleBlur = () => inputRef.current?.blur();
  const handleSelect = () => inputRef.current?.select();
  const handleSetSelectionRange = () =>
    inputRef.current?.setSelectionRange(0, 5);

  const handleClickButton = () => {
    alert("Trigger Button Clicked!");
    // Real Button এর ব্যাকগ্রাউন্ড পরিবর্তন করো
    setColor("bg-green-600");
    // এবং তার click() ইভেন্টও ট্রিগার করো
    buttonRef.current?.click();
  };

  const handleRealButtonClick = () => {
    alert("✅ Real Button clicked via ref or directly!");
    // ক্লিক হলে রঙ আবার পরিবর্তন করো
    setColor("bg-blue-600");
  };

  return (
    <div className="p-4 space-y-4 max-w-md">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border px-2 py-1 rounded w-full"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleFocus}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Focus
        </button>
        <button
          onClick={handleBlur}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Blur
        </button>
        <button
          onClick={handleSelect}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Select All
        </button>
        <button
          onClick={handleSetSelectionRange}
          className="px-3 py-1 bg-purple-500 text-white rounded"
        >
          Select 0–5
        </button>
        <button
          onClick={handleClickButton}
          className="px-3 py-1 bg-yellow-500 text-black rounded"
        >
          Trigger Button Click
        </button>
      </div>

      <button
        ref={buttonRef}
        onClick={handleRealButtonClick}
        className={`px-3 py-1 text-white rounded transition ${color}`}
      >
        Real Button
      </button>
    </div>
  );
};
