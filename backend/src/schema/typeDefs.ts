import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    email: String!
    department: String
    position: String
    salary: Float
    joinDate: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input EmployeeInput {
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    email: String!
    department: String
    position: String
    salary: Float
  }

  input EmployeeUpdateInput {
    name: String
    age: Int
    class: String
    subjects: [String!]
    attendance: Float
    email: String
    department: String
    position: String
    salary: Float
  }

  input EmployeeFilters {
    name: String
    class: String
    department: String
    minAge: Int
    maxAge: Int
    minAttendance: Float
    maxAttendance: Float
  }

  input SortInput {
    field: String!
    order: String! # ASC or DESC
  }

  type PaginationInfo {
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type EmployeesResponse {
    employees: [Employee!]!
    pagination: PaginationInfo!
  }

  type Query {
    # Get all employees with optional filters, pagination, and sorting
    employees(
      filters: EmployeeFilters
      page: Int = 1
      pageSize: Int = 10
      sort: SortInput
    ): EmployeesResponse!

    # Get single employee by ID
    employee(id: ID!): Employee

    # Get current authenticated user
    me: User
  }

  type Mutation {
    # Authentication
    register(username: String!, email: String!, password: String!, role: String): AuthPayload!
    login(username: String!, password: String!): AuthPayload!

    # Employee mutations (admin only for add/update)
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;
