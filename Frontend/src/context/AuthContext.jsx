import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const MOCK_USERS = {
  ceo: {
    id: '65fa1c2b8a4f2c001f3e4a01',
    name: 'Sarah Johnson',
    role: 'CEO',
    userRole: 'CEO',
    email: 'sarah.johnson@company.com',
    avatarColor: 'bg-red-600',
    department: 'Executive',
    joinedDate: '2020-01-15'
  },
  manager: {
    id: '65fa1c2b8a4f2c001f3e4a02',
    name: 'Mike Chen',
    role: 'Project Manager',
    userRole: 'Manager',
    email: 'mike.chen@company.com',
    avatarColor: 'bg-blue-600',
    department: 'Product',
    team: 'Backend Team',
    joinedDate: '2021-03-20'
  },
  senior: {
    id: '65fa1c2b8a4f2c001f3e4a03',
    name: 'Emily Rodriguez',
    role: 'Senior Developer',
    userRole: 'Senior',
    email: 'emily.rodriguez@company.com',
    avatarColor: 'bg-green-600',
    department: 'Engineering',
    team: 'Frontend Team',
    joinedDate: '2021-06-10'
  },
  employee: {
    id: '65fa1c2b8a4f2c001f3e4a04',
    name: 'Dur e Fishan',
    role: 'Frontend Developer',
    userRole: 'Employee',
    email: 'durefishan@example.com',
    avatarColor: 'bg-indigo-900',
    department: 'Engineering',
    team: 'Frontend Team',
    joinedDate: '2023-01-15'
  }
};

export const AuthProvider = ({ children }) => {
  // For demo: defaults to employee, can be switched via switchRole
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.employee);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Switch between different user roles for demo/testing
  const switchRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) {
      setCurrentUser(MOCK_USERS[roleKey]);
      return true;
    }
    return false;
  };

  // Update user profile
  const updateUserProfile = (updatedData) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Login function (for future use)
  const login = (credentials) => {
    setIsAuthenticated(true);
    // In production, validate credentials here
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      updateUserProfile, 
      switchRole,
      logout,
      login,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};