'use client';

import React, { FC, useState, useRef, useEffect } from 'react';

const CssPractice: FC = () => {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (menuRef.current) {
        const isInside = menuRef.current.contains(target);

        console.log('Clicked on:', e.target);
        console.log('Inside menu?:', isInside);

        if (!isInside) {
          console.log('👉 OUTSIDE CLICK — menu closing...');
          setOpen(false);
          setOpenSub(false);
        } else {
          console.log('🟢 INSIDE CLICK — menu stays open');
        }
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
            <button className="px-4 py-2 hover:bg-gray-200 text-left">
              Item 1
            </button>
            <button className="px-4 py-2 hover:bg-gray-200 text-left">
              Item 2
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CssPractice;
