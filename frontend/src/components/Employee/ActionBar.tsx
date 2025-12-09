import React from 'react';
import { ViewMode } from '../../types';

interface ActionBarProps {
  isAdmin: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateClick: () => void;
  onFiltersToggle: () => void;
  showFilters: boolean;
  onSortChange: (field: string) => void;
  sortField?: string;
}

/**
 * ActionBar Component
 * Contains: Create button, View mode toggle, Filters button, Sort dropdown
 * Responsive: Stacks vertically on mobile, horizontal on desktop
 */
const ActionBar: React.FC<ActionBarProps> = ({
  isAdmin,
  viewMode,
  onViewModeChange,
  onCreateClick,
  onFiltersToggle,
  showFilters,
  onSortChange,
  sortField,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
      {/* Left: Create button (admin only) */}
      {isAdmin && (
        <button
          onClick={onCreateClick}
          className="
            w-full sm:w-auto
            px-4 sm:px-6
            py-2.5 sm:py-2.5
            bg-gradient-to-r from-primary-500 to-secondary-600
            text-white rounded-lg
            text-sm sm:text-base font-semibold
            hover:from-primary-600 hover:to-secondary-700
            transform hover:scale-[1.02]
            transition-all duration-300 ease-in-out
            shadow-lg hover:shadow-xl
            flex items-center justify-center gap-2
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          "
          aria-label="Create new employee"
        >
          <span>➕</span>
          <span>Create Employee</span>
        </button>
      )}

      {/* Right: View mode, Filters, Sort */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        {/* View Mode Toggle */}
        <div className="flex gap-1 sm:gap-2 bg-white p-1 rounded-lg shadow-md">
          <button
            className={`
              flex-1 sm:flex-none
              px-3 sm:px-4 lg:px-5
              py-2 sm:py-2.5
              rounded-lg
              text-xs sm:text-sm font-semibold
              transition-all duration-300 ease-in-out
              flex items-center justify-center gap-1 sm:gap-2
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            className={`
              flex-1 sm:flex-none
              px-3 sm:px-4 lg:px-5
              py-2 sm:py-2.5
              rounded-lg
              text-xs sm:text-sm font-semibold
              transition-all duration-300 ease-in-out
              flex items-center justify-center gap-1 sm:gap-2
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${
                viewMode === 'tile'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
            onClick={() => onViewModeChange('tile')}
            aria-label="Tile view"
          >
            <span>🎴</span>
            <span className="hidden sm:inline">Tiles</span>
          </button>
        </div>

        {/* Filters and Sort */}
        <div className="flex gap-2 sm:gap-3">
          <button
            className="
              flex-1 sm:flex-none
              px-3 sm:px-5
              py-2 sm:py-2.5
              bg-white border-2 border-gray-300
              rounded-lg
              text-xs sm:text-sm font-semibold
              hover:border-primary-500 hover:text-primary-600
              transition-all duration-200
              shadow-sm hover:shadow-md
              transform hover:scale-105
              flex items-center justify-center gap-1 sm:gap-2
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            "
            onClick={onFiltersToggle}
            aria-label="Toggle filters"
            aria-pressed={showFilters}
          >
            <span>🔍</span>
            <span className="hidden sm:inline">Filters</span>
          </button>
          <select
            className="
              flex-1 sm:flex-none
              px-3 sm:px-4
              py-2 sm:py-2.5
              border-2 border-gray-300
              rounded-lg
              text-xs sm:text-sm font-semibold
              cursor-pointer bg-white
              hover:border-primary-500
              focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
              transition-all duration-200
              shadow-sm hover:shadow-md
            "
            value={sortField || ''}
            onChange={e => e.target.value && onSortChange(e.target.value)}
            aria-label="Sort by"
          >
            <option value="">Sort by...</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
            <option value="attendance">Attendance</option>
            <option value="createdAt">Date Added</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
