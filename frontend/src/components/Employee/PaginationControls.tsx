import React from 'react';
import { PaginationInfo } from '../../types';

interface PaginationControlsProps {
  pagination: PaginationInfo;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/**
 * PaginationControls Component
 * Fully responsive pagination with page size selector
 */
const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  return (
    <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-white rounded-xl shadow-md">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Items per page selector - Responsive */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">
              Items per page:
            </label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="
                flex-1 sm:flex-none
                px-3 py-2
                border-2 border-gray-300 rounded-lg
                text-xs sm:text-sm font-semibold
                cursor-pointer bg-white
                hover:border-primary-500
                focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                transition-all duration-200
              "
              aria-label="Items per page"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-gray-600 text-center sm:text-left">
            Showing {((pagination.page - 1) * pageSize) + 1} to {Math.min(pagination.page * pageSize, pagination.total)} of {pagination.total} employees
          </div>
        </div>

        {/* Pagination controls - Responsive button sizes */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
          <button
            className="
              px-2 sm:px-3 lg:px-4
              py-1.5 sm:py-2
              bg-gradient-to-r from-primary-500 to-secondary-600
              text-white rounded-lg
              text-xs sm:text-sm font-semibold
              hover:from-primary-600 hover:to-secondary-700
              transform hover:scale-105
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              shadow-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            "
            onClick={() => onPageChange(1)}
            disabled={!pagination.hasPreviousPage}
            title="First page"
            aria-label="First page"
          >
            <span className="hidden sm:inline">««</span>
            <span className="sm:hidden">«</span>
          </button>
          <button
            className="
              px-2 sm:px-3 lg:px-4
              py-1.5 sm:py-2
              bg-gradient-to-r from-primary-500 to-secondary-600
              text-white rounded-lg
              text-xs sm:text-sm font-semibold
              hover:from-primary-600 hover:to-secondary-700
              transform hover:scale-105
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              shadow-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            "
            onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
            disabled={!pagination.hasPreviousPage}
            aria-label="Previous page"
          >
            <span className="hidden sm:inline">← Previous</span>
            <span className="sm:hidden">←</span>
          </button>

          {/* Page numbers - Responsive */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`
                    px-2 sm:px-3 lg:px-4
                    py-1.5 sm:py-2
                    rounded-lg
                    text-xs sm:text-sm font-semibold
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    ${
                      pagination.page === pageNum
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md'
                    }
                  `}
                  aria-label={`Page ${pageNum}`}
                  aria-current={pagination.page === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="
              px-2 sm:px-3 lg:px-4
              py-1.5 sm:py-2
              bg-gradient-to-r from-primary-500 to-secondary-600
              text-white rounded-lg
              text-xs sm:text-sm font-semibold
              hover:from-primary-600 hover:to-secondary-700
              transform hover:scale-105
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              shadow-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            "
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next →</span>
            <span className="sm:hidden">→</span>
          </button>
          <button
            className="
              px-2 sm:px-3 lg:px-4
              py-1.5 sm:py-2
              bg-gradient-to-r from-primary-500 to-secondary-600
              text-white rounded-lg
              text-xs sm:text-sm font-semibold
              hover:from-primary-600 hover:to-secondary-700
              transform hover:scale-105
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              shadow-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            "
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={!pagination.hasNextPage}
            title="Last page"
            aria-label="Last page"
          >
            <span className="hidden sm:inline">»»</span>
            <span className="sm:hidden">»</span>
          </button>
        </div>

        {/* Page info - Responsive text */}
        <div className="text-center text-xs sm:text-sm font-semibold text-gray-600">
          Page {pagination.page} of {pagination.totalPages}
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
