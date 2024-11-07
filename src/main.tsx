
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
import ProtectedRoutes from './utils/ProtectedRoutes';
import Dashboard from './routes/Authenticated/Dashboard';



const router = createBrowserRouter([
  {
    path: "/",
    element:<Root />,
    errorElement:<ErrorPage/>,
    children:[

      // PUBLIC ROUTES

      {
        index:true,
        element:<Home/>
      },

      {
        path:'/login',
        element:<Login/>
      },

      {
        path:'/register',
        element:<Register/>
      },

      {
        path:'/forget-password',
        element:<ForgetPassword/>
      },

      // PROTECTED ROUTE WRAPPER

      {
        path:'/',
        element:<ProtectedRoutes/>,
        children:[
          {
            path:'dashboard',
            element:<Dashboard/>
          }
        ]
      },



    ]
  
  
  
  
  },
]);





ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   
    <RouterProvider router={router}/>
  

  </React.StrictMode>,
)
