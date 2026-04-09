import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-lg font-semibold">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate replace to="/login" />;
};

export default ProtectedRoute;
