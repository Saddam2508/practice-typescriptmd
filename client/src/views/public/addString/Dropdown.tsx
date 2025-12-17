import clsx from 'clsx';
import { ClassValue } from 'clsx';
import {
  createContext,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropdownContextProps {
  open: boolean;
  toggle: () => void;
  isMobile: boolean;
}

const DropdownContext = createContext<DropdownContextProps | null>(null);

const useDropdownContext = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Wrong');
  return ctx;
};

interface DropdownProps {
  children: ReactNode;
  className: string;
}

export const Dropdown = ({ children, className }: DropdownProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutSide = (e: globalThis.MouseEvent) => {
      const target = e.target as Node;
      const inside = menuRef.current?.contains(target);
      if (!inside) {
        setOpen(false);
      }
      return;
    };
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

  const handleMouseEnter = () => {
    if (timeRef.current) clearTimeout(timeRef.current);
    setOpen(true);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      const target = e.relatedTarget;
      if (
        !target ||
        !(target instanceof Node) ||
        !menuRef.current?.contains(target)
      ) {
        timeRef.current = setTimeout(() => setOpen(false), 150);
      }
    }
  };

  return (
    <DropdownContext.Provider value={{ open, toggle, isMobile }}>
      <div
        ref={menuRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn('relative inline-block', className)}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

interface DropdownButtonProps {
  children: ReactNode;
  className: string;
}

export const DropdownButton = ({
  children,
  className,
}: DropdownButtonProps) => {
  const context = useDropdownContext();
  if (!context) throw new Error('wrong');
  const { open, toggle } = context;
  return (
    <button onClick={toggle} className={cn('', className)}>
      {children}
    </button>
  );
};

interface DropdownMenuProps {
  children: ReactNode;
  className: string;
}

export const DropdownMenu = ({ children, className }: DropdownMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [alignRight, setAlignRight] = useState(false);
  const context = useDropdownContext();
  if (!context) throw new Error('wrong');
  const { open, isMobile } = context;

  useLayoutEffect(() => {
    if (open && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) setAlignRight(true);
    } else setAlignRight(false);
  }, [open]);

  if (!open) return null;
  return isMobile ? (
    <div className={cn('', className)}>{children}</div>
  ) : (
    <div
      ref={menuRef}
      className={cn('absolute ', alignRight ? 'right-0' : 'left-0', className)}
    >
      {children}
    </div>
  );
};

interface DropdownItemProps {
  href: '#';
  children: ReactNode;
  className: string;
}

export const DropdownItem = ({
  children,
  className,
  href,
}: DropdownItemProps) => {
  const context = useDropdownContext();
  if (!context) throw new Error('wrong');
  const { toggle } = context;
  return (
    <a
      href={href}
      onClick={toggle}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 whitespace-nowrap',
        className
      )}
    >
      {children}
    </a>
  );
};

interface SubmenuItem {
  label: string;
  href?: string;
  items?: SubmenuItem[];
  className: string;
}

interface DropdownSubmenuProps {
  label: ReactNode;
  items: SubmenuItem[];
  children?: ReactNode;
  className: string;
}

export const DropdownSubmenu = ({
  label,
  items,
  children,
  className,
}: DropdownSubmenuProps) => {
  const [open, setOpen] = useState(false);
  const [openToLeft, setOpenToLeft] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<ReturnType<typeof setTimeout>>(null);
  const lockRef = useRef(false);

  const context = useDropdownContext();
  if (!context) throw new Error('wrong');
  const { isMobile } = context;

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeRef.current) clearTimeout(timeRef.current);
      setOpen(true);
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      const target = e.relatedTarget;
      if (
        !target ||
        !(target instanceof Node) ||
        !menuRef.current?.contains(target)
      ) {
        timeRef.current = setTimeout(() => setOpen(false), 150);
      }
    }
  };

  useLayoutEffect(() => {
    if (open && menuRef.current && !lockRef.current && !isMobile) {
      const rect = menuRef.current.getBoundingClientRect();

      // Check overflow right → open to left
      setOpenToLeft(rect.right > window.innerWidth);

      // Adjust vertical
      if (rect.bottom > window.innerHeight) {
        menuRef.current.style.top = 'auto';
        menuRef.current.style.bottom = '0';
      } else {
        menuRef.current.style.top = '0';
        menuRef.current.style.bottom = 'auto';
      }

      lockRef.current = true;
    }
  }, [open, isMobile]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('relative', className)}
    >
      {/* Parent label */}
      <div className="flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100">
        {label}
      </div>
      {/* Submenu (NO animation) */}

      {open && items.length > 0 && (
        <div
          ref={menuRef}
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
                  {item.label}
                </a>
              )
            )}
            {children}
          </ul>
        </div>
      )}
    </div>
  );
};
