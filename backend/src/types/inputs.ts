// Input types for better type safety
export interface EmployeeInput {
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  email: string;
  department?: string;
  position?: string;
  salary?: number;
}

export interface EmployeeUpdateInput extends Partial<EmployeeInput> {}
