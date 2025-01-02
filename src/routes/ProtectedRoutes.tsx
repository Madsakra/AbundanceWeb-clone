import { useAuth } from '@/contextProvider';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // Get loading state from context

  if (loading) {
    // Optionally, show a loading spinner or placeholder while waiting
    return <div>Loading...</div>;
  }

  // If user is not authenticated, navigate to login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
