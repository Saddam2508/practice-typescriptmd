import React from 'react';

interface Item {
  n: number;
  children?: Item[];
}

interface RecursiveProps {
  items: Item[];
}

const Recursive: React.FC<RecursiveProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <ul>
      {items.map((item, idx) => (
        <li key={idx}>
          Number: {item.n}
          {/* Recursive call */}
          {item.children && <Recursive items={item.children} />}
        </li>
      ))}
    </ul>
  );
};

export default Recursive;
