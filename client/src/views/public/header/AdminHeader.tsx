import React, { useState } from 'react';

const AdminHeader = () => {
  interface MenuItem {
    label: string;
    items?: MenuItem[];
  }

  const initialState: MenuItem[] = [{ label: 'Home' }];

  const [menu, setMenu] = useState<MenuItem[]>(initialState);

  const update = (path: number[], value: string) => {
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
    current.push({ label: 'new item' });
    setMenu(data);
  };

  const removeMenu = (path: number[]) => {
    const data = structuredClone(menu);
    let current: MenuItem[] = data;
    for (let index = 0; index < path.length - 1; index++) {
      const idx = path[index];
      if (!current[idx].items) {
        return;
      }
      current = current[idx].items!;
    }
    const removeIdx = path[path.length - 1];
    current.splice(removeIdx, 1);
    setMenu(data);
  };

  const renderMenu = (items: MenuItem[], path: number[] = []) => {
    return items.map((item, i) => {
      const currentPath = [...path, i];
      return (
        <div
          key={i}
          style={{
            marginLeft: path.length * 20,
            border: '1px solid #ccc',
            padding: 8,
            marginBottom: 5,
          }}
        >
          <input
            value={item.label}
            onChange={(e) => {
              update(currentPath, e.target.value);
            }}
          />
          <button
            style={{ marginRight: 10 }}
            onClick={() => addMenu(currentPath)}
          >
            +sub
          </button>
          <button onClick={() => removeMenu(currentPath)}>remove</button>
          {item.items && renderMenu(item.items, currentPath)}
        </div>
      );
    });
  };

  return <div>{renderMenu(menu)}</div>;
};

export default AdminHeader;
