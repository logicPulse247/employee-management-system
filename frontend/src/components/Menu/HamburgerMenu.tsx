import React, { useState, useEffect, useRef } from 'react';

interface MenuItem {
  label: string;
  path: string;
  submenu?: MenuItem[];
}

interface HamburgerMenuProps {
  items: MenuItem[];
  onNavigate: (path: string) => void;
  activePath?: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  items,
  onNavigate,
  activePath: propActivePath,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Get current path for active state
  const currentPath = propActivePath || window.location.pathname;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setOpenSubmenu(null);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSubmenu(null);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    // Close on Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu && item.submenu.length > 0) {
      setOpenSubmenu(openSubmenu === item.label ? null : item.label);
    } else {
      onNavigate(item.path);
      setIsOpen(false);
      setOpenSubmenu(null);
    }
  };

  const handleSubmenuClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
    setOpenSubmenu(null);
  };

  return (
    <div className="relative z-50">
      <button
        className={`flex flex-col justify-around w-8 h-8 bg-transparent border-none cursor-pointer p-0 z-50 transition-all ${
          isOpen ? 'active' : ''
        }`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span
          className={`w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-lg transition-all duration-300 origin-center ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        ></span>
        <span
          className={`w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-lg transition-all duration-300 ${
            isOpen ? 'opacity-0 translate-x-5' : ''
          }`}
        ></span>
        <span
          className={`w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-lg transition-all duration-300 origin-center ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        ></span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={closeMenu} />

          {/* Sidebar */}
          <nav
            ref={sidebarRef}
            className="fixed top-0 left-0 h-screen w-72 bg-gradient-to-br from-primary-500 to-secondary-600 shadow-2xl transform transition-transform duration-300 z-40 overflow-y-auto"
          >
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMenu}
                className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all duration-200 hover:rotate-90"
                aria-label="Close menu"
              >
                <span className="text-2xl font-bold">×</span>
              </button>
            </div>

            <ul className="list-none p-0 pt-4">
              {items.map((item, index) => (
                <li key={index} className="m-0">
                  <button
                    className={`w-full flex items-center justify-between px-6 py-4 text-white text-base font-medium bg-transparent border-none cursor-pointer transition-all duration-300 text-left hover:bg-white hover:bg-opacity-10 hover:pl-8 ${
                      item.submenu ? 'has-submenu' : ''
                    } ${
                      !item.submenu && currentPath === item.path ? 'bg-white bg-opacity-15' : ''
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.label}
                    {item.submenu && item.submenu.length > 0 && (
                      <span className="text-xs transition-transform duration-300">
                        {openSubmenu === item.label ? '▼' : '▶'}
                      </span>
                    )}
                  </button>
                  {item.submenu && item.submenu.length > 0 && openSubmenu === item.label && (
                    <ul className="list-none p-0 m-0 bg-black bg-opacity-20 animate-slide-down">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex} className="m-0">
                          <button
                            className={`block w-full px-6 py-3 text-white text-opacity-90 text-sm bg-transparent border-none cursor-pointer transition-all duration-300 text-left hover:bg-white hover:bg-opacity-15 hover:pl-10 hover:text-white ${
                              currentPath === subItem.path
                                ? 'bg-white bg-opacity-20 text-white font-semibold'
                                : ''
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
        </>
      )}
    </div>
  );
};

export default HamburgerMenu;
