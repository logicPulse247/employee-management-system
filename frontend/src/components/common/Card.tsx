import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

/**
 * Reusable Card component with responsive design
 * Mobile: Full width with padding
 * Tablet+: Responsive with hover effects
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl sm:rounded-2xl
        shadow-md sm:shadow-lg
        p-4 sm:p-6
        transition-all duration-300 ease-in-out
        ${hover ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

