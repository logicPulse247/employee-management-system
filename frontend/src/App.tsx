import React, { Suspense, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { client, setNavigateFunction } from './apollo/client';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Spinner } from './components/Loading/Spinner';
import Login from './components/Auth/Login';
import EmployeesPage from './pages/EmployeesPage';
import ComingSoonPage from './pages/ComingSoonPage';
import { ROUTES } from './constants';
import { validateAndCleanToken } from './utils/auth';
import './App.css';

const NavigationSetup: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFunction((path: string) => {
      navigate(path, { replace: true });
    });
  }, [navigate]);

  return null;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Use centralized token validation
  const hasValidToken = validateAndCleanToken();
  const storedUser = localStorage.getItem('user');
  const hasStoredAuth = hasValidToken && !!storedUser;

  const isAuth = hasStoredAuth || isAuthenticated();

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <Router>
          <AuthProvider>
            <NavigationSetup />
            <div className="App">
              <Toaster
                position="top-right"
                containerStyle={{
                  top: '1rem',
                  right: '1rem',
                }}
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    fontSize: '0.875rem',
                    padding: '0.75rem 1rem',
                    maxWidth: '90vw',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <Suspense fallback={<Spinner size="lg" className="mx-auto mt-20" />}>
                <Routes>
                  <Route path={ROUTES.LOGIN} element={<Login />} />
                  <Route
                    path={ROUTES.EMPLOYEES}
                    element={
                      <PrivateRoute>
                        <EmployeesPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.REPORTS_ATTENDANCE}
                    element={
                      <PrivateRoute>
                        <ComingSoonPage title="Attendance Report" description="Attendance reporting feature is coming soon." />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.REPORTS_PERFORMANCE}
                    element={
                      <PrivateRoute>
                        <ComingSoonPage title="Performance Report" description="Performance reporting feature is coming soon." />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.REPORTS}
                    element={
                      <PrivateRoute>
                        <ComingSoonPage title="Reports" description="Reporting features are coming soon." />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={ROUTES.SETTINGS}
                    element={
                      <PrivateRoute>
                        <ComingSoonPage title="Settings" description="Settings page is coming soon." />
                      </PrivateRoute>
                    }
                  />
                  <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.EMPLOYEES} replace />} />
                </Routes>
              </Suspense>
            </div>
          </AuthProvider>
        </Router>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;
