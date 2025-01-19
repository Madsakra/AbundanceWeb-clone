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
import { useNavigate } from "react-router-dom";
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
}
];





export function NutriSidebar() {
  let navigate = useNavigate();

  const {logout,accountDetails} = useAuth();

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
        <SidebarGroupLabel>Account Details</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex flex-col gap-4 p-4">
                        <h2>Email: <span className="font-bold">{accountDetails?.email}</span></h2>
                        <h3>UserName: <span className="font-bold flex"> {accountDetails?.name}</span> </h3>
                    </div>
                                   
               
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
