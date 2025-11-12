import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import HRDashboard from './pages/HRDashboard';
import Attendance from './pages/employee/Attendance.jsx';
import Leave from './pages/employee/Leave.jsx';
import ManagerTimesheets from './pages/Manager/ManagerTimesheets.jsx';
import ManagerSchedules from './pages/Manager/ManagerSchedules.jsx';
import HRPayroll from './pages/hr/HRPayroll.jsx';
import HREmployees from './pages/hr/HREmployees.jsx';

// ✅ PrivateRoute wrapper for authentication + role checking
function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  
  // ✅ Convert both to lowercase for case-insensitive comparison
  const userRole = user.role?.toLowerCase();
  const allowedRoles = roles.map(role => role.toLowerCase());
  
  if (roles && !allowedRoles.includes(userRole)) return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 🔐 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 👷 Employee Routes */}
        <Route
          path="/employee/attendance"
          element={
            <PrivateRoute roles={['Employee']}>
              <Attendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/leaves"
          element={
            <PrivateRoute roles={['Employee']}>
              <Leave />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute roles={['Employee']}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        {/* 👨‍💼 Manager Routes */}
        <Route
          path="/manager"
          element={<Navigate to="/manager/timesheets" />}
        />
        <Route
          path="/manager/timesheets"
          element={
            <PrivateRoute roles={['Manager']}>
              <ManagerTimesheets />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/schedules"
          element={
            <PrivateRoute roles={['Manager']}>
              <ManagerSchedules />
            </PrivateRoute>
          }
        />

        {/* 👩‍💼 HR Routes */}
        <Route
          path="/hr/employees"
          element={
            <PrivateRoute roles={['HR']}>
              <HREmployees />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/payroll"
          element={
            <PrivateRoute roles={['HR']}>
              <HRPayroll />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}