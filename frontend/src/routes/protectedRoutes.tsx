

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth'; 

interface Props {
  role: string;
  children: React.ReactNode;
}

const RoleProtectedRoute: React.FC<Props> = ({ role, children }) => {
  const { token, role: userRole } = useAuth();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the role does not match, redirect to login
  if (userRole !== role) {
    return <Navigate to="/login" />;
  }
  console.log("TOKEN:", token);
  console.log("ROLE:", userRole);
  
  // Render children (protected route) if the role matches
  return <>{children}</>;
};

export default RoleProtectedRoute;


