"use client";
import React, { useRef } from "react";

export default function RefExample() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // const handleClick = () => {
  //   if (buttonRef.current) {
  //     // 👉 DOM element access করা যাচ্ছে
  //     alert("Do not change!");
  //     buttonRef.current.style.backgroundColor = "red"; // CSS পরিবর্তন
  //     alert("One change!");
  //     buttonRef.current.innerText = "Clicked!"; // Text পরিবর্তন
  //     alert("Two change!");
  //     buttonRef.current.blur(); // ফোকাস সরানো
  //     alert("Button clicked via ref!");
  //   }
  // };
  const handleClick = () => {
    if (!buttonRef.current) return; // ← null হলে থামবে

    alert("Do not change!");

    setTimeout(() => {
      buttonRef.current!.style.backgroundColor = "red";
    }, 500);

    setTimeout(() => {
      buttonRef.current!.innerText = "Clicked!";
    }, 1000);

    setTimeout(() => {
      buttonRef.current!.blur();
    }, 1500);

    setTimeout(() => {
      alert("All changes done!");
    }, 2000);
  };

  return (
    <div className="space-y-3 p-4">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="bg-blue-500 text-white px-3 py-2 rounded"
      >
        Real Button
      </button>

      <button
        onClick={() => buttonRef.current?.click()}
        className="bg-green-500 text-white px-3 py-2 rounded"
      >
        Trigger Button Click
      </button>
    </div>
  );
}
