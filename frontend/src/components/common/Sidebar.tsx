import React, { useState, useEffect, useRef } from 'react';

interface MenuItem {
  label: string;
  path: string;
  submenu?: MenuItem[];
}

interface SidebarProps {
  items: MenuItem[];
  onNavigate: (path: string) => void;
  activePath?: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Responsive Sidebar component
 * Mobile/Tablet: Overlay sidebar that slides in from left
 * Desktop (lg+): Persistent sidebar (if needed in future)
 */
const Sidebar: React.FC<SidebarProps> = ({
  items,
  onNavigate,
  activePath: propActivePath,
  isOpen,
  onClose,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Get current path for active state
  const currentPath = propActivePath || window.location.pathname;

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Close on Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu && item.submenu.length > 0) {
      setOpenSubmenu(openSubmenu === item.label ? null : item.label);
    } else {
      onNavigate(item.path);
      onClose();
      setOpenSubmenu(null);
    }
  };

  const handleSubmenuClick = (path: string) => {
    onNavigate(path);
    onClose();
    setOpenSubmenu(null);
  };

  return (
    <>
      {/* Backdrop - Mobile/Tablet only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen w-64 sm:w-72
          bg-gradient-to-br from-primary-500 to-secondary-600
          shadow-2xl z-50 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main navigation"
      >
        {/* Close Button */}
        <div className="flex justify-end p-3 sm:p-4">
          <button
            onClick={onClose}
            className="
              w-8 h-8 sm:w-10 sm:h-10
              flex items-center justify-center
              bg-white bg-opacity-20 hover:bg-opacity-30
              text-white rounded-full
              transition-all duration-200 hover:rotate-90
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500
            "
            aria-label="Close menu"
          >
            <span className="text-xl sm:text-2xl font-bold">×</span>
          </button>
        </div>

        <ul className="list-none p-0 pt-2 sm:pt-4">
          {items.map((item, index) => (
            <li key={index} className="m-0">
              <button
                className={`
                  w-full flex items-center justify-between
                  px-4 sm:px-6 py-3 sm:py-4
                  text-white text-sm sm:text-base font-medium
                  bg-transparent border-none cursor-pointer
                  transition-all duration-300 text-left
                  hover:bg-white hover:bg-opacity-10 hover:pl-6 sm:hover:pl-8
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset
                  ${!item.submenu && currentPath === item.path ? 'bg-white bg-opacity-15' : ''}
                `}
                onClick={() => handleItemClick(item)}
                aria-expanded={item.submenu && openSubmenu === item.label}
              >
                <span>{item.label}</span>
                {item.submenu && item.submenu.length > 0 && (
                  <span className="text-xs transition-transform duration-300" aria-hidden="true">
                    {openSubmenu === item.label ? '▼' : '▶'}
                  </span>
                )}
              </button>
              {item.submenu && item.submenu.length > 0 && openSubmenu === item.label && (
                <ul
                  className="list-none p-0 m-0 bg-black bg-opacity-20 animate-slide-down"
                  role="menu"
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex} className="m-0">
                      <button
                        className={`
                          block w-full px-6 sm:px-8 py-2 sm:py-3
                          text-white text-opacity-90 text-xs sm:text-sm
                          bg-transparent border-none cursor-pointer
                          transition-all duration-300 text-left
                          hover:bg-white hover:bg-opacity-15 hover:pl-10 sm:hover:pl-12 hover:text-white
                          focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset
                          ${
                            currentPath === subItem.path
                              ? 'bg-white bg-opacity-20 text-white font-semibold'
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
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
