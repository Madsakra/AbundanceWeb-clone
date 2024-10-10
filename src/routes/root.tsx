import MobileNav from '@/customizedComponents/MobileNav'
import WebNav from '@/customizedComponents/WebNav'
import { Outlet } from "react-router-dom";



export default function Root() {
  return (
    <>
      <WebNav/>
      <MobileNav/>
      <Outlet/>
    </>
  )
}
