'use client';

import React, { useState } from 'react';

const AdminHeader = () => {
  interface MenuItem {
    label: string;
    items?: MenuItem[];
  }

  const initialState: MenuItem[] = [
    { label: 'Home' },
    {
      label: 'products',
      items: [{ label: 'mobile' }, { label: 'laptop' }],
    },
  ];

  const [menu, setMenu] = useState<MenuItem[]>(initialState);
  const [showConfirm, setShowConfirm] = useState(false);

  const updateMenu = (path: number[], value: string) => {
    const data = structuredClone(menu);
    let current: MenuItem[] = data;
    for (let index = 0; index < path.length - 1; index++) {
      current = current[path[index]].items!;
    }
    current[path[path.length - 1]].label = value;
    setMenu(data);
  };

  const addMenu = (path: number[]) => {
    const data = structuredClone(menu);
    let current: MenuItem[] = data;
    for (let index = 0; index < path.length; index++) {
      const idx = path[index];

      if (!current[idx].items) {
        current[idx].items = [];
      }

      current = current[idx].items!;
    }
    current.push({ label: 'New Item' });
    setMenu(data);
  };

  const removeMenu = (path: number[]) => {
    const data = structuredClone(menu);
    let current: MenuItem[] = data;
    for (let index = 0; index < path.length - 1; index++) {
      current = current[path[index]].items!;
    }
    const removeIndex = path[path.length - 1];
    current.splice(removeIndex, 1);
    setMenu(data);
  };

  const removeAllMenus = () => {
    setMenu([]);
    setShowConfirm(false);
  };

  const renderMenu = (items: MenuItem[], path: number[] = []) => {
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
            style={{ marginLeft: 10 }}
            onChange={(e) => updateMenu(currentPath, e.target.value)}
          />
          <button
            onClick={() => addMenu(currentPath)}
            style={{ marginRight: 5 }}
          >
            +sub
          </button>

          <button onClick={() => removeMenu(currentPath)}>remove</button>
          {item.items && renderMenu(item.items, currentPath)}
        </div>
      );
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => addMenu([])}>+ Add Root Menu</button>
        <button onClick={() => setShowConfirm(true)} style={{ marginLeft: 5 }}>
          Delete All Menus
        </button>
      </div>
      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 20,
              width: 350,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <h3>Delete All Menus?</h3>
            <p>This action cannot be undone.</p>

            <div style={{ marginTop: 15 }}>
              <button
                onClick={removeAllMenus}
                style={{ marginRight: 10, background: 'red', color: '#fff' }}
              >
                Yes, Delete
              </button>

              <button onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {renderMenu(menu)}
    </div>
  );
};

export default AdminHeader;
