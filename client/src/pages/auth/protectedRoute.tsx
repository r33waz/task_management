import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode; 
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("accessToken"); 

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
