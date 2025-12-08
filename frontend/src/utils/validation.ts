import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  username: z
    .string({ required_error: 'Please enter your username or email' })
    .min(1, 'Please enter your username or email')
    .trim(),
  password: z
    .string({ required_error: 'Please enter your password' })
    .min(1, 'Please enter your password'),
});

// Register validation schema
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'employee']).optional(),
});

// Employee form validation schema
export const employeeSchema = z.object({
  name: z.string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .refine((val) => val.length >= 2, 'Name must be at least 2 characters long')
    .refine((val) => val.length <= 100, 'Name must be less than 100 characters'),
  age: z.number({
    required_error: 'Age is required',
    invalid_type_error: 'Age must be a number',
  })
    .int('Age must be a whole number')
    .min(18, 'Employee must be at least 18 years old')
    .max(100, 'Age must be less than 100 years'),
  class: z.string({ required_error: 'Class is required' })
    .min(1, 'Class is required')
    .max(50, 'Class name must be less than 50 characters'),
  subjects: z.array(z.string().min(1, 'Subject name cannot be empty'))
    .min(1, 'At least one subject is required')
    .refine(
      (arr) => arr.some((s) => s && s.trim().length > 0),
      'At least one subject is required'
    ),
  attendance: z.number({
    required_error: 'Attendance is required',
    invalid_type_error: 'Attendance must be a number',
  })
    .min(0, 'Attendance percentage cannot be negative')
    .max(100, 'Attendance percentage cannot exceed 100%'),
  email: z.string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  department: z.string().max(100, 'Department name must be less than 100 characters').optional().or(z.literal('')),
  position: z.string().max(100, 'Position title must be less than 100 characters').optional().or(z.literal('')),
  salary: z.number().min(0, 'Salary cannot be negative').optional().or(z.literal('')),
});

// Employee update validation schema (for editing existing employees)
export const employeeUpdateSchema = z.object({
  name: z.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' })
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  age: z.number({
    required_error: 'Age is required',
    invalid_type_error: 'Age must be a number',
  })
    .int({ message: 'Age must be a whole number' })
    .min(18, { message: 'Employee must be at least 18 years old' })
    .max(150, { message: 'Age must be less than 150 years' }),
  class: z.string({ required_error: 'Class is required', invalid_type_error: 'Class must be a string' })
    .min(1, { message: 'Class is required' })
    .max(50, { message: 'Class name must be less than 50 characters' }),
  subjects: z.array(z.string().min(1, 'Subject name cannot be empty'))
    .min(1, 'At least one subject is required')
    .refine(
      (arr) => arr.some((s) => s && s.trim().length > 0),
      'At least one subject is required'
    ),
  attendance: z.number({
    required_error: 'Attendance is required',
    invalid_type_error: 'Attendance must be a number',
  })
    .min(0, { message: 'Attendance percentage cannot be negative' })
    .max(100, { message: 'Attendance percentage cannot exceed 100%' }),
  email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' })
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  department: z.string().optional(),
  position: z.string().optional(),
  salary: z.number().min(0, { message: 'Salary cannot be negative' }).optional(),
});

// Environment variable validation schema
export const envSchema = z.object({
  VITE_GRAPHQL_URL: z.string().url('VITE_GRAPHQL_URL must be a valid URL'),
  VITE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Type exports
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type EmployeeFormValues = z.infer<typeof employeeSchema>;
export type EmployeeUpdateFormValues = z.infer<typeof employeeUpdateSchema>;
export type EnvValues = z.infer<typeof envSchema>;

