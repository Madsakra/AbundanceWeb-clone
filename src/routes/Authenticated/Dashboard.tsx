import { useAuth } from "@/contextProvider";




export default function Dashboard() {
  
  const { user } = useAuth();


  
  
  
  
  return (
    <div className='w-screen h-[80vh]'>
      <h1>Dashboard</h1>
      <h2>Welcome {user?.email}</h2>
    </div>
  )
}
