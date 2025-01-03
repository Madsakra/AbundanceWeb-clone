import { Link } from 'react-router-dom'
import permissionDeny from './assets/Images/permission-Denied.jpg'



export default function PermissionDenied() {


  return (
    <div className='flex flex-col items-center justify-center h-[80vh]'>
        <img src={permissionDeny} className='w-96 h-96 my-5' alt="" />
        <h1 className='text-4xl font-bold'>Permission Denied</h1>
        <h2 className='text-2xl font-medium my-2'>You Do Not Belong Here....Begone!</h2>
        <Link to="/" className='btn btn-ghost bg-gray-500 text-white p-4 mt-5'>Go back Home</Link>
    </div>
  )
}
