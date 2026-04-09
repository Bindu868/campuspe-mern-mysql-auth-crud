import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-lg font-semibold">Loading...</div>;
  }

  return isAuthenticated ? <Navigate replace to="/dashboard" /> : children;
};

export default PublicRoute;
