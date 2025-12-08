import React from 'react';
import { Employee } from '../../types';
import Tooltip from '../common/Tooltip';

interface EmployeeGridViewProps {
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
  onActionClick?: (action: string, employee: Employee) => void;
  isAdmin?: boolean;
}

/**
 * EmployeeGridView Component
 * Desktop (lg+): Full table view with all columns
 * Tablet (md): Simplified table with key columns
 * Mobile: Card-based layout for better UX
 */
const EmployeeGridView: React.FC<EmployeeGridViewProps> = ({ employees, onEmployeeClick, onActionClick, isAdmin = false }) => {
  return (
    <>
      {/* Desktop Table View (lg+) */}
      <div className="hidden lg:block w-full overflow-x-auto my-4 sm:my-5 bg-white rounded-xl shadow-lg">
        <div className="min-w-[1400px] inline-block">
          <div className={`grid ${isAdmin && onActionClick ? 'grid-cols-[80px_150px_80px_120px_200px_150px_150px_200px_120px_120px_200px]' : 'grid-cols-[80px_150px_80px_120px_200px_150px_150px_200px_120px_120px]'} gap-3 lg:gap-4 p-3 lg:p-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold text-xs uppercase tracking-wider sticky top-0 z-10`}>
            <div className="px-2">ID</div>
            <div className="px-2">Name</div>
            <div className="px-2">Age</div>
            <div className="px-2">Class</div>
            <div className="px-2">Email</div>
            <div className="px-2">Department</div>
            <div className="px-2">Position</div>
            <div className="px-2">Subjects</div>
            <div className="px-2">Attendance</div>
            <div className="px-2">Salary</div>
            {isAdmin && onActionClick && (
              <div className="px-2 text-center font-bold">Actions</div>
            )}
          </div>
          {employees.map((employee) => (
            <div
              key={employee.id}
              className={`grid ${isAdmin && onActionClick ? 'grid-cols-[80px_150px_80px_120px_200px_150px_150px_200px_120px_120px_200px]' : 'grid-cols-[80px_150px_80px_120px_200px_150px_150px_200px_120px_120px]'} gap-3 lg:gap-4 p-3 lg:p-4 border-b border-gray-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 ease-in-out hover:shadow-md`}
            >
              {/* ID */}
              <div className="px-2 text-xs lg:text-sm text-gray-700 font-mono cursor-pointer" onClick={() => onEmployeeClick(employee)}>
                <Tooltip content={employee.id}>
                  {employee.id.slice(-6)}
                </Tooltip>
              </div>

              {/* Name */}
              <div className="px-2 text-xs lg:text-sm font-medium text-gray-900 min-w-0 cursor-pointer" onClick={() => onEmployeeClick(employee)}>
                <Tooltip content={employee.name} alwaysShow={true}>
                  {employee.name}
                </Tooltip>
              </div>

              {/* Age */}
              <div className="px-2 text-xs lg:text-sm text-gray-700 cursor-pointer" onClick={() => onEmployeeClick(employee)}>{employee.age}</div>

              {/* Class */}
              <div className="px-2 text-xs lg:text-sm text-gray-700 min-w-0 cursor-pointer" onClick={() => onEmployeeClick(employee)}>
                <Tooltip content={employee.class}>
                  {employee.class}
                </Tooltip>
              </div>

              {/* Email */}
              <div className="px-2 text-xs lg:text-sm text-gray-600 min-w-0 cursor-pointer" onClick={() => onEmployeeClick(employee)}>
                <Tooltip content={employee.email} alwaysShow={true}>
                  {employee.email}
                </Tooltip>
              </div>

              {/* Department */}
              <div className="px-2 text-xs lg:text-sm text-gray-700 min-w-0 cursor-pointer" onClick={() => onEmployeeClick(employee)}>
                <Tooltip content={employee.department || 'N/A'}>
                  {employee.department || 'N/A'}
                </Tooltip>
              </div>

              {/* Position */}
              <div className="px-2 text-xs lg:text-sm text-gray-700 min-w-0 cursor-pointer" onClick={() => onEmployeeClick(employee)}>
                <Tooltip content={employee.position || 'N/A'}>
                  {employee.position || 'N/A'}
                </Tooltip>
              </div>

              {/* Subjects - Display as chips */}
              <div className="px-2 text-xs lg:text-sm min-w-0">
                <div className="flex flex-wrap gap-1 max-w-full" onClick={(e) => e.stopPropagation()}>
                  {employee.subjects.slice(0, 3).map((subject, idx) => (
                    <Tooltip key={idx} content={subject} alwaysShow={true}>
                      <span className="
                        inline-block
                        px-2 py-0.5
                        bg-gradient-to-r from-primary-100 to-secondary-100
                        text-primary-700
                        rounded-full
                        text-xs font-medium
                        truncate max-w-[100px]
                        cursor-default
                      ">
                        {subject}
                      </span>
                    </Tooltip>
                  ))}
                  {employee.subjects.length > 3 && (
                    <Tooltip content={`${employee.subjects.slice(3).join(', ')} (${employee.subjects.length - 3} more)`} alwaysShow={true}>
                      <span className="
                        inline-block
                        px-2 py-0.5
                        bg-gray-100
                        text-gray-600
                        rounded-full
                        text-xs font-medium
                        cursor-default
                      ">
                        +{employee.subjects.length - 3}
                      </span>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* Attendance */}
              <div className="px-2 cursor-pointer" onClick={() => onEmployeeClick(employee)}>
                <span
                  className={`inline-block px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${
                    employee.attendance >= 80
                      ? 'bg-green-100 text-green-800'
                      : employee.attendance >= 60
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {employee.attendance}%
                </span>
              </div>

              {/* Salary */}
              <div className="px-2 text-xs lg:text-sm text-gray-700 cursor-pointer" onClick={() => onEmployeeClick(employee)}>
                {employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}
              </div>

              {/* Actions - Only show for admins */}
              {isAdmin && onActionClick && (
                <div className="px-2 flex items-center gap-2 justify-center flex-wrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick('edit', employee);
                    }}
                    className="
                      px-3 py-1.5
                      text-xs font-semibold
                      bg-gradient-to-r from-blue-500 to-blue-600
                      hover:from-blue-600 hover:to-blue-700
                      text-white
                      rounded-lg
                      transition-all duration-200
                      flex items-center gap-1.5
                      shadow-md hover:shadow-lg
                      transform hover:scale-105
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                      whitespace-nowrap
                    "
                    aria-label="Edit employee"
                  >
                    <span className="text-sm">✏️</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick('delete', employee);
                    }}
                    className="
                      px-3 py-1.5
                      text-xs font-semibold
                      bg-gradient-to-r from-red-500 to-red-600
                      hover:from-red-600 hover:to-red-700
                      text-white
                      rounded-lg
                      transition-all duration-200
                      flex items-center gap-1.5
                      shadow-md hover:shadow-lg
                      transform hover:scale-105
                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
                      whitespace-nowrap
                    "
                    aria-label="Delete employee"
                  >
                    <span className="text-sm">🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tablet/Mobile Card View */}
      <div className="lg:hidden w-full my-4 sm:my-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] border border-gray-100"
              onClick={() => onEmployeeClick(employee)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <Tooltip content={employee.name}>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate mb-1">
                      {employee.name}
                    </h3>
                  </Tooltip>
                  <Tooltip content={employee.email}>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{employee.email}</p>
                  </Tooltip>
                </div>
                <div className="ml-3 flex flex-col items-end gap-2">
                  <span
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                      employee.attendance >= 80
                        ? 'bg-green-100 text-green-800'
                        : employee.attendance >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {employee.attendance}%
                  </span>
                  {isAdmin && onActionClick && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick('edit', employee);
                        }}
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
                        aria-label="Edit employee"
                      >
                        <span className="text-sm">✏️</span>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick('delete', employee);
                        }}
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
                        aria-label="Delete employee"
                      >
                        <span className="text-sm">🗑️</span>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-500 font-medium">Age:</span>
                  <span className="ml-1 text-gray-900 font-semibold">{employee.age}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Class:</span>
                  <span className="ml-1 text-gray-900 font-semibold">{employee.class}</span>
                </div>
                {employee.department && (
                  <div className="min-w-0">
                    <span className="text-gray-500 font-medium">Dept:</span>
                    <Tooltip content={employee.department}>
                      <span className="ml-1 text-gray-900 font-semibold truncate block">{employee.department}</span>
                    </Tooltip>
                  </div>
                )}
                {employee.position && (
                  <div className="min-w-0">
                    <span className="text-gray-500 font-medium">Position:</span>
                    <Tooltip content={employee.position}>
                      <span className="ml-1 text-gray-900 font-semibold truncate block">{employee.position}</span>
                    </Tooltip>
                  </div>
                )}
                {employee.salary && (
                  <div className="col-span-2">
                    <span className="text-gray-500 font-medium">Salary:</span>
                    <span className="ml-1 text-gray-900 font-semibold">
                      ${employee.salary.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Subjects */}
              {employee.subjects.length > 0 && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {employee.subjects.slice(0, 3).map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-2 sm:px-3 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full text-xs font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                    {employee.subjects.length > 3 && (
                      <span className="px-2 sm:px-3 py-1 text-gray-500 text-xs">
                        +{employee.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EmployeeGridView;
