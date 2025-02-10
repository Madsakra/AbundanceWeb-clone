import { Link, useNavigate } from 'react-router-dom'
import registerSplash from '../../assets/Images/login_splashes/register_splash.jpg'
import { useEffect, useState } from 'react';
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

import { Checkbox } from "@/components/ui/checkbox"
import { createUserWithEmailAndPassword,sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/contextProvider';
import { CompanyContactDetails } from '@/types/adminTypes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog"


export default function Register() {

  const [userName,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmedPassword,setConfirmedPassword] = useState("");
  const [role,setRole] = useState("");
  const [error,setError]= useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();
  const [terms,setTerms] = useState("");
  const [showTerms,setShowTerms] = useState(false)
  const [agreeTerms,setAgreeTerms] = useState(false);



  const {setLoading,loading,setAccountDetails} = useAuth();



  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const fetchTerms = async ()=>{
    const companyAdRef= doc(db, "company_info", "contact_details");
    const docSnap = await getDoc(companyAdRef);


    if (docSnap.exists()) {
      const coyDetails = docSnap.data() as CompanyContactDetails;
      setTerms(coyDetails.terms_and_condition);
    } else {
      console.log("No such document!");
    }

  }

  const handleSubmit = async ()=>{


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "" || password.trim() === "" || userName.trim() === "" || role === "") {
      alert("You have missed out some fields, please check again");
      setError(true);
      return;
    }
    
    if (!emailRegex.test(email.trim())) {
      alert("Please enter a valid email address!");
      setError(true);
      return;
    }


    if (password !== confirmedPassword)
    {
      alert("Your password does not match with the confirmation. Please try again");
      setError(true);
      return;
    }

    if (role === "nutritionist") 
      // SAVE THE DATA IN LOCAL HOST FIRST, GO TO THE NUTRI PAGE, COMPILE EVERYTHING AND SEND TO SERVER.
    {
      navigate('/nutritionist-submission', { state: { name:userName ,email:email, password:password }})
      
    }


 

    else {

      if (!error)
      {
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
          navigate('/user/')
          setAccountDetails({
            name:userName,
            email:email,
            role:role
          })
          
  
        }
    
        catch(err)
        {
          alert(err);
          setLoading(false);
          return false;
        }
      }
      else{
        alert("You might want to check your form again");
      }
    }
    setLoading(false);
  }

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>)=>{
    if (agreeTerms)
    {
      
      await handleSubmit();
      
    }

    else{
      alert("Please agree to the terms before signing up")
      e.preventDefault();
    }
  }



    useEffect(()=>{
    fetchTerms();
  },[])



  if (loading)
    {
      return (
        <div className="flex h-screen w-screen justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
        <h1>Loading...Please Hang on</h1>
        </div>
      )
    }
  

 

  return (
    <div className='w-full h-full xl:h-[80vh] 
     flex flex-col lg:flex-row mt-14 
     items-center justify-evenly my-10'>
      
      {showTerms && 
      
      <AlertDialog onOpenChange={setShowTerms} open={showTerms}>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Please Read the following before signing up</AlertDialogTitle>
          <AlertDialogDescription>
          <div className="h-96 overflow-y-auto p-2">{terms}</div>
          <div className="flex items-center space-x-2 mt-5">
              <Checkbox id="terms"   onCheckedChange={(checked) => setAgreeTerms(checked === true)}/>
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e)=>handleContinue(e)}>Sign up</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      
      }



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
                  <SelectItem value="user">Free User</SelectItem>
                  <SelectItem value="nutritionist">Nutritionist</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/*-----------------SELECT SECTION--------------*/}



              {/*LOGIN BUTTON*/}
              <button className='w-full p-4 bg-[#009797] mt-6 text-white text-lg font-semibold rounded-full' onClick={()=>setShowTerms(true)}>
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
