import { useNavigate } from "react-router";
import forgetPassSplash from '../../assets/Images/login_splashes/forgetPassword_splash.jpg'
import { useState } from 'react';



export default function ForgetPassword() {
  const [email,setEmail] = useState("");

  let navigate = useNavigate();



  const handleSubmit = ()=>{
    console.log(email);
    navigate('/login')
  }



  return (
    <div className='w-full h-full xl:h-[80vh] 
     flex flex-col lg:flex-row mt-14 
     items-center justify-evenly my-10'>

      <img src={forgetPassSplash} className='w-96 h-96 '></img>

        {/* INPUT FORM */}
        <div className='w-96 xl:w-[30%] h-auto p-8'>

            <div className="inline-block text-center">
              <span className="text-2xl font-bold">Password Reset</span>
              <div className="mt-1 h-[5px] rounded bg-teal-500 w-full"></div>
            </div>

            <div className='flex flex-col gap-4'>

                  <h2 className='text-md  mt-14 tracking-widest leading-relaxed'>
                  Forgotten your password? No worries, enter your email below and we will send you a link to reset your password.
                  </h2>


                  <input
                  type="email"
                  placeholder="Enter your email here"
                  className="w-full px-6 py-4 bg-[#F1F1F1] rounded-full mt-10 outline-none border-0 font-extralight"
                  onChange={(e)=>{setEmail(e.target.value)}}
                />  


              {/*Reset BUTTON*/}
              <button className='w-full p-4 bg-[#009797] mt-6 text-white text-lg font-semibold rounded-full'
              onClick={handleSubmit}
              >
                Reset Password
              </button>


        </div>



    </div>

    </div>
  )
}
