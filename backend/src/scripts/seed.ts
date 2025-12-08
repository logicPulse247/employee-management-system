// Ensure environment variables are loaded before importing config-dependent modules
import dotenv from 'dotenv';
import { join } from 'path';

// Load .env file from the backend directory (process.cwd() when running from backend/)
const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

import { connectDB } from '../database';
import { Employee } from '../models/Employee';
import { User } from '../models/User';
import { USER_ROLES } from '../constants';
import { logger } from '../utils/logger';

const seedDatabase = async () => {
  try {
    await connectDB();
    logger.info('✅ Connected to MongoDB');

    // Clear existing data
    await Employee.deleteMany({});
    await User.deleteMany({});
    logger.info('✅ Cleared existing data');

    // Create default users
    const adminUser = new User({
      username: 'admin',
      email: 'admin@ultraship.com',
      password: 'admin123',
      role: USER_ROLES.ADMIN,
    });

    const employeeUser = new User({
      username: 'employee',
      email: 'employee@ultraship.com',
      password: 'emp123',
      role: USER_ROLES.EMPLOYEE,
    });

    await adminUser.save();
    await employeeUser.save();
    console.log('✅ Created default users');

    // Create sample employees
    const sampleEmployees = [
      {
        name: 'John Smith',
        age: 32,
        class: 'Engineering',
        subjects: ['Mathematics', 'Physics', 'Computer Science'],
        attendance: 95,
        email: 'john.smith@ultraship.com',
        department: 'IT',
        position: 'Senior Developer',
        salary: 95000,
      },
      {
        name: 'Sarah Johnson',
        age: 28,
        class: 'Marketing',
        subjects: ['Business', 'Communication', 'Design'],
        attendance: 88,
        email: 'sarah.johnson@ultraship.com',
        department: 'Marketing',
        position: 'Marketing Manager',
        salary: 75000,
      },
      {
        name: 'Michael Chen',
        age: 35,
        class: 'Finance',
        subjects: ['Accounting', 'Economics', 'Statistics'],
        attendance: 92,
        email: 'michael.chen@ultraship.com',
        department: 'Finance',
        position: 'Financial Analyst',
        salary: 82000,
      },
      {
        name: 'Emily Davis',
        age: 26,
        class: 'HR',
        subjects: ['Psychology', 'Management', 'Communication'],
        attendance: 90,
        email: 'emily.davis@ultraship.com',
        department: 'Human Resources',
        position: 'HR Specialist',
        salary: 65000,
      },
      {
        name: 'David Wilson',
        age: 40,
        class: 'Engineering',
        subjects: ['Mathematics', 'Physics', 'Engineering'],
        attendance: 98,
        email: 'david.wilson@ultraship.com',
        department: 'IT',
        position: 'Tech Lead',
        salary: 120000,
      },
      {
        name: 'Lisa Anderson',
        age: 29,
        class: 'Sales',
        subjects: ['Business', 'Communication', 'Negotiation'],
        attendance: 85,
        email: 'lisa.anderson@ultraship.com',
        department: 'Sales',
        position: 'Sales Manager',
        salary: 70000,
      },
      {
        name: 'Robert Brown',
        age: 33,
        class: 'Operations',
        subjects: ['Management', 'Logistics', 'Operations'],
        attendance: 87,
        email: 'robert.brown@ultraship.com',
        department: 'Operations',
        position: 'Operations Manager',
        salary: 88000,
      },
      {
        name: 'Jennifer Martinez',
        age: 27,
        class: 'Design',
        subjects: ['Design', 'Art', 'User Experience'],
        attendance: 91,
        email: 'jennifer.martinez@ultraship.com',
        department: 'Design',
        position: 'UI/UX Designer',
        salary: 72000,
      },
      {
        name: 'James Taylor',
        age: 31,
        class: 'Engineering',
        subjects: ['Computer Science', 'Software Engineering', 'Algorithms'],
        attendance: 94,
        email: 'james.taylor@ultraship.com',
        department: 'IT',
        position: 'Software Engineer',
        salary: 85000,
      },
      {
        name: 'Amanda White',
        age: 25,
        class: 'Customer Service',
        subjects: ['Communication', 'Psychology', 'Service'],
        attendance: 89,
        email: 'amanda.white@ultraship.com',
        department: 'Customer Service',
        position: 'Customer Support Specialist',
        salary: 55000,
      },
      {
        name: 'Christopher Lee',
        age: 36,
        class: 'Engineering',
        subjects: ['Mathematics', 'Physics', 'Engineering Design'],
        attendance: 96,
        email: 'christopher.lee@ultraship.com',
        department: 'IT',
        position: 'Senior Software Architect',
        salary: 135000,
      },
      {
        name: 'Maria Garcia',
        age: 30,
        class: 'Marketing',
        subjects: ['Digital Marketing', 'Analytics', 'Content Strategy'],
        attendance: 93,
        email: 'maria.garcia@ultraship.com',
        department: 'Marketing',
        position: 'Digital Marketing Manager',
        salary: 88000,
      },
      {
        name: 'Thomas Anderson',
        age: 38,
        class: 'Finance',
        subjects: ['Financial Planning', 'Risk Management', 'Investment'],
        attendance: 91,
        email: 'thomas.anderson@ultraship.com',
        department: 'Finance',
        position: 'Senior Financial Analyst',
        salary: 95000,
      },
      {
        name: 'Jessica Kim',
        age: 24,
        class: 'Design',
        subjects: ['Graphic Design', 'Branding', 'Visual Communication'],
        attendance: 86,
        email: 'jessica.kim@ultraship.com',
        department: 'Design',
        position: 'Graphic Designer',
        salary: 60000,
      },
      {
        name: 'Daniel Rodriguez',
        age: 34,
        class: 'Sales',
        subjects: ['Sales Strategy', 'Customer Relations', 'Negotiation'],
        attendance: 92,
        email: 'daniel.rodriguez@ultraship.com',
        department: 'Sales',
        position: 'Senior Sales Executive',
        salary: 92000,
      },
      {
        name: 'Sophia Williams',
        age: 29,
        class: 'HR',
        subjects: ['Talent Acquisition', 'Employee Relations', 'Training'],
        attendance: 88,
        email: 'sophia.williams@ultraship.com',
        department: 'Human Resources',
        position: 'HR Manager',
        salary: 78000,
      },
      {
        name: 'Ryan Murphy',
        age: 27,
        class: 'Operations',
        subjects: ['Supply Chain', 'Process Optimization', 'Quality Control'],
        attendance: 90,
        email: 'ryan.murphy@ultraship.com',
        department: 'Operations',
        position: 'Operations Analyst',
        salary: 68000,
      },
      {
        name: 'Olivia Thompson',
        age: 31,
        class: 'Customer Service',
        subjects: ['Customer Support', 'Problem Solving', 'Communication'],
        attendance: 87,
        email: 'olivia.thompson@ultraship.com',
        department: 'Customer Service',
        position: 'Customer Service Manager',
        salary: 72000,
      },
      {
        name: 'William Davis',
        age: 39,
        class: 'Engineering',
        subjects: ['System Architecture', 'Cloud Computing', 'DevOps'],
        attendance: 97,
        email: 'william.davis@ultraship.com',
        department: 'IT',
        position: 'DevOps Engineer',
        salary: 110000,
      },
      {
        name: 'Emma Wilson',
        age: 26,
        class: 'Marketing',
        subjects: ['Social Media', 'Content Creation', 'SEO'],
        attendance: 84,
        email: 'emma.wilson@ultraship.com',
        department: 'Marketing',
        position: 'Social Media Specialist',
        salary: 58000,
      },
      {
        name: 'Alexander Brown',
        age: 33,
        class: 'Finance',
        subjects: ['Accounting', 'Tax Planning', 'Auditing'],
        attendance: 94,
        email: 'alexander.brown@ultraship.com',
        department: 'Finance',
        position: 'Accountant',
        salary: 70000,
      },
    ];

    await Employee.insertMany(sampleEmployees);
    logger.info(`✅ Created ${sampleEmployees.length} sample employees`);

    logger.info('\n🎉 Database seeded successfully!');
    logger.info('\nDefault credentials:');
    logger.info('Admin - Username: admin, Password: admin123');
    logger.info('Employee - Username: employee, Password: emp123');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
