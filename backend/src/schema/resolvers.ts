import { Context, EmployeeQueryArgs } from '../types';
import { userService, employeeService } from '../services';
import { USER_ROLES } from '../constants';
import { requireAuth, requireRole } from '../middleware/auth';

const resolvers = {
  Query: {
    employees: async (_: unknown, args: EmployeeQueryArgs) => {
      // Both admin and employee can view employees
      return employeeService.getEmployees(args);
    },

    employee: async (_: unknown, args: { id: string }) => {
      // Both admin and employee can view single employee
      return employeeService.getEmployeeById(args.id);
    },

    me: async (_: unknown, __: unknown, context: Context) => {
      requireAuth(context);
      return userService.getCurrentUser(context.user!._id.toString());
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      args: { username: string; email: string; password: string; role?: string }
    ) => {
      return await userService.register(args.username, args.email, args.password, args.role);
    },

    login: async (_: unknown, args: { username: string; password: string }) => {
      return await userService.login(args.username, args.password);
    },

    addEmployee: async (_: unknown, args: { input: Record<string, unknown> }, context: Context) => {
      requireRole(context, [USER_ROLES.ADMIN]);
      return await employeeService.createEmployee(args.input);
    },

    updateEmployee: async (
      _: unknown,
      args: { id: string; input: Record<string, unknown> },
      context: Context
    ) => {
      requireRole(context, [USER_ROLES.ADMIN]);
      return await employeeService.updateEmployee(args.id, args.input);
    },

    deleteEmployee: async (_: unknown, args: { id: string }, context: Context) => {
      requireRole(context, [USER_ROLES.ADMIN]);
      return await employeeService.deleteEmployee(args.id);
    },
  },
};

export default resolvers;
