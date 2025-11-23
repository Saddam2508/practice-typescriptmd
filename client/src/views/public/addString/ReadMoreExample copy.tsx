"use client";

import React, { FC, useState } from "react";

const ReadMoreExample: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
  reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-100 rounded-md shadow-md">
      <p className="text-gray-700">
        {isExpanded ? text : text.substring(0, 100) + "..."}
      </p>
      <button
        onClick={toggleText}
        className="mt-2 text-blue-500 hover:underline"
      >
        {isExpanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
};

export default ReadMoreExample;
