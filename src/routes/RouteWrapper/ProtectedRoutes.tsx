import { useAuth } from '@/contextProvider';
import PermissionDenied from '@/PermissionDenied';
import { ProtectedRouteProps } from '@/vite-env';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = ({allowedRoles}:ProtectedRouteProps) => {
  const { user, loading } = useAuth(); // Get loading state from context

  console.log(user?.role);
  if (loading) {
    // Optionally, show a loading spinner or placeholder while waiting
    return <div>Loading...</div>;
  }

  else if (user === null || user &&  !allowedRoles?.includes(user.role))
  {
      return <PermissionDenied/>
  };

  // If user is not authenticated, navigate to login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
