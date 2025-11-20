"use client";

import React, {
  FC,
  useState,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  FocusEvent,
} from "react";

export const KeyboardEvents: FC = () => {
  const [key, setKey] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false); // ফোকাস ট্র্যাক করার জন্য

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value); // সাধারণভাবে value সেট
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      setValue(""); // ব্যাকস্পেস চাপলে ইনপুট ফাঁকা
    } else {
      setKey((prev) => [...prev, e.key]);
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    console.log("Input focused!");
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    console.log("Input blurred!");
  };

  return (
    <div className="p-4">
      <input
        type="text"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Type something..."
        className={`border px-2 py-1 rounded ${
          focused ? "border-blue-500 shadow-md" : "border-gray-300"
        }`}
      />
      <p>Pressed Keys: {key.join("")}</p>
      <p>Value: {value}</p>
      <p>Focus status: {focused ? "Active" : "Not Active"}</p>
    </div>
  );
};
