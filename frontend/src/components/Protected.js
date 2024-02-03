import React from "react";
import { Navigate } from "react-router-dom";

const Protected = ({ isAuthenticated, children }) => {
  if (isAuthenticated) return children;
  else return <Navigate to={"/"} />;
};

export default Protected;
