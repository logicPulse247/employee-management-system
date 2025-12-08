import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  alwaysShow?: boolean; // Force show tooltip even if not truncated
}

/**
 * Tooltip Component
 * Shows tooltip on hover for truncated or long content
 * Works on both desktop (hover) and mobile (long press)
 * Only shows if content is actually truncated (unless alwaysShow is true)
 */
const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '', alwaysShow = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content is truncated
  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [content]);

  useEffect(() => {
    if (isVisible && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if tooltip would overflow bottom of viewport
      if (containerRect.bottom + tooltipRect.height > viewportHeight) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [isVisible]);

  const shouldShowTooltip = alwaysShow || isTruncated;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => shouldShowTooltip && setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onTouchStart={(e) => {
        if (shouldShowTooltip) {
          e.stopPropagation();
          setIsVisible(true);
        }
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        setTimeout(() => setIsVisible(false), 2000);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div ref={contentRef} className="truncate">
        {children}
      </div>
      {isVisible && content && shouldShowTooltip && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50
            px-2 py-1
            bg-gray-900 text-white text-xs
            rounded-md shadow-lg
            whitespace-nowrap
            pointer-events-none
            animate-fade-in
            max-w-xs
            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            left-1/2 transform -translate-x-1/2
          `}
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
          {/* Tooltip arrow */}
          <div
            className={`
              absolute left-1/2 transform -translate-x-1/2
              w-0 h-0
              border-4 border-transparent
              ${position === 'top'
                ? 'top-full border-t-gray-900'
                : 'bottom-full border-b-gray-900'
              }
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
