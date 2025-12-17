'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DropdownContextProps {
  open: boolean;
  toggle: () => void;
}

const DropdownContext = createContext<DropdownContextProps | null>(null);

export const useDropdown = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx)
    throw new Error('Dropdown components must be used inside <Dropdown>');
  return ctx;
};

export const Dropdown = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <DropdownContext.Provider value={{ open, toggle }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

export const DropdownButton = ({ children }: { children: ReactNode }) => {
  const { toggle } = useDropdown();

  return (
    <button
      onClick={toggle}
      className="px-3 py-2 bg-blue-500 text-white rounded"
    >
      {children}
    </button>
  );
};

export const DropdownMenu = ({ children }: { children: ReactNode }) => {
  const { open } = useDropdown();

  if (!open) return null;

  return (
    <div className="absolute mt-2 bg-white shadow rounded border p-2">
      {children}
    </div>
  );
};
