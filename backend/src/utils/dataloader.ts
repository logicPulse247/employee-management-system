import DataLoader from 'dataloader';
import { Employee, IEmployee } from '../models/Employee';
import { Types } from 'mongoose';

// Create a DataLoader for batch loading employees
export const createEmployeeLoader = (): DataLoader<Types.ObjectId, IEmployee | null> => {
  return new DataLoader(
    async (employeeIds: readonly Types.ObjectId[]): Promise<(IEmployee | null)[]> => {
      const employees = await Employee.find({
        _id: { $in: employeeIds },
      });

      const employeeMap: { [key: string]: IEmployee } = {};
      employees.forEach(employee => {
        employeeMap[employee._id.toString()] = employee;
      });

      return employeeIds.map(id => employeeMap[id.toString()] || null);
    }
  );
};
