import React from 'react';
import { Employee } from '../../types';

interface EmployeeTileViewProps {
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
  onActionClick?: (action: string, employee: Employee) => void;
  isAdmin?: boolean;
}

/**
 * EmployeeTileView Component
 * Responsive grid layout:
 * Mobile: 1 column
 * Tablet (sm): 2 columns
 * Desktop (lg): 3 columns
 * Large Desktop (xl): 4 columns
 */
const EmployeeTileView: React.FC<EmployeeTileViewProps> = ({
  employees,
  onEmployeeClick,
  onActionClick,
  isAdmin = false
}) => {
  return (
    <div className="w-full py-4 sm:py-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="
              bg-white rounded-xl sm:rounded-2xl
              p-4 sm:p-5 lg:p-6
              shadow-md sm:shadow-lg
              cursor-pointer
              transition-all duration-300 ease-in-out
              hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1
              relative overflow-hidden group
              focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2
            "
            onClick={() => onEmployeeClick(employee)}
          >
            {/* Hover indicator bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            {/* Header with avatar and menu */}
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-bold shadow-lg">
                {employee.name.charAt(0).toUpperCase()}
              </div>
              {/* Action menu button - Only show for admins */}
              {isAdmin && onActionClick && (
                <div className="flex gap-2">
                  <button
                    className="
                      px-2.5 py-1.5
                      text-xs font-semibold
                      bg-gradient-to-r from-blue-500 to-blue-600
                      hover:from-blue-600 hover:to-blue-700
                      text-white
                      rounded-lg
                      transition-all duration-200
                      flex items-center gap-1
                      shadow-md hover:shadow-lg
                      transform hover:scale-105
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                    "
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick('edit', employee);
                    }}
                    aria-label="Edit employee"
                    title="Edit"
                  >
                    <span className="text-sm">✏️</span>
                    <span className="hidden sm:inline text-xs">Edit</span>
                  </button>
                  <button
                    className="
                      px-2.5 py-1.5
                      text-xs font-semibold
                      bg-gradient-to-r from-red-500 to-red-600
                      hover:from-red-600 hover:to-red-700
                      text-white
                      rounded-lg
                      transition-all duration-200
                      flex items-center gap-1
                      shadow-md hover:shadow-lg
                      transform hover:scale-105
                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
                    "
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick('delete', employee);
                    }}
                    aria-label="Delete employee"
                    title="Delete"
                  >
                    <span className="text-sm">🗑️</span>
                    <span className="hidden sm:inline text-xs">Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Employee Info */}
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 truncate">
                {employee.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 truncate">
                {employee.email}
              </p>

              {/* Details - Responsive spacing */}
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 font-medium">Age:</span>
                  <span className="text-gray-900 font-semibold">{employee.age}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 font-medium">Class:</span>
                  <span className="text-gray-900 font-semibold truncate ml-2">{employee.class}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 font-medium">Attendance:</span>
                  <span
                    className={`font-semibold ${
                      employee.attendance >= 80
                        ? 'text-green-600'
                        : employee.attendance >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {employee.attendance}%
                  </span>
                </div>
              </div>

              {/* Department Badge - Responsive */}
              {employee.department && (
                <div className="mt-3 sm:mt-4">
                  <span className="inline-block px-2 sm:px-3 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full text-xs font-semibold">
                    {employee.department}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTileView;
