import { Link,  useNavigate } from 'react-router-dom'

import loginSplash from '../../assets/Images/login_splashes/login_splash.jpg'
import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

import { useAuth } from '@/contextProvider';



export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  
  let navigate = useNavigate();
  const {login} = useAuth();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleLogin = async ()=>{
  
    if (!email.trim() || !password.trim())
    {
      alert("Please do not leave your login credentials blank!")
    }

    else if (!(emailRegex.test(email)))
    {
      alert("You need to fill in your email properly")
    }

    else{
       await login(email,password);
       navigate("/")
   
    }
  }






  return (
    <div className='w-full h-full xl:h-[80vh] 
     flex flex-col lg:flex-row mt-14 
     items-center justify-evenly my-10'>

      <img src={loginSplash} className='w-96 h-96 '></img>

        {/* INPUT FORM */}
        <div className='w-96 xl:w-[30%] h-auto p-8'>

            <div className="inline-block text-center">
              <span className="text-2xl font-bold">Login</span>
              <div className="mt-1 h-[5px] rounded bg-teal-500 w-full"></div>
            </div>

            <div className='flex flex-col gap-4'>

                  <input
                  type="email"
                  placeholder="Enter your email here"
                  className="w-full px-6 py-4 bg-[#F1F1F1] rounded-full mt-20 outline-none border-0 font-extralight"
                  onChange={(e)=>{setEmail(e.target.value)}}
                />  

    
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password here"
                  className="w-full px-6 py-4 bg-[#F1F1F1] rounded-full outline-none border-0 font-extralight"
                  onChange={(e)=>{setPassword(e.target.value)}}
                />
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>


              <Link to="/forget-password" className='my-6 self-end text-[#989595]'>Forget Password ?</Link>


              {/*LOGIN BUTTON*/}
              <button className='w-full p-4 bg-[#009797] mt-6 text-white text-lg font-semibold rounded-full'
              onClick={handleLogin}
              >
                Sign In
              </button>
        
              <h1 className='text-center my-6'>Don't Have an account? 
              <Link to="/register" className='text-[#00ACAC]'> Sign Up</Link>
              </h1>

        </div>

    </div>

    </div>
  )
}
