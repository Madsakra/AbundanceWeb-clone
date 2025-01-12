import { useAuth } from '@/contextProvider';
import VerificationAlert from '@/customizedComponents/VerificationAlert';
// import PermissionDenied from '@/PermissionDenied';
import { ProtectedRouteProps } from '@/vite-env';
import { sendEmailVerification } from 'firebase/auth';

import { Outlet, Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({allowedRoles}:ProtectedRouteProps) => {


  const { user, loading, logout } = useAuth(); // Get loading state from context

  const mainMessage = "Verification Needed";
  const subMessage = "Please go to your email account and verify your abundance account. Alternatively, you can click on the link below to resend it";
  let navigate = useNavigate();

  const reSendEmail = async ()=>{
    if (user)
    {
      console.log(allowedRoles)
      try{
        await sendEmailVerification(user);
        alert("Email Resent");
      }

      catch(err)
      {
        alert(err);
      }

    }
    
  }

  const handleLogout = ()=>{
    logout();
    navigate("/login")
  }

  if (loading) {
    // Optionally, show a loading spinner or placeholder while waiting
    return <div>Loading...</div>;
  }

 

  if (!(user?.emailVerified))
  {
    return (

      <VerificationAlert
      logOut={handleLogout}
      resendEmail={reSendEmail} 
      mainMessage={mainMessage}
      subMessage={subMessage}
      />

    )          
  }






  // else if (user === null || user &&  !allowedRoles?.includes(user.role))
  // {
  //     return <PermissionDenied/>
  // };

  // If user is not authenticated, navigate to login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
