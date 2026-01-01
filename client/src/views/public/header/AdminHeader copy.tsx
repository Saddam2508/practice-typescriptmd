'use client';
import React, { useState } from 'react';

interface MenuItem {
  label: string;
  items?: MenuItem[];
}

const SimpleAdminHeader = () => {
  const [menus, setMenus] = useState<MenuItem[]>([
    { label: 'Home' },
    {
      label: 'Products',
      items: [{ label: 'Mobile' }, { label: 'Laptop' }],
    },
  ]);

  // 🔹 Update label
  const updateLabel = (path: number[], value: string) => {
    const data = structuredClone(menus);
    let current: MenuItem[] = data;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].items!;
    }

    current[path[path.length - 1]].label = value;
    setMenus(data);
  };

  // 🔹 Add sub menu
  const addSubMenu = (path: number[]) => {
    const data = structuredClone(menus);
    let current: MenuItem[] = data;

    for (let i = 0; i < path.length; i++) {
      current[path[i]].items ||= [];
      current = current[path[i]].items!;
    }

    current.push({ label: 'New Item' });
    setMenus(data);
  };

  // 🔹 Recursive render
  const renderMenus = (items: MenuItem[], path: number[] = []) => {
    return items.map((item, index) => {
      const currentPath = [...path, index];

      return (
        <div
          key={index}
          style={{
            marginLeft: path.length * 20,
            border: '1px solid #ccc',
            padding: 10,
            marginBottom: 5,
          }}
        >
          <input
            value={item.label}
            onChange={(e) => updateLabel(currentPath, e.target.value)}
          />

          <button
            onClick={() => addSubMenu(currentPath)}
            style={{ marginLeft: 10 }}
          >
            + Sub
          </button>

          {item.items && renderMenus(item.items, currentPath)}
        </div>
      );
    });
  };

  return (
    <div>
      <h2>Simple Admin Header</h2>
      {renderMenus(menus)}
    </div>
  );
};

export default SimpleAdminHeader;
