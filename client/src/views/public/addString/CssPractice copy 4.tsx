'use client';

import React, { FC, useState } from 'react';

const CssPractice: FC = () => {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  return (
    <div>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-amber-400 rounded-md shadow-md"
        >
          Menu
        </button>
        {open && (
          <div className="absolute flex flex-col">
            <div className="relative">
              <button
                onClick={() => setOpenSub(!openSub)}
                className="bg-amber-50"
              >
                Saddam
              </button>
              {openSub && (
                <div className="bg-gray-300 top-0 left-full right-0 absolute">
                  <button>Saddam</button>
                  <button>Saddam</button>
                  <button>Saddam</button>
                </div>
              )}
            </div>
            <button className="bg-amber-50">saddam</button>
            <button className="bg-amber-50">saddam</button>
            <button className="bg-amber-50">saddam</button>
            <button className="bg-amber-50">saddam</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CssPractice;
