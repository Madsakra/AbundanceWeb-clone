
import './index.css'

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/Public_Routes/root';
import ErrorPage from './routes/ErrorPage';
import Home from './routes/Public_Routes/Home';
import Login from './routes/Public_Routes/Login';
import Register from './routes/Public_Routes/Register';
import ForgetPassword from './routes/Public_Routes/ForgetPassword';

import '@fontsource/poppins';
import Dashboard from './routes/Authenticated/Dashboard';
import NutritionistSubmission from './routes/Public_Routes/NutritionistSubmission';



import { AuthProvider } from './contextProvider';
import ProtectedRoute from './routes/RouteWrapper/ProtectedRoutes';
import ManageClients from './routes/Authenticated/Nutritionist/ManageClients';
import UserAccounts from './routes/Authenticated/Admin/UserAccounts';






const router = createBrowserRouter([
  {

    

    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      // PUBLIC ROUTES
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/nutritionist-submission",
        element: <NutritionistSubmission />,
      },

      // PROTECTED ROUTE WRAPPER
      {
        path: "/general",
        element: <ProtectedRoute allowedRoles={["free_user","premium_user","admin","nutritionist"]} />,
        children: [
          {
            path: "dashboard", 
            element: <Dashboard />,  // This should render if verified
          },
        ],
      },

      {
        path: "/nutri",
        element: <ProtectedRoute allowedRoles={["nutritionist"]} />,
        children: [
          {
            path: "manageClients", 
            element: <ManageClients/>,  // This should render if verified
          },
        ],
      },
     
      {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "userAccounts", 
            element: <UserAccounts/>,  // This should render if verified
          },
        ],
      },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
