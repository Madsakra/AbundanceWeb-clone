import { useAuth } from "@/contextProvider";
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";



export default function Dashboard() {
  
  let navigate = useNavigate();
  const { user } = useAuth();

  useEffect(()=>{
    if (!(user?.verified))
    {
      navigate('/userVerification')
    }
  },[])
  
  
  
  
  
  return (
    <div className='w-screen h-[80vh]'>
      <h1>Dashboard</h1>
    </div>
  )
}
