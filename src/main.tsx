
import './index.css'

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import ErrorPage from './routes/ErrorPage';
import Home from './routes/Home';




const router = createBrowserRouter([
  {
    path: "/",
    element:<Root />,
    errorElement:<ErrorPage/>,
    children:[
      {
        index:true,
        element:<Home/>
      }
    ]
  
  
  
  
  },
]);





ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   
    <RouterProvider router={router}/>
  

  </React.StrictMode>,
)
