import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/register-login" replace />;
  }

  return children;
};

export default PrivateRoute;
