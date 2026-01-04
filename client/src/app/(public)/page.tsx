'use client';

import CssPractice from '@/views/public/addString/CssPractice';
import SimpleAdminHeader from '@/views/public/header/AdminHeader';

import React, { FC } from 'react';

const page: FC = () => {
  return (
    <div className="flex items-center, justify-center">
      {/* <SimpleAdminHeader /> */}
      <CssPractice />
    </div>
  );
};

export default page;
