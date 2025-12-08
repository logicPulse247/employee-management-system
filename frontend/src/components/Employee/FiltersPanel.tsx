import React from 'react';
import { EmployeeFilters } from '../../types';

interface FiltersPanelProps {
  filters: EmployeeFilters;
  onFilterChange: (key: keyof EmployeeFilters, value: string | number | undefined) => void;
  onClearFilters: () => void;
}

/**
 * FiltersPanel Component
 * Responsive filter inputs in a grid layout
 * Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns
 */
const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  return (
    <div className="
      bg-white p-4 sm:p-6
      rounded-xl mb-4 sm:mb-6
      shadow-md
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
      gap-3 sm:gap-4
      animate-slide-down
    ">
      <div className="flex flex-col gap-2">
        <label className="text-xs sm:text-sm font-semibold text-gray-600">Name</label>
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.name || ''}
          onChange={(e) => onFilterChange('name', e.target.value)}
          className="
            w-full px-3 py-2
            border-2 border-gray-300 rounded-lg
            text-sm
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
            transition-colors
          "
          aria-label="Filter by name"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs sm:text-sm font-semibold text-gray-600">Class</label>
        <input
          type="text"
          placeholder="Filter by class..."
          value={filters.class || ''}
          onChange={(e) => onFilterChange('class', e.target.value)}
          className="
            w-full px-3 py-2
            border-2 border-gray-300 rounded-lg
            text-sm
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
            transition-colors
          "
          aria-label="Filter by class"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs sm:text-sm font-semibold text-gray-600">Department</label>
        <input
          type="text"
          placeholder="Filter by department..."
          value={filters.department || ''}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="
            w-full px-3 py-2
            border-2 border-gray-300 rounded-lg
            text-sm
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
            transition-colors
          "
          aria-label="Filter by department"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs sm:text-sm font-semibold text-gray-600">Min Age</label>
        <input
          type="number"
          placeholder="Min age"
          value={filters.minAge || ''}
          onChange={(e) => onFilterChange('minAge', e.target.value ? parseInt(e.target.value) : undefined)}
          className="
            w-full px-3 py-2
            border-2 border-gray-300 rounded-lg
            text-sm
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
            transition-colors
          "
          aria-label="Minimum age"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs sm:text-sm font-semibold text-gray-600">Max Age</label>
        <input
          type="number"
          placeholder="Max age"
          value={filters.maxAge || ''}
          onChange={(e) => onFilterChange('maxAge', e.target.value ? parseInt(e.target.value) : undefined)}
          className="
            w-full px-3 py-2
            border-2 border-gray-300 rounded-lg
            text-sm
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
            transition-colors
          "
          aria-label="Maximum age"
        />
      </div>
      <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
        <button
          className="
            w-full sm:w-auto
            px-4 sm:px-6
            py-2 sm:py-2.5
            bg-gradient-to-r from-red-500 to-red-600
            hover:from-red-600 hover:to-red-700
            text-white rounded-lg
            text-sm sm:text-base font-semibold
            transition-all duration-200
            shadow-md hover:shadow-lg
            transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          "
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersPanel;
