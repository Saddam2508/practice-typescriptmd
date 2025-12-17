'use client';

import React, { FC, useState } from 'react';

const CssPractice: FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setOpen(!open)}
      onMouseLeave={() => setOpen(false)}
      className="relative inline-block  bg-amber-500 p-2 rounded-md shadow-md"
    >
      Menu
      {open && (
        <div className="absolute left-full top-0 mt-2 items-center">
          <button className="bg-gray-500 p-1 rounded-md shadow-md">
            saddam
          </button>
        </div>
      )}
    </div>
  );
};

export default CssPractice;
