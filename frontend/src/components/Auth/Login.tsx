import React from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-hot-toast';
import { LOGIN } from '../../graphql/mutations';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, LoginFormValues } from '../../utils/validation';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { ROUTES } from '../../constants';
import { User } from '../../types';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginMutation, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const result = await loginMutation({
        variables: { username: values.username, password: values.password }
      });

      const data = result.data as { login?: { token: string; user: { id: string; username: string; email: string; role: 'admin' | 'employee' } } } | null | undefined;

      if (data?.login?.token && data?.login?.user) {
        login(data.login.token, data.login.user as User);
        toast.success('Login successful!');
        navigate(ROUTES.EMPLOYEES, { replace: true });
      } else {
        toast.error('Invalid login response');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 px-3 sm:px-4 py-4 sm:py-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">Sign in to continue</p>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={toFormikValidationSchema(loginSchema)}
          onSubmit={async (values, { setFieldError }) => {
            try {
              await handleSubmit(values);
            } catch (error: any) {
              setFieldError('password', error.message || 'Login failed');
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  Username or Email
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  className={`
                    w-full px-3 sm:px-4 py-2.5 sm:py-3
                    rounded-lg border-2
                    text-sm sm:text-base
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${
                      errors.username && touched.username
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }
                  `}
                  placeholder="Enter your username or email"
                />
                <ErrorMessage name="username" component="div" className="mt-1 text-xs sm:text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`
                    w-full px-3 sm:px-4 py-2.5 sm:py-3
                    rounded-lg border-2
                    text-sm sm:text-base
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${
                      errors.password && touched.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }
                  `}
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="mt-1 text-xs sm:text-sm text-red-600" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="
                  w-full
                  bg-gradient-to-r from-primary-500 to-secondary-600
                  text-white py-2.5 sm:py-3
                  rounded-lg
                  text-sm sm:text-base lg:text-lg font-semibold
                  hover:from-primary-600 hover:to-secondary-700
                  transform hover:scale-[1.02]
                  transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                  shadow-lg hover:shadow-xl
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                "
              >
                {isSubmitting || loading ? 'Signing in...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500 px-2">
            Demo credentials: admin/admin123 or employee/emp123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
