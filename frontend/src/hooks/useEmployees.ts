import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_EMPLOYEES } from '../graphql/queries';
import { EmployeeFilters, SortInput, Employee, PaginationInfo } from '../types';
import { PAGINATION } from '../constants';

export const useEmployees = (initialPage: number = PAGINATION.DEFAULT_PAGE, initialPageSize: number = PAGINATION.DEFAULT_PAGE_SIZE) => {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [sort, setSort] = useState<SortInput | undefined>(undefined);

  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      page,
      pageSize,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      sort,
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleFilterChange = useCallback((key: keyof EmployeeFilters, value: string | number | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === '' || value === undefined) {
        delete newFilters[key];
      } else {
        newFilters[key] = value as any;
      }
      setPage(PAGINATION.DEFAULT_PAGE);
      return newFilters;
    });
  }, []);

  const handleSortChange = useCallback((field: string) => {
    setSort(prev => {
      if (prev?.field === field && prev.order === 'ASC') {
        return { field, order: 'DESC' };
      }
      return { field, order: 'ASC' };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(PAGINATION.DEFAULT_PAGE);
  }, []);

  const employeesData = data as { employees?: { employees?: Employee[]; pagination?: PaginationInfo } } | null | undefined;

  return {
    employees: employeesData?.employees?.employees || [],
    pagination: employeesData?.employees?.pagination,
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
  };
};
