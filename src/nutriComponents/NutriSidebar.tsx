import { Handshake,BookOpenText,User, Power } from "lucide-react"
import miniLogo from '../assets/Images/mini-logo.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contextProvider";

// App Functionality
const appFunctionality = [
{
  title:"View Clients",
  url:"/nutri/",
  icon:Handshake
},

{
  title:"View Articles",
  url:"/nutri/view-articles",
  icon:BookOpenText
},

{
  title:"Profile",
  url:"/nutri/profile",
  icon:User
},

];





export function NutriSidebar() {
  let navigate = useNavigate();

  const {logout,accountDetails,profile} = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
      <SidebarGroup>
        
          <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="my-5" onClick={()=>navigate('/')}>
                    <img src={miniLogo} className="w-8 h-8 me-2" alt="" />
                    <h2 className="font-bold">Home</h2>                    
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      
        <SidebarGroup>
        <SidebarGroupLabel className="mb-5">Account Details</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link to="/nutri/profile" className="flex flex-col gap-8  p-4 items-center">
                        <img src={profile?.avatar} alt="avatar" className="w-16 h-16 rounded-full" />
                        <h2 className="flex flex-col gap-1 w-full">Title: <span className="font-bold">{profile?.title}</span></h2>
                        <h3  className="flex flex-col w-full">Email: <span className="font-bold"> {accountDetails?.email}</span> </h3>
                    </Link>
                                   
               
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>

          <SidebarGroupLabel>App Functionality</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appFunctionality.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
              <SidebarFooter className="h-[60vh] flex justify-end">
                <SidebarMenuButton onClick={logout} className="gap-5">
                  <Power/>
                  <h2>Logout</h2>
                </SidebarMenuButton>
              </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
