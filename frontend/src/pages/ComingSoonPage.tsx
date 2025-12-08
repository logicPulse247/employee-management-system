import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title = 'Coming Soon',
  description = 'This page is under development.',
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 max-w-md w-full text-center">
        <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">🚧</div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          {title}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 px-2">
          {description}
        </p>
        <button
          onClick={() => navigate(ROUTES.EMPLOYEES)}
          className="
            w-full sm:w-auto
            px-4 sm:px-6
            py-2.5 sm:py-3
            bg-gradient-to-r from-primary-500 to-secondary-600
            text-white rounded-lg
            text-sm sm:text-base font-semibold
            hover:from-primary-600 hover:to-secondary-700
            transform hover:scale-105
            transition-all duration-200
            shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          "
        >
          Back to Employees
        </button>
      </div>
    </div>
  );
};

export default ComingSoonPage;
