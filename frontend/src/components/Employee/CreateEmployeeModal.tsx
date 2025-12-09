import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { useMutation } from '@apollo/client/react';
import { toast } from 'react-hot-toast';
import { ADD_EMPLOYEE } from '../../graphql/mutations';
import { GET_EMPLOYEES } from '../../graphql/queries';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { employeeSchema, EmployeeFormValues } from '../../utils/validation';

interface CreateEmployeeModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({ onClose, onSuccess }) => {
  const [addEmployee, { loading }] = useMutation(ADD_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
    onCompleted: () => {
      toast.success('Employee created successfully!');
      onSuccess?.();
      onClose();
    },
    onError: error => {
      toast.error(error.message || 'Failed to create employee');
    },
  });

  const initialValues: EmployeeFormValues = {
    name: '',
    age: 18,
    class: '',
    subjects: [''],
    attendance: 0,
    email: '',
    department: '',
    position: '',
    salary: undefined,
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-employee-title"
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Responsive */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
          <h2
            id="create-employee-title"
            className="text-lg sm:text-xl lg:text-2xl font-bold text-white"
          >
            Create New Employee
          </h2>
          <button
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-2xl sm:text-3xl w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(employeeSchema)}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={async values => {
            const input: any = {
              name: values.name,
              age: values.age,
              class: values.class,
              subjects: values.subjects.filter(s => s.trim() !== ''),
              attendance: values.attendance,
              email: values.email,
            };

            if (values.department) input.department = values.department;
            if (values.position) input.position = values.position;
            if (values.salary) input.salary = values.salary;

            await addEmployee({ variables: { input } });
          }}
        >
          {({ values, isSubmitting, touched, errors }) => (
            <Form className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Form Fields - Responsive grid: 1 column on mobile, 2 on tablet+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label
                    htmlFor="create-name"
                    className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                  >
                    Name *
                  </label>
                  <Field
                    id="create-name"
                    name="name"
                    type="text"
                    className={`
                      w-full px-3 sm:px-4 py-2
                      border-2 rounded-lg
                      text-sm sm:text-base
                      focus:outline-none focus:ring-2 focus:ring-offset-1
                      transition-colors
                      ${
                        touched.name && errors.name
                          ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }
                    `}
                    placeholder="Enter employee name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="mt-1 text-xs sm:text-sm text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <Field
                    name="email"
                    type="email"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      touched.email && errors.email
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="employee@ultraship.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                  <Field
                    name="age"
                    type="number"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      touched.age && errors.age
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="18"
                  />
                  <ErrorMessage name="age" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Class *</label>
                  <Field
                    name="class"
                    type="text"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      touched.class && errors.class
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Engineering, Marketing, etc."
                  />
                  <ErrorMessage
                    name="class"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <Field
                    name="department"
                    type="text"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      touched.department && errors.department
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="IT, Marketing, etc."
                  />
                  <ErrorMessage
                    name="department"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                  <Field
                    name="position"
                    type="text"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      touched.position && errors.position
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="Software Engineer, Manager, etc."
                  />
                  <ErrorMessage
                    name="position"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attendance *
                  </label>
                  <Field
                    name="attendance"
                    type="number"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      touched.attendance && errors.attendance
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="0-100"
                  />
                  <ErrorMessage
                    name="attendance"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Salary</label>
                  <Field
                    name="salary"
                    type="number"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      touched.salary && errors.salary
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    placeholder="50000"
                  />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subjects * (at least one required)
                </label>
                <FieldArray name="subjects">
                  {({ push, remove, form }) => (
                    <div className="space-y-2">
                      {values.subjects.map((_, index) => (
                        <div key={index} className="flex gap-2">
                          <Field
                            name={`subjects.${index}`}
                            type="text"
                            className={`flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                              form.touched.subjects && form.errors.subjects
                                ? 'border-red-500 focus:border-red-600'
                                : 'border-gray-300 focus:border-primary-500'
                            }`}
                            placeholder={`Subject ${index + 1}`}
                          />
                          {values.subjects.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push('')}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors text-sm"
                      >
                        + Add Subject
                      </button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="subjects"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    w-full sm:w-auto
                    px-4 sm:px-6
                    py-2 sm:py-2.5
                    bg-gray-100 hover:bg-gray-200
                    border border-gray-300
                    text-gray-700 rounded-lg
                    text-sm sm:text-base font-semibold
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                    transform hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                  "
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="
                    w-full sm:w-auto
                    px-4 sm:px-6
                    py-2 sm:py-2.5
                    bg-gradient-to-r from-primary-500 to-secondary-600
                    hover:from-primary-600 hover:to-secondary-700
                    text-white rounded-lg
                    text-sm sm:text-base font-semibold
                    transition-all duration-200
                    shadow-md hover:shadow-lg
                    transform hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center justify-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  "
                >
                  {loading || isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>➕</span>
                      <span>Create Employee</span>
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
