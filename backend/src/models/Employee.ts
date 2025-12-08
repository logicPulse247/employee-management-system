import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  email: string;
  department?: string;
  position?: string;
  salary?: number;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },
    class: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subjects: [
      {
        type: String,
        trim: true,
      },
    ],
    attendance: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    department: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
      min: 0,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
employeeSchema.index({ name: 1, class: 1 });
employeeSchema.index({ createdAt: -1 });
// Additional indexes for frequently queried fields
employeeSchema.index({ department: 1 });
employeeSchema.index({ position: 1 });
employeeSchema.index({ salary: 1 });
// Compound index for common filter combinations
employeeSchema.index({ department: 1, class: 1 });

export const Employee: Model<IEmployee> = mongoose.model<IEmployee>('Employee', employeeSchema);
