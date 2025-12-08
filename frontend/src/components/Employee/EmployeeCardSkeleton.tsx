import React from 'react';

export const EmployeeCardSkeleton: React.FC = () => {
  return (
    <div className="w-full py-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden animate-pulse"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>

            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>

            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>

              <div className="space-y-2 mt-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>

              <div className="mt-4">
                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeCardSkeleton;
