import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
  query GetEmployees(
    $filters: EmployeeFilters
    $page: Int
    $pageSize: Int
    $sort: SortInput
  ) {
    employees(filters: $filters, page: $page, pageSize: $pageSize, sort: $sort) {
      employees {
        id
        name
        age
        class
        subjects
        attendance
        email
        department
        position
        salary
        joinDate
        createdAt
        updatedAt
      }
      pagination {
        total
        page
        pageSize
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      name
      age
      class
      subjects
      attendance
      email
      department
      position
      salary
      joinDate
      createdAt
      updatedAt
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      email
      role
    }
  }
`;

