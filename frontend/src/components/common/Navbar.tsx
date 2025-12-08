import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface MenuItem {
  label: string;
  path: string;
  submenu?: MenuItem[];
}

interface NavbarProps {
  title: string;
  menuItems: MenuItem[];
  onNavigate: (path: string) => void;
  activePath?: string;
  rightContent?: React.ReactNode;
}

/**
 * Responsive Navbar component
 * Mobile: Hamburger menu + title + actions
 * Tablet+: Full horizontal menu
 */
const Navbar: React.FC<NavbarProps> = ({
  title,
  menuItems,
  onNavigate,
  activePath,
  rightContent
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-30">
        {/* Top bar with hamburger, title, and actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 gap-3 sm:gap-5">
          {/* Hamburger Menu Button - Mobile/Tablet */}
          <button
            className="
              lg:hidden
              flex flex-col justify-around
              w-8 h-8 bg-transparent border-none cursor-pointer p-0 z-50
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            "
            onClick={toggleSidebar}
            aria-label="Toggle menu"
            aria-expanded={sidebarOpen}
          >
            <span
              className={`
                w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-600
                rounded-lg transition-all duration-300 origin-center
                ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}
              `}
            />
            <span
              className={`
                w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-600
                rounded-lg transition-all duration-300
                ${sidebarOpen ? 'opacity-0 translate-x-5' : ''}
              `}
            />
            <span
              className={`
                w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-600
                rounded-lg transition-all duration-300 origin-center
                ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}
              `}
            />
          </button>

          {/* Title */}
          <h1 className="
            text-xl sm:text-2xl lg:text-3xl
            font-bold
            bg-gradient-to-r from-primary-500 to-secondary-600
            bg-clip-text text-transparent
            flex-1 text-center sm:text-left
          ">
            {title}
          </h1>

          {/* Right content (e.g., logout button) */}
          <div className="flex gap-2 sm:gap-3 items-center">
            {rightContent}
          </div>
        </div>

        {/* Horizontal Menu - Desktop only (lg+) - Full width background */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-600 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <HorizontalMenu
              items={menuItems}
              onNavigate={onNavigate}
              activePath={activePath}
            />
          </div>
        </div>
      </header>

      {/* Sidebar for Mobile/Tablet */}
      <Sidebar
        items={menuItems}
        onNavigate={onNavigate}
        activePath={activePath}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
    </>
  );
};

/**
 * Horizontal Menu Component for Desktop
 */
const HorizontalMenu: React.FC<{
  items: MenuItem[];
  onNavigate: (path: string) => void;
  activePath?: string;
}> = ({ items, onNavigate, activePath }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const currentPath = activePath || window.location.pathname;

  const handleItemClick = (item: MenuItem) => {
    if (!item.submenu || item.submenu.length === 0) {
      onNavigate(item.path);
    }
  };

  const handleSubmenuClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <nav className="hidden lg:block">
      <ul className="flex list-none m-0 p-0 items-center flex-wrap">
        {items.map((item, index) => {
          const isActive = currentPath === item.path.split('?')[0];

          return (
            <li
              key={index}
              className="relative m-0"
              onMouseEnter={() => item.submenu && setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                className={`
                  flex items-center gap-2
                  px-4 sm:px-6 py-3 sm:py-4
                  text-white text-sm sm:text-base font-medium
                  bg-transparent border-none cursor-pointer
                  transition-all duration-300 whitespace-nowrap
                  hover:bg-white hover:bg-opacity-15 hover:-translate-y-0.5
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset
                  ${isActive ? 'bg-white bg-opacity-20' : ''}
                `}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
                {item.submenu && item.submenu.length > 0 && (
                  <span
                    className="text-xs transition-transform duration-300"
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                )}
              </button>
              {item.submenu && item.submenu.length > 0 && hoveredItem === item.label && (
                <ul
                  className="
                    absolute top-full left-0
                    list-none p-2 m-0
                    bg-white shadow-xl rounded-lg
                    min-w-[200px] z-50
                    animate-fade-in-down
                  "
                  role="menu"
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex} className="m-0">
                      <button
                        className={`
                          block w-full px-6 py-3
                          text-gray-800 text-sm
                          bg-transparent border-none cursor-pointer
                          transition-all duration-300 text-left
                          hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-600
                          hover:text-white hover:pl-8 rounded
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset
                          ${
                            currentPath === subItem.path
                              ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white'
                              : ''
                          }
                        `}
                        onClick={() => handleSubmenuClick(subItem.path)}
                        role="menuitem"
                      >
                        {subItem.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;

