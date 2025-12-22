'use client';

import React from 'react';
import DropdownSimple from '../dropdown/DropdownSimple';

const CssPractice = () => {
  const data = [
    {
      label: 'Products',
      items: [
        { label: 'Laptop' },
        {
          label: 'Mobile',
          items: [
            { label: 'Android' },
            {
              label: 'iPhone',
              items: [
                {
                  label: 'saddam',
                  items: [{ label: 'asgor' }],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <DropdownSimple label="Menu" items={data} />
    </div>
  );
};

export default CssPractice;
