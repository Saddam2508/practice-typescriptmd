import React from 'react';

interface MenuItem {
  label: string;
  items?: MenuItem[];
}

interface Props {
  label: string;
  items: MenuItem[];
}

const DropdownSimple: React.FC<Props> = ({ label, items }) => {
  return (
    <div style={{ marginLeft: '16px' }}>
      {/* Parent */}
      <div style={{ fontWeight: 'bold' }}>{label}</div>

      {/* Children (always visible) */}
      <ul>
        {items.map((item, idx) =>
          item.items ? (
            // 🔁 recursion
            <DropdownSimple key={idx} label={item.label} items={item.items} />
          ) : (
            <li key={idx}>{item.label}</li>
          )
        )}
      </ul>
    </div>
  );
};

export default DropdownSimple;
