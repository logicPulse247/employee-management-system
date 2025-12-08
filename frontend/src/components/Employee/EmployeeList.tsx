import React from 'react';
import { ViewMode, Employee } from '../../types';
import EmployeeGridView from './EmployeeGridView';
import EmployeeTileView from './EmployeeTileView';
import EmployeeTableSkeleton from './EmployeeTableSkeleton';
import EmployeeCardSkeleton from './EmployeeCardSkeleton';

interface EmployeeListProps {
  employees: Employee[];
  viewMode: ViewMode;
  loading: boolean;
  error?: Error | null;
  onEmployeeClick: (employee: Employee) => void;
  onActionClick?: (action: string, employee: Employee) => void;
  isAdmin?: boolean;
}

/**
 * EmployeeList Component
 * Handles loading, error, empty, and success states
 * Renders appropriate view based on viewMode
 */
const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  viewMode,
  loading,
  error,
  onEmployeeClick,
  onActionClick,
  isAdmin = false
}) => {
  // Loading state
  if (loading && employees.length === 0) {
    return (
      <>
        {viewMode === 'grid' ? (
          <EmployeeTableSkeleton />
        ) : (
          <EmployeeCardSkeleton />
        )}
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 sm:py-16 lg:py-20">
        <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">⚠️</div>
        <div className="text-base sm:text-lg lg:text-xl text-red-600 mb-2 font-semibold">
          Error loading employees
        </div>
        <div className="text-xs sm:text-sm lg:text-base text-gray-600 px-4">
          {error.message}
        </div>
      </div>
    );
  }

  // Empty state
  if (employees.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 lg:py-20">
        <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📭</div>
        <div className="text-base sm:text-lg lg:text-xl text-gray-600 mb-2 font-semibold">
          No employees found
        </div>
        <div className="text-xs sm:text-sm lg:text-base text-gray-500 px-4">
          Try adjusting your filters or create a new employee.
        </div>
      </div>
    );
  }

  // Success state - render employees
  return (
    <>
      {viewMode === 'grid' ? (
        <EmployeeGridView
          employees={employees}
          onEmployeeClick={onEmployeeClick}
          onActionClick={isAdmin ? (onActionClick || (() => {})) : undefined}
          isAdmin={isAdmin}
        />
      ) : (
        <EmployeeTileView
          employees={employees}
          onEmployeeClick={onEmployeeClick}
          onActionClick={isAdmin ? (onActionClick || (() => {})) : undefined}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
};

export default EmployeeList;
