import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Workspace from './pages/Workspace';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/workspace" replace />} />
          <Route path="/workspace" element={
            <DashboardLayout>
              <Workspace />
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;