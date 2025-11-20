"use client";

import React, { useRef } from "react";

export const DomRefDemo = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeStyle = () => {
    buttonRef.current!.style.backgroundColor = "crimson";
    buttonRef.current!.style.color = "white";
    buttonRef.current!.innerText = "Color Changed!";
  };

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    inputRef.current?.blur();
  };

  const handleClickByRef = () => {
    buttonRef.current?.click();
  };
  const handleCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (e.type === "copy") {
      alert("copy");
    }
  };

  const handleScrollIntoView = () => {
    buttonRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetBounding = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    alert(
      `Button position:\nTop: ${rect?.top}\nLeft: ${rect?.left}\nWidth: ${rect?.width}\nHeight: ${rect?.height}`
    );
  };

  const handleSetAttribute = () => {
    buttonRef.current?.setAttribute("data-info", "demo-button");
    alert("Custom attribute added: data-info='demo-button'");
  };

  const handleRemove = () => {
    buttonRef.current?.remove();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
      <h2 className="text-xl font-semibold mb-4">🎯 DOM Ref Demo</h2>

      <input
        ref={inputRef}
        type="text"
        onCopy={handleCopy}
        placeholder="Focus me!"
        className="border p-2 rounded-md"
      />

      <button
        ref={buttonRef}
        onClick={() => alert("Real button clicked!")}
        className="px-6 py-2 bg-blue-600 text-white rounded-md shadow"
      >
        Demo Button
      </button>
      <div className="grid grid-cols-2 gap-2 w-80 mt-4">
        <button onClick={handleChangeStyle} className="bg-gray-200 p-2 rounded">
          🎨 Change Style
        </button>
        <button onClick={handleFocus} className="bg-gray-200 p-2 rounded">
          ✍️ Focus Input
        </button>
        <button onClick={handleBlur} className="bg-gray-200 p-2 rounded">
          👀 Blur Input
        </button>
        <button onClick={handleClickByRef} className="bg-gray-200 p-2 rounded">
          🖱️ Trigger Button Click
        </button>
        <button
          onClick={handleScrollIntoView}
          className="bg-gray-200 p-2 rounded"
        >
          📜 Scroll Into View
        </button>
        <button onClick={handleGetBounding} className="bg-gray-200 p-2 rounded">
          📏 Get Position
        </button>
        <button
          onClick={handleSetAttribute}
          className="bg-gray-200 p-2 rounded"
        >
          ⚙️ Set Attribute
        </button>
        <button onClick={handleRemove} className="bg-red-200 p-2 rounded">
          ❌ Remove Button
        </button>
      </div>
    </div>
  );
};
