import React from 'react';
import Recursive from './Recursive';

const CssPractice = () => {
  const data = [
    { n: 1, children: [{ n: 2 }, { n: 3, children: [{ n: 4 }] }] },
    { n: 5 },
  ];

  return (
    <div>
      <h2>Recursive Map Example</h2>
      {data.map((b, i) =>
        b.children && b.children.length > 0 ? (
          <Recursive key={i} items={b.children} />
        ) : (
          <div key={i}></div>
        )
      )}
    </div>
  );
};

export default CssPractice;
