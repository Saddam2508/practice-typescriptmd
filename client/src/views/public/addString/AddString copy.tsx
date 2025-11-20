"use client";

import React, { useState, ChangeEvent, MouseEvent, FC } from "react";

export const AddString: FC = () => {
  const [inputValue, setInputValue] = useState<string>(""); // ইনপুট মান
  const [items, setItems] = useState<string[]>([]); // সব string-এর লিস্ট

  // ইনপুট পরিবর্তন
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // নতুন আইটেম যোগ
  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    setItems((prev) => [...prev, inputValue]);
    setInputValue("");
  };

  // নির্দিষ্ট আইটেম রিমুভ
  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Please type"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* লিস্ট দেখানো */}
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span>{item}</span>
            <button
              onClick={() => handleRemove(i)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
