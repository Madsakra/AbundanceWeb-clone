import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/customizedComponents/AdminSidebar';


import { Outlet } from 'react-router-dom'



const AdminLayout = () => {
  return (
   
      <SidebarProvider>
      <AdminSidebar />
      <main>
        <SidebarTrigger />
        <Outlet/>
      </main>
    </SidebarProvider>
     
   
  );
};

export default AdminLayout;
