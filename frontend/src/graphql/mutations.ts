import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
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
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
    updateEmployee(id: $id, input: $input) {
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
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

