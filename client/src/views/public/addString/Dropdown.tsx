import clsx, { ClassValue } from 'clsx';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropdownContextProps {
  open: boolean;
  isMobile: boolean;
  toggle: () => void;
}

const DropdownContext = createContext<DropdownContextProps | null>(null);

const useDropdownContext = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('wrong');
  return ctx;
};

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

export const Dropdown: FC<DropdownProps> = ({ children, className }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, isMobile, toggle }}>
      <div className={cn('', className)}>{children}</div>
    </DropdownContext.Provider>
  );
};
