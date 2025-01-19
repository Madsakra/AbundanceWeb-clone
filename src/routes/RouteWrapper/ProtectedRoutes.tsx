import { useAuth } from '@/contextProvider';

import VerificationAlert from '@/customizedComponents/VerificationAlert';
import PermissionDenied from '@/PermissionDenied';
import { ProtectedRouteProps } from '@/vite-env';
import { sendEmailVerification } from 'firebase/auth';
import { Navigate } from 'react-router-dom';




const ProtectedRoute = ({allowedRoles,children}:ProtectedRouteProps) => {

  const { user, loading, logout,accountDetails} = useAuth(); // Get loading state from context
  const mainMessage = "Verification Needed";
  const subMessage = "Please go to your email account and verify your abundance account. Alternatively, you can click on the link below to resend it";

  const reSendEmail = async ()=>{
    if (user)
    {
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

 
  if (loading) {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
      <span className="loading loading-infinity loading-lg"></span>
      </div>
    )
  }


  if (!user) {
      return <Navigate to="/login" replace />; 
    }


  if (!user.emailVerified && (accountDetails?.role === "user") )
  {


        return (<VerificationAlert
          logOut={logout}
          resendEmail={reSendEmail} 
          mainMessage={mainMessage}
          subMessage={subMessage}
          />)
  }
    


      


   if (!allowedRoles?.includes(accountDetails?.role))
  {
    return <PermissionDenied/>; 
  }
  

  
  
  return (

    <>
    {children}
    </>
  
  )
    

    



  



  // If user is not authenticated, navigate to login
};

export default ProtectedRoute;
