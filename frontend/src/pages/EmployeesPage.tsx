import React, { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { GET_EMPLOYEES } from '../graphql/queries';
import { DELETE_EMPLOYEE } from '../graphql/mutations';
import { ViewMode, Employee } from '../types';
import EmployeeDetailModal from '../components/Employee/EmployeeDetailModal';
import EditEmployeeModal from '../components/Employee/EditEmployeeModal';
import DeleteConfirmModal from '../components/Employee/DeleteConfirmModal';
import CreateEmployeeModal from '../components/Employee/CreateEmployeeModal';
import Navbar from '../components/common/Navbar';
import Layout from '../components/common/Layout';
import ActionBar from '../components/Employee/ActionBar';
import FiltersPanel from '../components/Employee/FiltersPanel';
import EmployeeList from '../components/Employee/EmployeeList';
import PaginationControls from '../components/Employee/PaginationControls';
import { useAuth } from '../context/AuthContext';
import { useEmployees } from '../hooks/useEmployees';
import { toast } from 'react-hot-toast';

const EmployeesPage: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenuPath, setActiveMenuPath] = useState<string>('/employees');

  const {
    employees,
    pagination,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    sort,
    handleFilterChange,
    handleSortChange,
    clearFilters,
    refetch,
  } = useEmployees(1, 8);

  useEffect(() => {
    setPage(1);
  }, [pageSize, setPage]);

  const [deleteEmployee, { loading: isDeleting }] = useMutation(DELETE_EMPLOYEE, {
    optimisticResponse: {
      deleteEmployee: true,
    } as { deleteEmployee: boolean },
    update: (cache, { data }) => {
      if (data && typeof data === 'object' && 'deleteEmployee' in data && data.deleteEmployee && deletingEmployee) {
        const existingData = cache.readQuery<{
          employees: { employees: Employee[]; pagination: any };
        }>({
          query: GET_EMPLOYEES,
          variables: {
            page,
            pageSize,
            filters: Object.keys(filters).length > 0 ? filters : undefined,
            sort,
          },
        });

        if (existingData?.employees) {
          cache.writeQuery({
            query: GET_EMPLOYEES,
            variables: {
              page,
              pageSize,
              filters: Object.keys(filters).length > 0 ? filters : undefined,
              sort,
            },
            data: {
              employees: {
                ...existingData.employees,
                employees: existingData.employees.employees.filter(
                  (emp) => emp.id !== deletingEmployee.id
                ),
                pagination: {
                  ...existingData.employees.pagination,
                  total: existingData.employees.pagination.total - 1,
                },
              },
            },
          });
        }
      }
    },
    refetchQueries: [{
      query: GET_EMPLOYEES,
      variables: {
        page,
        pageSize,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        sort
      }
    }],
    awaitRefetchQueries: false,
    onCompleted: () => {
      toast.success('Employee deleted successfully!');
      setDeletingEmployee(null);
      setSelectedEmployee(null);
    },
    onError: (error) => {
      refetch();
      toast.error(error.message || 'Failed to delete employee');
    },
  });

  const menuItems = [
    {
      label: 'Employees',
      path: '/employees',
      submenu: [
        { label: 'All Employees', path: '/employees' },
        { label: 'By Department', path: '/employees?filter=department' }
      ]
    },
    {
      label: 'Reports',
      path: '/reports',
      submenu: [
        { label: 'Attendance Report', path: '/reports/attendance' },
        { label: 'Performance Report', path: '/reports/performance' }
      ]
    },
    { label: 'Settings', path: '/settings' }
  ];

  // Handle menu navigation with proper route handling
  const handleMenuNavigate = (path: string) => {
    setActiveMenuPath(path);

    if (path.includes('?')) {
      const [route, query] = path.split('?');
      if (query === 'filter=department') {
        setShowFilters(true);
        navigate(route);
        setTimeout(() => {
          const departmentInput = document.querySelector('input[placeholder="Filter by department..."]') as HTMLInputElement;
          if (departmentInput) {
            departmentInput.focus();
          }
        }, 100);
      } else {
        navigate(route, { state: { filter: query } });
      }
    } else {
      if (path === '/employees') {
        clearFilters();
      }
      navigate(path);
    }
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('filter') === 'department') {
      setActiveMenuPath('/employees?filter=department');
    } else {
      setActiveMenuPath(currentPath);
    }
  }, []);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
  };

  const handleActionClick = (action: string, employee: Employee) => {
    if (action === 'view') {
      setSelectedEmployee(employee);
    } else if (action === 'edit' && isAdmin()) {
      setEditingEmployee(employee);
    } else if (action === 'delete' && isAdmin()) {
      setDeletingEmployee(employee);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setSelectedEmployee(null);
  };

  const handleDelete = (employee: Employee) => {
    setDeletingEmployee(employee);
    setSelectedEmployee(null);
  };

  const handleDeleteConfirm = async () => {
    if (deletingEmployee) {
      await deleteEmployee({
        variables: { id: deletingEmployee.id },
      });
    }
  };

  const handleFlag = useCallback((employee: Employee) => {
    toast.success(`Employee ${employee.name} has been flagged for review`, {
      icon: '🚩',
      duration: 4000,
    });
    setSelectedEmployee(null);
  }, []);

  const logoutButton = (
    <button
      className="
        px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5
        bg-gradient-to-r from-primary-500 to-secondary-600
        text-white rounded-lg
        text-xs sm:text-sm lg:text-base
        font-semibold
        hover:from-primary-600 hover:to-secondary-700
        transform hover:scale-105
        transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      "
      onClick={logout}
      aria-label="Logout"
    >
      <span className="block sm:hidden">Out</span>
      <span className="hidden sm:block">Logout</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="Employee Management"
        menuItems={menuItems}
        onNavigate={handleMenuNavigate}
        activePath={activeMenuPath}
        rightContent={logoutButton}
      />

      <Layout>
        {/* Action Bar Component */}
        <ActionBar
          isAdmin={isAdmin()}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateClick={() => setShowCreateModal(true)}
          onFiltersToggle={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
          onSortChange={handleSortChange}
          sortField={sort?.field}
        />

        {/* Filters Panel Component */}
        {showFilters && (
          <FiltersPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={() => {
              clearFilters();
              setShowFilters(false);
            }}
          />
        )}

        {/* Employee List Component - Handles loading, error, empty, and success states */}
        <EmployeeList
          employees={employees}
          viewMode={viewMode}
          loading={loading}
          error={error || undefined}
          onEmployeeClick={handleEmployeeClick}
          onActionClick={handleActionClick}
          isAdmin={isAdmin()}
        />

        {/* Pagination Controls Component */}
        {!loading && !error && employees.length > 0 && pagination && (
          <PaginationControls
            pagination={pagination}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </Layout>

      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={handleCloseModal}
          onEdit={isAdmin() ? handleEdit : undefined}
          onDelete={isAdmin() ? handleDelete : undefined}
          onFlag={handleFlag}
        />
      )}

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSuccess={() => {
            setEditingEmployee(null);
            if (selectedEmployee?.id === editingEmployee.id) {
              setSelectedEmployee(null);
            }
          }}
        />
      )}

      {deletingEmployee && (
        <DeleteConfirmModal
          employee={deletingEmployee}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingEmployee(null)}
          isDeleting={isDeleting}
        />
      )}

      {showCreateModal && (
        <CreateEmployeeModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            setPage(1);
          }}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
