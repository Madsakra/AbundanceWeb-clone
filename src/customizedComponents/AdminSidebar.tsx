import { SquareUser,FileLock,Shield,Goal,CreditCard,LinkIcon,TabletSmartphone,Apple,Power } from "lucide-react"
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


// Account items
const accountManagement = [
{
  title:"Accounts (Approved)",
  url:"/admin/",
  icon:SquareUser
},

{
  title:"Accounts (Pending Approval)",
  url:"/admin/pending-approval",
  icon:FileLock
},

{
  title:"Admin Accounts",
  url:"/admin/admin-acc",
  icon:Shield
}
];

const contentManagement = [

  {
    title:"Predefined Goals",
    url:"/admin/predefined-goals-category",
    icon:Goal
  },
  
  {
    title:"Membership Price",
    url:"/admin/membership-price",
    icon:CreditCard
  },
  
  {
    title:"Website Content",
    url:"/admin/website-content",
    icon:LinkIcon
  }
];

const reviewsManagement = [
  {
    title:"Predefined Reviews (App)",
    url:"/admin/predefined-app-reviews",
    icon:TabletSmartphone
  },
  
  {
    title:"Predefined Reviews (Nutritionist)",
    url:"/admin/predefined-nutri-reviews",
    icon:Apple
  }

]

export function AdminSidebar() {
  let navigate = useNavigate();

  const {logout} = useAuth();

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
          <SidebarGroupLabel>Account Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountManagement.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentManagement.map((item) => (
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


        <SidebarGroup>
          <SidebarGroupLabel>Reviews Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reviewsManagement.map((item) => (
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
      </SidebarContent>



              <SidebarFooter className="mb-10">
                <SidebarMenuButton onClick={logout} className="gap-5">
                  <Power/>
                  <h2>Logout</h2>
                </SidebarMenuButton>
              </SidebarFooter>


    </Sidebar>
  )
}
