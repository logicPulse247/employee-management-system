import React from 'react';
import { Employee } from '../../types';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onFlag?: (employee: Employee) => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onEdit,
  onDelete,
  onFlag
}) => {
  if (!employee) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-detail-title"
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Responsive */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
          <h2 id="employee-detail-title" className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            Employee Details
          </h2>
          <button
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-2xl sm:text-3xl w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Profile Header - Responsive */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{employee.name}</h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 break-all">{employee.email}</p>
          </div>

          {/* Details Grid - Responsive: 1 column on mobile, 2 on tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">ID</span>
              <p className="text-sm sm:text-base text-gray-900 font-semibold mt-1 break-all">{employee.id}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Age</span>
              <p className="text-sm sm:text-base text-gray-900 font-semibold mt-1">{employee.age} years</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Class</span>
              <p className="text-base text-gray-900 font-semibold mt-1">{employee.class}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Department</span>
              <p className="text-base text-gray-900 font-semibold mt-1">{employee.department || 'N/A'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Position</span>
              <p className="text-base text-gray-900 font-semibold mt-1">{employee.position || 'N/A'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Attendance</span>
              <p
                className={`text-base font-semibold mt-1 ${
                  employee.attendance >= 80
                    ? 'text-green-600'
                    : employee.attendance >= 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {employee.attendance}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Salary</span>
              <p className="text-base text-gray-900 font-semibold mt-1">
                {employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Join Date</span>
              <p className="text-base text-gray-900 font-semibold mt-1">
                {new Date(employee.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Subjects - Responsive */}
          <div className="mb-4 sm:mb-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Subjects</h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {employee.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-full text-xs sm:text-sm font-medium shadow-md"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          {onEdit && (
            <button
              className="
                w-full sm:w-auto
                px-4 sm:px-6
                py-2 sm:py-2.5
                bg-gradient-to-r from-blue-500 to-blue-600
                hover:from-blue-600 hover:to-blue-700
                text-white rounded-lg
                text-sm sm:text-base font-semibold
                transition-all duration-200
                shadow-md hover:shadow-lg
                transform hover:scale-105
                flex items-center justify-center gap-2
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
              onClick={() => onEdit(employee)}
            >
              <span>✏️</span>
              <span>Edit</span>
            </button>
          )}
          {onDelete && (
            <button
              className="
                w-full sm:w-auto
                px-4 sm:px-6
                py-2 sm:py-2.5
                bg-gradient-to-r from-red-600 to-red-700
                hover:from-red-700 hover:to-red-800
                text-white rounded-lg
                text-sm sm:text-base font-semibold
                transition-all duration-200
                shadow-md hover:shadow-lg
                transform hover:scale-105
                flex items-center justify-center gap-2
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              "
              onClick={() => onDelete(employee)}
            >
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          )}
          {onFlag && (
            <button
              className="
                w-full sm:w-auto
                px-4 sm:px-6
                py-2 sm:py-2.5
                bg-gradient-to-r from-amber-500 to-orange-500
                hover:from-amber-600 hover:to-orange-600
                text-white rounded-lg
                text-sm sm:text-base font-semibold
                transition-all duration-200
                shadow-md hover:shadow-lg
                transform hover:scale-105
                flex items-center justify-center gap-2
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
              "
              onClick={() => onFlag(employee)}
            >
              <span>🚩</span>
              <span>Flag</span>
            </button>
          )}
          <button
            className="
              w-full sm:w-auto
              px-4 sm:px-6
              py-2 sm:py-2.5
              bg-gray-100 hover:bg-gray-200
              border border-gray-300
              text-gray-700 rounded-lg
              text-sm sm:text-base font-semibold
              transition-all duration-200
              shadow-sm hover:shadow-md
              transform hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            "
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
