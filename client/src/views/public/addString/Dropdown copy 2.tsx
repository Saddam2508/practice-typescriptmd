import { createContext, ReactNode, useContext, useState } from 'react';

interface DropdownProps {
  open: boolean;
  toggle: () => void;
}

export const DropdownContext = createContext<DropdownProps | null>(null);

export const useDropdown = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Wrong');
  return ctx;
};

export const Dropdown = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen((prev) => !prev);
  };
  return (
    <DropdownContext.Provider value={{ open, toggle }}>
      <div>{children}</div>
    </DropdownContext.Provider>
  );
};

export const DropdownButton = ({ children }: { children: ReactNode }) => {
  const { toggle } = useDropdown();
  return (
    <button onClick={toggle} className="bg-amber-400 p-2 rounded-md shadow-md">
      {children}
    </button>
  );
};

export const DropdownItems = ({ children }: { children: ReactNode }) => {
  const { open } = useDropdown();
  if (!open) return null;
  return <div className="bg-gray-200 p-2 rounded-md shadow-md">{children}</div>;
};
