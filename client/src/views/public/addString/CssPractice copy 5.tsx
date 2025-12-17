'use client';

import React, { FC, useState, useRef, useEffect } from 'react';

const CssPractice: FC = () => {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);

  // ---- CLICK OUTSIDE CLOSE ----
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setOpenSub(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="p-10">
      <div className="relative inline-block" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="bg-amber-500 text-white px-4 py-2 rounded-md shadow-md"
        >
          Menu
        </button>

        {open && (
          <div className="absolute mt-2 bg-white shadow-lg rounded-md flex flex-col min-w-[150px] border">
            {/* Sub menu parent */}
            <div className="relative" ref={subRef}>
              <button
                onClick={() => setOpenSub(!openSub)}
                className="px-4 py-2 text-left hover:bg-gray-200 w-full"
              >
                Saddam →
              </button>

              {/* Submenu */}
              {openSub && (
                <div className="absolute top-0 left-full bg-gray-100 shadow-md rounded-md border flex flex-col">
                  <button className="px-4 py-2 hover:bg-gray-300">
                    Item A
                  </button>
                  <button className="px-4 py-2 hover:bg-gray-300">
                    Item B
                  </button>
                  <button className="px-4 py-2 hover:bg-gray-300">
                    Item C
                  </button>
                </div>
              )}
            </div>

            {/* Other Menu Items */}
            <button className="px-4 py-2 hover:bg-gray-200 text-left">
              Item 1
            </button>
            <button className="px-4 py-2 hover:bg-gray-200 text-left">
              Item 2
            </button>
            <button className="px-4 py-2 hover:bg-gray-200 text-left">
              Item 3
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CssPractice;
