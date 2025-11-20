"use client";

import React, { FC, useState, useRef, KeyboardEvent, ChangeEvent } from "react";

export const KeyboardEvents: FC = () => {
  const [key, setKey] = useState<string[]>([]);
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue((prev) => prev + value);
    if (e.type === "chage") {
      setValue("");
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      setValue(""); // ব্যাকস্পেস চাপলে ইনপুট ফাঁকা
    }
  };

  // const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
  //   const key = e.key;
  //  if (key === "Backspace") {
  //   window.alert("do not save please");
  // } else {
  //   setKey(key);
  // }
  //   switch (key) {
  //     case "Backspace":
  //       setKey((prev) => prev.slice(0, -1));
  //       break;

  //     default:
  //       setKey((prev) => [...(prev + key)]);
  //       break;
  //   }
  // };

  return (
    <div>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder="Type something..."
        className="border"
      />
      <p>Press Keys: {key.join("")}</p>
      <p>{value}</p>
    </div>
  );
};
