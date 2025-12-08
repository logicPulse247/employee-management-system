import React, { useState } from 'react';

interface MenuItem {
  label: string;
  path: string;
  submenu?: MenuItem[];
}

interface HorizontalMenuProps {
  items: MenuItem[];
  onNavigate: (path: string) => void;
  activePath?: string;
}

const HorizontalMenu: React.FC<HorizontalMenuProps> = ({ items, onNavigate, activePath: propActivePath }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [internalActivePath, setInternalActivePath] = useState<string>(window.location.pathname);

  // Use prop if provided, otherwise use internal state
  const activePath = propActivePath || internalActivePath;

  const handleItemClick = (item: MenuItem) => {
    if (!item.submenu || item.submenu.length === 0) {
      if (!propActivePath) {
        setInternalActivePath(item.path);
      }
      onNavigate(item.path);
    }
  };

  const handleSubmenuClick = (path: string) => {
    if (!propActivePath) {
      setInternalActivePath(path);
    }
    onNavigate(path);
  };

  return (
    <nav className="bg-gradient-to-r from-primary-500 to-secondary-600 p-0 rounded-lg shadow-lg my-5">
      <ul className="flex list-none m-0 p-0 items-center flex-wrap">
        {items.map((item, index) => (
          <li
            key={index}
            className="relative m-0"
            onMouseEnter={() => item.submenu && setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              className={`flex items-center gap-2 px-6 py-4 text-white text-sm font-medium bg-transparent border-none cursor-pointer transition-all duration-300 whitespace-nowrap hover:bg-white hover:bg-opacity-15 hover:-translate-y-0.5 ${
                activePath === item.path.split('?')[0] ? 'bg-white bg-opacity-20' : ''
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item.label}
              {item.submenu && item.submenu.length > 0 && (
                <span className="text-xs transition-transform duration-300">
                  ▼
                </span>
              )}
            </button>
            {item.submenu && item.submenu.length > 0 && hoveredItem === item.label && (
              <ul className="absolute top-full left-0 list-none p-2 m-0 bg-white shadow-xl rounded-lg min-w-[200px] z-50 animate-fade-in-down">
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex} className="m-0">
                    <button
                      className={`block w-full px-6 py-3 text-gray-800 text-sm bg-transparent border-none cursor-pointer transition-all duration-300 text-left hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-600 hover:text-white hover:pl-8 rounded ${
                        activePath === subItem.path ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white' : ''
                      }`}
                      onClick={() => handleSubmenuClick(subItem.path)}
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HorizontalMenu;
