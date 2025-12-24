import { FC } from 'react';

interface MenuItem {
  label: string;
  items: [];
}

interface Props {
  label: string;
  items: MenuItem[];
}

const DropdownSubmenu: FC<Props> = ({ label, items }) => {
  return (
    <div>
      <div>{label}</div>
      <ul>
        {items.map((item, i) =>
          item.items ? (
            <DropdownSubmenu key={i} label={item.label} items={item.items} />
          ) : (
            <li key={i}>{item.label}</li>
          )
        )}
      </ul>
    </div>
  );
};
