import React from 'react';
import { Employee } from '../../types';

interface DeleteConfirmModalProps {
  employee: Employee;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  employee,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Responsive */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <h2 id="delete-confirm-title" className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            Confirm Delete
          </h2>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Warning Content - Responsive */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">⚠️</div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-2">
              Are you sure you want to delete
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 break-words">
              {employee.name}?
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>

          {/* Action Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              className="
                w-full sm:w-auto
                px-4 sm:px-6
                py-2 sm:py-2.5
                bg-gray-200 hover:bg-gray-300
                text-gray-800 rounded-lg
                text-sm sm:text-base font-semibold
                transition-all duration-200
                shadow-sm hover:shadow-md
                transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              "
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="
                w-full sm:w-auto
                px-4 sm:px-6
                py-2 sm:py-2.5
                bg-red-500 hover:bg-red-600
                text-white rounded-lg
                text-sm sm:text-base font-semibold
                transition-all duration-200
                shadow-md hover:shadow-lg
                transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              "
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Employee'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
