"use client";

import React, { ChangeEvent, FC, useState, MouseEvent } from "react";

export const AddString: FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // 🔹 ইনপুট পরিবর্তন হ্যান্ডলার
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 🔹 সিলেক্ট পরিবর্তন হ্যান্ডলার
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  // 🔹 Add / Update
  const handleAddAndUpdate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "" || selectedOption === "") return;

    const combinedValue = `${inputValue} (${selectedOption})`;

    if (editIndex !== null) {
      const updateValues = [...items];
      updateValues[editIndex] = combinedValue;
      setItems(updateValues);
      setEditIndex(null);
    } else {
      setItems((prev) => [...prev, combinedValue]);
    }

    setInputValue("");
    setSelectedOption("");
  };

  // 🔹 Remove
  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Edit
  const handleEdit = (index: number) => {
    const [name, category] = items[index].split(" (");
    setInputValue(name);
    setSelectedOption(category?.replace(")", "") || "");
    setEditIndex(index);
  };

  // 🔹 Submit (FormData তৈরি)
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Please add at least one item before submitting!");
      return;
    }

    const formData = new FormData();

    // প্রতিটি item কে আলাদা করে append করা
    items.forEach((item, index) => {
      const [name, category] = item.split(" (");
      formData.append(`items[${index}][name]`, name);
      formData.append(
        `items[${index}][category]`,
        category?.replace(")", "") || ""
      );
    });

    // ✅ এখন formData সার্ভারে পাঠাতে পারো axios দিয়ে
    // axios.post("/api/save", formData);

    // 🔍 Demo আউটপুট console-এ দেখা যাবে
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    alert("FormData ready to send!");
  };

  return (
    <div className="p-4">
      <div className="flex gap-2">
        {/* ইনপুট */}
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Type something"
          className="border p-2 rounded"
        />

        {/* সিলেক্ট */}
        <select
          value={selectedOption}
          onChange={handleSelectChange}
          className="border p-2 rounded"
        >
          <option value="">Select category</option>
          <option value="Fruit">Fruit</option>
          <option value="Vegetable">Vegetable</option>
          <option value="Other">Other</option>
        </select>

        {/* Add / Update বাটন */}
        <button
          onClick={handleAddAndUpdate}
          className={`${
            editIndex !== null ? "bg-green-500" : "bg-blue-500"
          } text-white px-4 py-2 rounded`}
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* লিস্ট */}
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{item}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(i)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleRemove(i)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Submit বাটন */}
      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
      >
        Submit All
      </button>
    </div>
  );
};
