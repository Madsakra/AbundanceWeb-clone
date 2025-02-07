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
import { createAccount } from "@/utils";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type AdminAccountCreationProps = {
  popupForm:boolean,
  setPopupForm:(open:boolean)=>void,
  setLoading:(loading:boolean)=>void,
  fetchAccounts:(time:"start"|"next"|"prev" )=>void,
}

export default function AdminAccountCreation({popupForm,setPopupForm,setLoading,fetchAccounts}:AdminAccountCreationProps) {

  const [userName,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleAccountCreation = async ()=>{

  

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "" || password.trim() === "" || userName.trim() === "") {
      alert("You have missed out some fields, please check again");
    }
    
    else if (!emailRegex.test(email.trim())) {
      alert("Please enter a valid email address!");
    }

    else{

      try{
        setLoading(true);
        const created = await createAccount(email,password,userName);

 
        if (created)
        {
          alert("Admin Account created")
        }
        else{
          alert("Account Creation Failed")
        }

        fetchAccounts("start");
        setLoading(false);

      }

      catch(err)
      {
        alert("Failed to create account!");
        console.log(err);
      }

    }

    setLoading(false);
  }




  return (
    <AlertDialog onOpenChange={setPopupForm} open={popupForm}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-xl">Create Admin Account</AlertDialogTitle>
        <AlertDialogDescription className="">
          Enter the details of the new admin account below
        </AlertDialogDescription>
          <div className="flex flex-col gap-7">

          <input 
          className="input input-bordered mt-5" type="text" 
          placeholder="Enter the new admin name"
          onChange={(e)=>setUsername(e.target.value)}
          />

          <input className="input input-bordered" 
          type="email" 
          placeholder="Enter the new admin email"
          onChange={(e)=>setEmail(e.target.value)}
          />




          <div className="relative w-full ">
                     <input
                       type={showPassword ? "text" : "password"}
                       placeholder="Enter your password here"
                       className="input w-full input-bordered"
                       onChange={(e)=>{setPassword(e.target.value)}}
                     />
                     <div
                       onClick={togglePasswordVisibility}
                       className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                     >
                       {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                     </div>
                   </div>


          </div>

     
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-10">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleAccountCreation}>Create Account</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}
