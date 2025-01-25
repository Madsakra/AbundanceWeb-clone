
import './index.css'
import "cally";
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
import Dashboard from './routes/Authenticated/User/Dashboard';
import NutritionistSubmission from './routes/Public_Routes/NutritionistSubmission';



import { AuthProvider } from './contextProvider';
import ProtectedRoute from './routes/RouteWrapper/ProtectedRoutes';
import ManageClients from './routes/Authenticated/Nutritionist/ManageClients';
import UserAccounts from './routes/Authenticated/Admin/AccountManagement/UserAccounts';
import AdminLayout from './routes/Authenticated/Admin/AdminLayout';
import PendingApproval from './routes/Authenticated/Admin/AccountManagement/PendingApproval';
import AdminAccounts from './routes/Authenticated/Admin/AccountManagement/AdminAccounts';
import PredefinedGoalsCategories from './routes/Authenticated/Admin/ContentManagement/PredefinedGoalsCat';
import MembershipPrice from './routes/Authenticated/Admin/ContentManagement/MembershipPrice';
import WebsiteContent from './routes/Authenticated/Admin/ContentManagement/WebsiteContent';
import AppReviews from './routes/Authenticated/Admin/ReviewsManagement/AppReviews';
import NutriReviews from './routes/Authenticated/Admin/ReviewsManagement/NutriReviews';
import Appfeatures from './routes/Authenticated/Admin/ContentManagement/Appfeatures';
import PredefinedGoals from './routes/Authenticated/Admin/ContentManagement/PredefinedGoals';
import UserLayout from './routes/Authenticated/User/UserLayout';
import NutritionistLayout from './routes/Authenticated/Nutritionist/NutritionistLayout';
import ViewArticles from './routes/Authenticated/Nutritionist/ViewArticles';
import Profile from './routes/Authenticated/Nutritionist/Profile';
import MetTask from './routes/Authenticated/Admin/ContentManagement/MetTask';







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
    ],
    },

      // PROTECTED ROUTE WRAPPER
      {
        path: "/general",
        element: (<ProtectedRoute allowedRoles={["user"]}>
                    <UserLayout/>
                  </ProtectedRoute>
                ),
        children: [
          {
            index:true, 
            element: <Dashboard />,  // This should render if verified
          },
        ],
      },

      {
        path: "/nutri",
        element: (
        <ProtectedRoute allowedRoles={["nutritionist"]}>
          <NutritionistLayout/>
        </ProtectedRoute>
        ),
        children: [
          {
            index: true, 
            element: <ManageClients/>,  // This should render if verified
          },

          {
            path:'view-articles',
            element:<ViewArticles/>
          },

          {
            path:'profile',
            element:<Profile/>
          }
        ],
      },
     
      {
        path: "/admin",
      
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <UserAccounts />,
          },
          
          {
            path:'pending-approval',
            element:<PendingApproval/>
          },

          {
            path:'admin-acc',
            element:<AdminAccounts/>
          },

          {
            path:'predefined-goals-category',
            element:<PredefinedGoalsCategories/>
          },

          {
            path:'predefined-goals',
            element:<PredefinedGoals/>
          },

          {
            path:'membership-price',
            element:<MembershipPrice/>
          },

          {
            path:'website-content',
            element:<WebsiteContent/>
          },

          {
            path:'app-features',
            element:<Appfeatures/>
          },

          {
            path:'predefined-app-reviews',
            element:<AppReviews/>
          },

          {
            path:'predefined-nutri-reviews',
            element:<NutriReviews/>
          },
          {
            path:'met-task',
            element:<MetTask/>
          }


        ],
      },
    ],
  
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>

  </React.StrictMode>,
)
