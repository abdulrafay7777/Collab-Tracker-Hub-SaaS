import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/Toast';

// CEO Dashboard pages
import CEODashboard from './pages/dashboards/ceo/CEODashboard';
import UserManagement from './pages/dashboards/ceo/UserManagement';
import LiveActivity from './pages/dashboards/ceo/LiveActivity';
import Analytics from './pages/dashboards/ceo/Analytics';
import SystemPerformance from './pages/dashboards/ceo/SystemPerformance';

// Manager Dashboard
import ManagerDashboard from './pages/dashboards/manager/ManagerDashboard';
import ManagerTeam from './pages/dashboards/manager/ManagerTeam';
import ManagerPerformance from './pages/dashboards/manager/ManagerPerformance';
import ManagerTasks from './pages/dashboards/manager/ManagerTasks';
import ManagerReports from './pages/dashboards/manager/ManagerReports';

// Senior Dashboard
import SeniorDashboard from './pages/dashboards/senior/SeniorDashboard';

// Employee Dashboard
import EmployeeDashboard from './pages/dashboards/employee/EmployeeDashboard';
import EmployeeTasks from './pages/dashboards/employee/EmployeeTasks';
import EmployeeWorkSessions from './pages/dashboards/employee/EmployeeWorkSessions';
import EmployeeProgress from './pages/dashboards/employee/EmployeeProgress';
import EmployeeFlags from './pages/dashboards/employee/EmployeeFlags';

/**
 * App Component - Main Router Setup
 * 
 * CONCEPT: React Router v7 Implementation
 * 
 * ARCHITECTURE:
 * 1. BrowserRouter wraps all routes
 * 2. RootLayout provides header/sidebar for all authenticated pages
 * 3. ProtectedRoute validates user role before rendering content
 * 4. Nested routes organize dashboards by role
 * 5. Each role has its own route hierarchy
 * 
 * ROUTE STRUCTURE:
 * /dashboards/
 *   ├── ceo/
 *   │   ├── (main)
 *   │   ├── users
 *   │   ├── activity
 *   │   ├── analytics
 *   │   └── performance
 *   ├── manager/
 *   ├── senior/
 *   └── employee/
 * 
 * PATTERN: Redirect to employee dashboard by default
 * (In production, redirect to user's actual role dashboard)
 */

function App() {
  return (
    <ToastProvider>
      <Toast />
      <Router>
      <Routes>
        {/* Default redirect to employee dashboard */}
        <Route path="/" element={<Navigate to="/dashboards/employee" replace />} />

        {/* ============================================================ */}
        {/* CEO DASHBOARD ROUTES */}
        {/* ============================================================ */}
        <Route path="/dashboards/ceo" element={
          <ProtectedRoute 
            allowedRoles={['CEO']}
            element={
              <RootLayout>
                <CEODashboard />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/ceo/users" element={
          <ProtectedRoute 
            allowedRoles={['CEO']}
            element={
              <RootLayout>
                <UserManagement />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/ceo/activity" element={
          <ProtectedRoute 
            allowedRoles={['CEO']}
            element={
              <RootLayout>
                <LiveActivity />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/ceo/analytics" element={
          <ProtectedRoute 
            allowedRoles={['CEO']}
            element={
              <RootLayout>
                <Analytics />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/ceo/performance" element={
          <ProtectedRoute 
            allowedRoles={['CEO']}
            element={
              <RootLayout>
                <SystemPerformance />
              </RootLayout>
            }
          />
        } />

        {/* ============================================================ */}
        {/* MANAGER DASHBOARD ROUTES */}
        {/* ============================================================ */}
        <Route path="/dashboards/manager" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager']}
            element={
              <RootLayout>
                <ManagerDashboard />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/manager/team" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager']}
            element={
              <RootLayout>
                <ManagerTeam />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/manager/performance" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager']}
            element={
              <RootLayout>
                <ManagerPerformance />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/manager/tasks" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager']}
            element={
              <RootLayout>
                <ManagerTasks />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/manager/reports" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager']}
            element={
              <RootLayout>
                <ManagerReports />
              </RootLayout>
            }
          />
        } />

        {/* ============================================================ */}
        {/* SENIOR DASHBOARD ROUTES */}
        {/* ============================================================ */}
        <Route path="/dashboards/senior" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager', 'Senior']}
            element={
              <RootLayout>
                <SeniorDashboard />
              </RootLayout>
            }
          />
        } />

        {/* ============================================================ */}
        {/* EMPLOYEE DASHBOARD ROUTES */}
        {/* ============================================================ */}
        <Route path="/dashboards/employee" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager', 'Senior', 'Employee']}
            element={
              <RootLayout>
                <EmployeeDashboard />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/employee/tasks" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager', 'Senior', 'Employee']}
            element={
              <RootLayout>
                <EmployeeTasks />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/employee/sessions" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager', 'Senior', 'Employee']}
            element={
              <RootLayout>
                <EmployeeWorkSessions />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/employee/progress" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager', 'Senior', 'Employee']}
            element={
              <RootLayout>
                <EmployeeProgress />
              </RootLayout>
            }
          />
        } />

        <Route path="/dashboards/employee/flags" element={
          <ProtectedRoute 
            allowedRoles={['CEO', 'Manager', 'Senior', 'Employee']}
            element={
              <RootLayout>
                <EmployeeFlags />
              </RootLayout>
            }
          />
        } />

        {/* 404 - Catch all */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-[#0a0514]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
              <p className="text-gray-400">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;