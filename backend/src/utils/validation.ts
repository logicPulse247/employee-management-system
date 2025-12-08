import { z } from 'zod';
import { ValidationError } from '../errors';

// Employee validation schemas
export const employeeInputSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  age: z.number().int().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100'),
  class: z.string().min(1, 'Class is required').max(50, 'Class must be less than 50 characters'),
  subjects: z
    .array(z.string().min(1, 'Subject cannot be empty'))
    .min(1, 'At least one subject is required'),
  attendance: z
    .number()
    .min(0, 'Attendance cannot be negative')
    .max(100, 'Attendance cannot exceed 100'),
  email: z.string().email('Invalid email address'),
  department: z.string().max(100, 'Department must be less than 100 characters').optional(),
  position: z.string().max(100, 'Position must be less than 100 characters').optional(),
  salary: z.number().min(0, 'Salary cannot be negative').optional(),
});

export const employeeUpdateSchema = employeeInputSchema.partial();

// User validation schemas
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  role: z.enum(['admin', 'employee']).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Employee filters schema
export const employeeFiltersSchema = z
  .object({
    name: z.string().optional(),
    class: z.string().optional(),
    department: z.string().optional(),
    minAge: z.number().int().min(18).optional(),
    maxAge: z.number().int().max(100).optional(),
    minAttendance: z.number().min(0).max(100).optional(),
    maxAttendance: z.number().min(0).max(100).optional(),
  })
  .optional();

// Sort input schema
export const sortInputSchema = z
  .object({
    field: z.string().min(1, 'Field is required'),
    order: z.enum(['ASC', 'DESC']),
  })
  .optional();

// Validation middleware function
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new ValidationError(`Validation error: ${errorMessages}`);
    }
    throw error;
  }
};
