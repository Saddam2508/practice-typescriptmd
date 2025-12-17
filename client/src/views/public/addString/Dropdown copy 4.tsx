'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  createContext,
  useLayoutEffect,
  ReactNode,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* Utility: clsx + twMerge */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* =================== Context =================== */
interface DropdownContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

const DropdownContext = createContext<DropdownContextProps | undefined>(
  undefined
);

/* =================== Dropdown Wrapper =================== */
interface DropdownProps {
  children: ReactNode;
  className?: string;
}

export function Dropdown({ children, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Desktop hover open/close
  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setOpen(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      const target = e.relatedTarget;

      if (
        !target ||
        !(target instanceof Node) ||
        !menuRef.current?.contains(target)
      ) {
        timeoutRef.current = setTimeout(() => setOpen(false), 150);
      }
    }
  };

  return (
    <DropdownContext.Provider value={{ open, setOpen, isMobile }}>
      <div
        ref={menuRef}
        className={cn('relative inline-block', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}{' '}
      </div>
    </DropdownContext.Provider>
  );
}

/* =================== Dropdown Button =================== */
interface DropdownButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DropdownButton({
  children,
  className,
  onClick,
}: DropdownButtonProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownButton must be used inside Dropdown');

  const { open, setOpen, isMobile } = context;

  const handleClick = () => {
    if (isMobile) setOpen(!open);

    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100',
        className
      )}
      aria-expanded={open}
    >
      {children}
    </button>
  );
}

/* =================== Dropdown Menu =================== */
interface DropdownMenuProps {
  children: ReactNode;
  className?: string;
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenu must be used inside Dropdown');

  const { open, isMobile } = context;
  const menuRef = useRef<HTMLDivElement>(null);
  const [alignRight, setAlignRight] = useState(false);

  useLayoutEffect(() => {
    if (open && menuRef.current) {
      setAlignRight(false);
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) setAlignRight(true);
    } else setAlignRight(false);
  }, [open]);

  if (!open) return null;

  return isMobile ? (
    <div
      className={cn(
        'fixed top-12 left-0 w-full bg-white shadow-lg border-t p-4 z-50 animate-slide-down',
        className
      )}
    >
      {children}
    </div>
  ) : (
    <div
      ref={menuRef}
      className={cn(
        'absolute mt-2 bg-white border shadow-lg rounded-md p-1 z-50 w-max min-w-[12rem]',
        alignRight ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  );
}

/* =================== Dropdown Item =================== */
interface DropdownItemProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DropdownItem({
  href = '#',
  children,
  className,
  onClick,
}: DropdownItemProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 whitespace-nowrap',
        className
      )}
    >
      {children}
    </a>
  );
}

/* =================== Dropdown Submenu =================== */
interface SubmenuItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: SubmenuItem[];
  className?: string;
}

interface DropdownSubmenuProps {
  label: React.ReactNode;
  items?: SubmenuItem[];
  children?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function DropdownSubmenu({
  label,
  items = [],
  children,
  icon: Icon,
  className,
}: DropdownSubmenuProps) {
  const [open, setOpen] = useState(false);
  const [openToLeft, setOpenToLeft] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);

  const context = useContext(DropdownContext);
  if (!context) throw new Error('DropdownSubmenu must be used inside Dropdown');
  const { isMobile } = context;

  const handleMouseEnter = () => setOpen(true);

  const handleMouseLeave = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      const nextEl = e.relatedTarget as Node | null;
      if (!nextEl || !submenuRef.current?.contains(nextEl)) {
        setOpen(false);
        setOpenToLeft(false);
        lockRef.current = false;
      }
    }
  };

  useLayoutEffect(() => {
    if (open && submenuRef.current && !lockRef.current && !isMobile) {
      const rect = submenuRef.current.getBoundingClientRect();

      // Check overflow right → open to left
      setOpenToLeft(rect.right > window.innerWidth);

      // Adjust vertical
      if (rect.bottom > window.innerHeight) {
        submenuRef.current.style.top = 'auto';
        submenuRef.current.style.bottom = '0';
      } else {
        submenuRef.current.style.top = '0';
        submenuRef.current.style.bottom = 'auto';
      }

      lockRef.current = true;
    }
  }, [open, isMobile]);

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={(e) => {
        const nextEl = e.relatedTarget as Node | null;
        if (!nextEl || !e.currentTarget.contains(nextEl)) handleMouseLeave(e);
      }}
    >
      {/* Parent label */}
      <div className="flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </div>
      </div>

      {/* Submenu (NO animation) */}
      {open && items.length > 0 && (
        <div
          ref={submenuRef}
          className={cn(
            isMobile
              ? 'fixed top-0 left-0 w-full h-full overflow-auto bg-white z-50 p-4'
              : `absolute top-0 bg-white border rounded-md shadow-lg min-w-[180px] z-50 ${
                  openToLeft ? 'right-full mr-1' : 'left-full ml-1'
                }`
          )}
        >
          <ul className="py-2">
            {items.map((item, idx) =>
              item.items ? (
                <DropdownSubmenu
                  key={idx}
                  label={item.label}
                  items={item.items}
                  icon={item.icon}
                  className={item.className}
                />
              ) : (
                <a
                  key={idx}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 whitespace-nowrap',
                    item.className
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </div>
                </a>
              )
            )}
            {children}
          </ul>
        </div>
      )}
    </div>
  );
}

/* =================== Default Export =================== */
const DropdownComponents = {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownSubmenu,
};

export default DropdownComponents;
