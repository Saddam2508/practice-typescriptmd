"use client";

import React, { useState, ChangeEvent, MouseEvent, FC } from "react";

export const AddString: FC = () => {
  const [inputValue, setInputValue] = useState<string>(""); // ইনপুটের মান
  const [items, setItems] = useState<string[]>([]); // সব string
  const [editIndex, setEditIndex] = useState<number | null>(null); // কোন আইটেম এডিট হচ্ছে

  // ইনপুট পরিবর্তন
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // যোগ বা আপডেট
  const handleAddOrUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (inputValue.trim() === "") return;

    if (editIndex !== null) {
      // এডিট মোডে: নির্দিষ্ট আইটেম আপডেট করা
      const updatedItems = [...items];
      updatedItems[editIndex] = inputValue;
      setItems(updatedItems);
      setEditIndex(null);
      setInputValue("");
    } else {
      // নতুন যোগ
      setItems((prev) => [...prev, inputValue]);
      setInputValue("");
    }
  };

  // এডিট বাটনে ক্লিক করলে
  const handleEdit = (index: number) => {
    setInputValue(items[index]); // ইনপুটে ভ্যালু সেট
    setEditIndex(index); // এডিট মোডে ঢোকা
  };

  // রিমুভ বাটনে ক্লিক করলে
  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      // যদি এডিট করা আইটেমটাই ডিলিট হয়
      setEditIndex(null);
      setInputValue("");
    }
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
          onClick={handleAddOrUpdate}
          className={`${
            editIndex !== null
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white px-3 py-2 rounded`}
        >
          {editIndex !== null ? "Update" : "Add"}
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
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(i)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleRemove(i)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
