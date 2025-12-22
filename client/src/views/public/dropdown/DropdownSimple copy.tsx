import React, { useState } from 'react';

interface MenuItem {
  label: string;
  items?: MenuItem[];
}

interface Props {
  label: string;
  items: MenuItem[];
}

export const DropdownSimple: React.FC<Props> = ({ label, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginLeft: '16px' }}>
      {/* Parent label */}
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer', fontWeight: 'bold' }}
      >
        {label}
      </div>

      {/* Child menu */}
      {open && (
        <ul>
          {items.map((item, idx) =>
            item.items ? (
              // 🔁 RECURSION HERE
              <DropdownSimple key={idx} label={item.label} items={item.items} />
            ) : (
              <li key={idx}>{item.label}</li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default DropdownSimple;
