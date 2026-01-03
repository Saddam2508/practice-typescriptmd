'use client';

import React, { useState } from 'react';

interface MenuItem {
  label: string;
  items?: MenuItem[];
}

const AdminHeader = () => {
  const initialState: MenuItem[] = [
    { label: 'Home' },
    {
      label: 'Products',
      items: [{ label: 'Mobile' }, { label: 'Laptop' }],
    },
  ];

  const [menus, setMenus] = useState<MenuItem[]>(initialState);

  // 🔹 Update label of a menu item
  const updateLabel = (path: number[], value: string) => {
    const data = structuredClone(menus);
    let current: MenuItem[] = data;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].items!;
    }

    current[path[path.length - 1]].label = value;
    setMenus(data);
  };

  // 🔹 Add a sub-menu to a specific menu item
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
            padding: 8,
            marginBottom: 5,
          }}
        >
          <input
            value={item.label}
            onChange={(e) => updateLabel(currentPath, e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={() => addSubMenu(currentPath)}>+ Sub</button>

          {/* Recursive children */}
          {item.items && renderMenus(item.items, currentPath)}
        </div>
      );
    });
  };

  return (
    <div>
      <h2>Admin Header</h2>
      {renderMenus(menus)}
    </div>
  );
};

export default AdminHeader;
