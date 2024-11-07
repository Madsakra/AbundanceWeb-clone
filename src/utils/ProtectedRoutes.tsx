import { Outlet,Navigate } from "react-router-dom";



// MAKE USE OF USECONTEXT LATER
// Example authentication function (replace with your actual auth logic)
const useAuth = () => {
    const isAuthenticated = false; // Change this to your auth logic
    return isAuthenticated;
  };



const ProtectedRoutes = ()=>{
    const user = useAuth();
    return user ? <Outlet/> : <Navigate to='/login'/>
}

export default ProtectedRoutes;