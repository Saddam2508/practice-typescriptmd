"use client";

import React, { FC, useState, useRef, useEffect } from "react";

export const KeyboardEvents: FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  // 🟢 প্রথমবার কম্পোনেন্ট লোড হলে ইনপুটে ফোকাস দাও
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 🟡 বাটনে ক্লিক করলে আবার ফোকাসে যাবে
  const handleFocusClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 space-y-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Type something..."
        className={`border px-2 py-1 rounded ${
          focused ? "border-blue-500 shadow-md" : "border-gray-300"
        }`}
      />
      <button
        onClick={handleFocusClick}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Focus Input
      </button>

      <p>Focus status: {focused ? "Active" : "Not Active"}</p>
      <p>Value: {value}</p>
    </div>
  );
};
