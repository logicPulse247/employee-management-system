import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main Layout wrapper component
 * Provides consistent container and spacing across all pages
 * Mobile: Full width with padding
 * Tablet+: Centered container with max-width
 */
const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <main className={`
      min-h-screen bg-gray-50
      ${className}
    `}>
      <div className="
        container mx-auto
        px-4 sm:px-6 lg:px-8
        py-4 sm:py-6 lg:py-8
        max-w-7xl
      ">
        {children}
      </div>
    </main>
  );
};

export default Layout;

