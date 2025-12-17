'use client';

import React, { useState } from 'react';

const CssPractice = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-amber-500 rounded-md p-2"
      >
        Menu
      </button>

      {/* Main dropdown */}
      {open && (
        <div className="absolute mt-1 bg-white border rounded-md shadow-lg">
          {/* SUBMENU WRAPPER (Hover area expanded) */}
          <div className="relative group">
            {/* Main item with submenu */}
            <button className="block w-full text-left bg-white p-2 hover:bg-gray-100">
              saddam →
            </button>

            {/* Submenu (Shows when parent wrapper is hovered) */}
            <div
              className="
                absolute left-full top-0 
                bg-white border rounded-md shadow-lg 
                hidden group-hover:block
              "
            >
              <button className="block p-2 hover:bg-gray-100">
                Sub Menu 1
              </button>
              <button className="block p-2 hover:bg-gray-100">
                Sub Menu 2
              </button>
            </div>
          </div>

          {/* Other menu items */}
          <button className="block p-2 w-full text-left hover:bg-gray-100">
            saddam
          </button>
          <button className="block p-2 w-full text-left hover:bg-gray-100">
            saddam
          </button>
        </div>
      )}
    </div>
  );
};

export default CssPractice;
