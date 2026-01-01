'use client';

import React, { useState } from 'react';

interface MenuItem {
  label: string;
  items?: MenuItem[];
}

const AdminHeader = () => {
  const initialState = [
    { label: 'Home' },
    {
      label: 'Products',
      items: [{ label: 'Mobile' }, { label: 'Laptop' }],
    },
  ];
  const [menus, setMenus] = useState<MenuItem[]>(initialState);

  const renderMenus = (items: MenuItem[], path: number[] = []) => {
    return items.map((item, index) => {
      const currentPath = [...path, index];
      return (
        <div key={index}>
          <p>{item.label}</p>
          <input />
          {item.items && renderMenus(item.items, currentPath)}
        </div>
      );
    });
  };
  return <div>{renderMenus(menus)}</div>;
};

export default AdminHeader;
