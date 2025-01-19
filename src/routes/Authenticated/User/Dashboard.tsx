import { useAuth } from "@/contextProvider";





export default function Dashboard() {
  
    const {logout} = useAuth();
  
  return (
    <div className='w-screen h-screen flex flex-col gap-4 items-center justify-center'>
      
      <h1 className="text-4xl">For users, Please login through the mobile app for better experince. Thank you!</h1>
      <button className="btn btn-wide mt-4 bg-[#00ACAC] text-white" onClick={logout}>Log out</button>
    </div>
  )
}
