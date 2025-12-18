'use client';

import React, { FC } from 'react';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownSubmenu,
} from './Dropdown';

const menuItems = [
  {
    label: 'Profile',
    href: '/profile',
    className: '',
  },
  {
    label: 'Settings',
    className: '',
    items: [
      {
        label: 'Account',
        href: '/settings/account',
        className: '',
      },
      {
        label: 'Security',
        className: '',
        items: [
          {
            label: 'Change Password',
            href: '/settings/security/password',
            className: '',
          },
          {
            label: '2FA',
            href: '/settings/security/2fa',
            className: '',
          },
          {
            label: '2FA',
            href: '/settings/security/2fa',
            className: '',
          },
          {
            label: '2FA',
            href: '/settings/security/2fa',
            className: '',
          },
          {
            label: '2FA',
            href: '/settings/security/2fa',
            className: '',
          },
          {
            label: '2FA',
            href: '/settings/security/2fa',
            className: '',
          },
          {
            label: '2FA',
            href: '/settings/security/2fa',
            className: '',
          },
          {
            label: '2FA',
            href: '/settings/security/2fa',
            className: '',
          },
          {
            label: '2FA',
            href: '/settings/security/2fa',
            className: '',
          },
          {
            label: '2FA',
            href: '/settings/security/2fa',
            className: '',
          },
        ],
      },
    ],
  },
  {
    label: 'Logout',
    href: '/logout',
    className: 'text-red-500',
  },
];

const CssPractice: FC = () => {
  return (
    <div>
      <Dropdown className="">
        <DropdownButton className="px-4 py-2 bg-blue-500 text-white rounded">
          Menu
        </DropdownButton>

        <DropdownMenu className="mt-2 w-48 bg-white border rounded-md shadow-lg p-1">
          {menuItems.map((item, index) =>
            item.items ? (
              <DropdownSubmenu
                key={index}
                label={item.label}
                items={item.items}
                className=""
              />
            ) : (
              <DropdownItem
                key={index}
                href={item.href as '#'}
                className={item.className}
              >
                {item.label}
              </DropdownItem>
            )
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default CssPractice;
