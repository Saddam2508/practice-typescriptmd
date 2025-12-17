'use client';

import React, { FC, useEffect, useRef, useState } from 'react';

const CssPractice: FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded-md shadow-sm text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="truncate max-w-[160px]">Account</span>
        <svg
          className={`w-4 h-4 transition-transform duration-150 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      <div
        role="menu"
        aria-hidden={!open}
        className={`absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all duration-150 ${
          open
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="py-1">
          <a
            role="menuitem"
            href="#profile"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Profile
          </a>
          <a
            role="menuitem"
            href="#settings"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Settings
          </a>
          <div className="border-t my-1" />
          <button
            role="menuitem"
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              // add logout logic here
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CssPractice;
