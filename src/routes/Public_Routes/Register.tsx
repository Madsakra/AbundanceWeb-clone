import { Link, useNavigate } from 'react-router-dom'
import registerSplash from '../../assets/Images/login_splashes/register_splash.jpg'
import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { createUserWithEmailAndPassword,sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/contextProvider';


export default function Register() {

  const [userName,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmedPassword,setConfirmedPassword] = useState("");
  const [role,setRole] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

  const {setLoading,loading} = useAuth();


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleSubmit = async ()=>{


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "" || password.trim() === "" || userName.trim() === "" || role === "") {
      alert("You have missed out some fields, please check again");
    }
    
    else if (!emailRegex.test(email.trim())) {
      alert("Please enter a valid email address!");
    }


    if (password !== confirmedPassword)
    {
      alert("Your password does not match with the confirmation. Please try again")
    }

    if (role === "nutritionist") 
      // SAVE THE DATA IN LOCAL HOST FIRST, GO TO THE NUTRI PAGE, COMPILE EVERYTHING AND SEND TO SERVER.
    {
      navigate('/nutritionist-submission', { state: { name:userName ,email:email, password:password }})
    }

    else{


      try{
        setLoading(true);
        // create user with email & with password
        // auto log him in as non verified
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        // Send email verification
        await sendEmailVerification(userCredentials.user);
        
        // COPY HIS CREDENTIALS INTO DOCUMENTS
        const userID = userCredentials.user.uid
        // before he create profile, will temporaray use this
        const docRef =  doc(db, "accounts",userID);

        await setDoc(docRef, {
          name:userName,
          email:email,
          role: role,
        });
        
        alert("Account created")
        setLoading(false);
        navigate('/general/')
        


      }
  
      catch(err)
      {
        alert(err);
      }
    }
  }

  if (loading)
    {
      return (
        <div className="flex h-screen w-screen justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
        </div>
      )
    }
  

 

  return (
    <div className='w-full h-full xl:h-[80vh] 
     flex flex-col lg:flex-row mt-14 
     items-center justify-evenly my-10'>
      
      <img src={registerSplash} className='w-96 h-96 '></img>
        
        {/* INPUT FORM */}
        <div className='w-96 xl:w-[30%] h-auto p-8'>

            <div className="inline-block text-center">
              <span className="text-2xl font-bold">Register</span>
              <div className="mt-1 h-[5px] rounded bg-teal-500 w-full"></div>
            </div>

            <div className='flex flex-col gap-4'>

           
      

            <input
                  type="text"
                  placeholder="Enter your user name here"
                  className="w-full px-6 py-4 bg-[#F1F1F1] rounded-full mt-20 outline-none border-0 font-extralight"
                  onChange={(e)=>{setUsername(e.target.value)}}
                />  


                  <input
                  type="email"
                  placeholder="Enter your email here"
                  className="w-full px-6 py-4 bg-[#F1F1F1] rounded-full  outline-none border-0 font-extralight"
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

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-6 py-4 bg-[#F1F1F1] rounded-full outline-none border-0 font-extralight"
                  onChange={(e)=>{setConfirmedPassword(e.target.value)}}
                />
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>


              {/*SELECT SECTION*/}
              <Select onValueChange={setRole}>
              <SelectTrigger className="w-full h-14 rounded-full px-6 bg-[#F1F1F1]  text-md text-gray-500">
                <SelectValue placeholder="Select your role *" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  <SelectItem value="free_user">Free User</SelectItem>
                  <SelectItem value="nutritionist">Nutritionist</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/*-----------------SELECT SECTION--------------*/}



              {/*LOGIN BUTTON*/}
              <button className='w-full p-4 bg-[#009797] mt-6 text-white text-lg font-semibold rounded-full' onClick={handleSubmit}>
                Sign Up
              </button>
        
              <h1 className='text-center my-6'>Already have an account? 
              <Link to="/login" className='text-[#00ACAC]'> Login Here</Link>
              </h1>

        </div>



              
            

 
      

    </div>

    </div>
  )





}
