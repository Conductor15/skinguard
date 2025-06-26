import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("access_token");

  let type;
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    type = parsedUser.userType;
  }

  let patient ;
  if(type === "patient"){
    patient = true;
  }else{
    patient = false;
  }

  if (!token || !patient) {
    return <Navigate to="/register-login" replace />;
  }

  return children;
};

export default PrivateRoute;
