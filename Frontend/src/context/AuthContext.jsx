import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // This would typically be fetched from your backend using the JWT token
  const [currentUser, setCurrentUser] = useState({
    id: '65fa1c2b8a4f2c001f3e4a99',
    name: 'Dur e Fishan',
    role: 'Frontend Dev',
    email: 'durefishan@example.com',
    avatarColor: 'bg-indigo-900' // Can be dynamic based on user preferences
  });

  // Example function you will use later when building the "Edit Profile" feature
  const updateUserProfile = (updatedData) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};