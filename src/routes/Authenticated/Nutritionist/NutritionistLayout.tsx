
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { NutriSidebar } from '@/nutriComponents/NutriSidebar'
import { Outlet } from 'react-router-dom'

export default function NutritionistLayout() {
  return (
    <SidebarProvider>
    <NutriSidebar />
    <main>
      <SidebarTrigger />
      <Outlet/>
    </main>
  </SidebarProvider>
  )
}
