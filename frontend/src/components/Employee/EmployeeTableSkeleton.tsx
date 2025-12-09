import React from 'react';

export const EmployeeTableSkeleton: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto my-5 bg-white rounded-xl shadow-lg">
      <div className="min-w-full inline-block">
        {/* Header */}
        <div className="grid grid-cols-10 gap-4 p-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold text-xs uppercase tracking-wider">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="px-2 h-4 bg-white bg-opacity-20 rounded animate-pulse"></div>
          ))}
        </div>

        {/* Rows */}
        {[...Array(6)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-10 gap-4 p-4 border-b border-gray-200">
            {[...Array(10)].map((_, colIndex) => (
              <div key={colIndex} className="px-2 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTableSkeleton;
