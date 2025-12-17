'use client';

import React, { FC, useEffect, useRef, useState } from 'react';

const CssPractice: FC = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current) {
        const inSide = menuRef.current.contains(target);
        if (!inSide) {
          setOpen(false);
        }
        return;
      }
    };
    document.addEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-amber-300 p-2 rounded-md shadow-md"
      >
        {' '}
        {open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <div>
          <button>saddam</button>
        </div>
      )}
    </div>
  );
};

export default CssPractice;
