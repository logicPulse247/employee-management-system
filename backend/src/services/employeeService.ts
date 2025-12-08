import { Employee } from '../models/Employee';
import {
  validateInput,
  employeeInputSchema,
  employeeUpdateSchema,
  employeeFiltersSchema,
  sortInputSchema,
} from '../utils/validation';
import { EmployeeQueryArgs, EmployeeResponse } from '../types';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_FIELD,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from '../constants';
import { ConflictError, NotFoundError } from '../errors';
import { sanitizeForRegex, sanitizeString } from '../utils/sanitize';

export class EmployeeService {
  async getEmployees(args: EmployeeQueryArgs): Promise<EmployeeResponse> {
    // Validate and limit pagination
    const page = Math.max(1, args.page || DEFAULT_PAGE);
    const pageSize = Math.min(
      Math.max(MIN_PAGE_SIZE, args.pageSize || DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE
    );
    const { filters, sort } = args;

    // Validate filters and sort if provided
    const validatedFilters = filters ? validateInput(employeeFiltersSchema, filters) : undefined;
    const validatedSort = sort ? validateInput(sortInputSchema, sort) : undefined;

    // Build query
    const query: Record<string, unknown> = {};

    if (validatedFilters) {
      if (validatedFilters.name) {
        const sanitizedName = sanitizeForRegex(validatedFilters.name);
        query.name = { $regex: sanitizedName, $options: 'i' };
      }
      if (validatedFilters.class) {
        query.class = sanitizeString(validatedFilters.class);
      }
      if (validatedFilters.department) {
        const sanitizedDept = sanitizeForRegex(validatedFilters.department);
        query.department = { $regex: sanitizedDept, $options: 'i' };
      }
      if (validatedFilters.minAge !== undefined || validatedFilters.maxAge !== undefined) {
        const ageQuery: Record<string, number> = {};
        if (validatedFilters.minAge !== undefined) ageQuery.$gte = validatedFilters.minAge;
        if (validatedFilters.maxAge !== undefined) ageQuery.$lte = validatedFilters.maxAge;
        query.age = ageQuery;
      }
      if (
        validatedFilters.minAttendance !== undefined ||
        validatedFilters.maxAttendance !== undefined
      ) {
        const attendanceQuery: Record<string, number> = {};
        if (validatedFilters.minAttendance !== undefined)
          attendanceQuery.$gte = validatedFilters.minAttendance;
        if (validatedFilters.maxAttendance !== undefined)
          attendanceQuery.$lte = validatedFilters.maxAttendance;
        query.attendance = attendanceQuery;
      }
    }

    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};
    if (validatedSort) {
      sortObj[validatedSort.field] = validatedSort.order === 'ASC' ? 1 : -1;
    } else {
      // DEFAULT_SORT_ORDER is 'DESC', so use -1 directly
      sortObj[DEFAULT_SORT_FIELD] = -1;
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Execute queries with performance optimization
    const [employees, total] = await Promise.all([
      Employee.find(query).sort(sortObj).skip(skip).limit(pageSize).lean(),
      Employee.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      employees: employees.map(
        (
          emp: Record<string, unknown> & {
            _id: { toString: () => string };
            joinDate: Date;
            createdAt: Date;
            updatedAt: Date;
          }
        ) => ({
          ...emp,
          id: emp._id.toString(),
          joinDate: emp.joinDate.toISOString(),
          createdAt: emp.createdAt.toISOString(),
          updatedAt: emp.updatedAt.toISOString(),
        })
      ),
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getEmployeeById(id: string) {
    // Use .lean() for read-only query to improve performance
    const employee = await Employee.findById(id).lean();
    if (!employee) {
      throw new NotFoundError('Employee');
    }

    return {
      ...employee,
      id: employee._id.toString(),
      joinDate: (employee.joinDate as Date).toISOString(),
      createdAt: (employee.createdAt as Date).toISOString(),
      updatedAt: (employee.updatedAt as Date).toISOString(),
    };
  }

  async createEmployee(input: Record<string, unknown>) {
    // Validate input
    const validatedInput = validateInput(employeeInputSchema, input);

    const existingEmployee = await Employee.findOne({ email: validatedInput.email });
    if (existingEmployee) {
      throw new ConflictError('Employee with this email already exists');
    }

    const employee = new Employee(validatedInput);
    await employee.save();

    return {
      ...employee.toObject(),
      id: employee._id.toString(),
      joinDate: employee.joinDate.toISOString(),
      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString(),
    };
  }

  async updateEmployee(id: string, input: Record<string, unknown>) {
    // Validate input
    const validatedInput = validateInput(employeeUpdateSchema, input);

    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: validatedInput },
      { new: true, runValidators: true }
    );

    if (!employee) {
      throw new NotFoundError('Employee');
    }

    return {
      ...employee.toObject(),
      id: employee._id.toString(),
      joinDate: employee.joinDate.toISOString(),
      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString(),
    };
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await Employee.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundError('Employee');
    }
    return true;
  }
}

export default new EmployeeService();
