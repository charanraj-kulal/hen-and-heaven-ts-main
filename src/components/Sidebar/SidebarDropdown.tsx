import React from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  route: string;
  children?: MenuItem[];
}

interface SidebarDropdownProps {
  item: MenuItem[];
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ item }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
      {item.map((menuItem, key) => (
        <li key={key}>
          <Link
            to={menuItem.route}
            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
              pathname === menuItem.route && "text-white"
            }`}
          >
            {menuItem.icon}
            {menuItem.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarDropdown;
