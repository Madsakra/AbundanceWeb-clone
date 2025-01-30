


import MobileNav from '@/customizedComponents/MobileNav';
import WebNav from '@/customizedComponents/WebNav';
import { Outlet } from 'react-router-dom'



const UserLayout = () => {
  return (
   
  
      <main>
        <WebNav/>
        <MobileNav/>
        <Outlet/>
      </main>
   
     
   
  );
};

export default UserLayout;
