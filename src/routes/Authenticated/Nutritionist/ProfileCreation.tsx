import { Button } from "@/components/ui/button";
import { CalendarDate } from "@heroui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react"
import {Calendar} from "@heroui/calendar";
import { useAuth } from "@/contextProvider";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase-config";
import {  useNavigate } from "react-router-dom";

export default function ProfileCreation() {

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [displayedTitle,setDisplayedTitle] = useState("");
    const [dob, setDOB] = useState<CalendarDate|null>(null);
    const {user,setLoading} = useAuth();

    let navigate = useNavigate();


  // Handle file selection, display image for nutritionist to see
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };



  // submit documents
  const handleSubmit = async()=>{

    setLoading(true);

    // check if documents are present
    if (!imageFile || !displayedTitle || !dob)
    {
        alert("Please do not miss out the fields in the profile creation form!");
        setLoading(false);
    }

    else{

            if (user)
            {
                try{

                    const storage = getStorage();   
                    // 2. Upload files to Firebase Storage
                    const profileAvatarRef = ref(storage, `profileAvatar/${user.uid}`);
               
              
                    // Upload certification
                    await uploadBytes(profileAvatarRef, imageFile);
                    const avatar = await getDownloadURL(profileAvatarRef);
                    


                    // upload profile info
                    // Create a reference to the profile_info document in a single line
                    const profileInfoDocRef = doc(db, "accounts", user.uid , "profile", "profile_info");
                    // Data for the profile_info document

                    const profileInfoData = {
                            // Your profile information here
                            avatar:avatar,
                            title:displayedTitle,
                            dob: dob.toString(),
                            // ... other profile fields
                        }; 
                    // Add the profile_info document to the subcollection
                    await setDoc(profileInfoDocRef, profileInfoData); 

                    setLoading(false);
                    alert("Profile created...Redirecting");
                    navigate('/nutri/');
                }

                catch(err)
                {
                    alert(err);
                    setLoading(false);

                }

            }

    }

  }




  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      
        {/*Outer Container */}
    <div className="w-full flex flex-col  xl:w-1/2 xl:h-auto border-2 rounded-2xl shadow-lg p-10">

        <h1 className="font-bold text-3xl mb-2">Profile Creation</h1>
        <h2 className="text-[#929292]">We see that it is your first time logging in, help your clients to identify you by creating a profile!</h2>
        

     
        {/*Inner  Container */}
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-20 items-center">

        {/*LEFT CONTAINER */}
        <div className="flex flex-col gap-8 mt-4 ">
            <h1 className="font-bold text-xl mt-4">Avatar</h1>
            {
                preview?
                <img src={preview} alt="Image Preview" className="w-52 h-52 rounded-full"></img>:   
                <div className="bg-[#C4C4C4] w-52 h-52   rounded-full"></div>
            }
            <input type="file" accept="image/*" onChange={handleFileChange} className="file-input file-input-bordered file-input-sm w-full max-w-xs" />
        </div>


        {/*RIGHT CONTAINER */}
        
        <div className="flex flex-col gap-4 w-full">

        <div className="flex flex-col">
        <label htmlFor="" className="font-bold">Displayed Name</label>
        <input 
        onChange={(e)=>setDisplayedTitle(e.target.value)}
        type="text" 
        placeholder="Type here" 
        className="mt-1 input input-bordered w-full" />
        </div>



            {/* DOB SELECTOR */}
        <div className="flex flex-col gap-4 mt-4 ">
        <label htmlFor="" className="font-bold">Date of Birth</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!dob ? "text-muted-foreground" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dob ? dob.toString(): "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">

               {/*show date selector*/}
 
                    <div className="flex gap-x-4 bg-white border-2 shadow-lg rounded-lg p-4">
                    <Calendar aria-label="Date (Show Month and Year Picker)" 
                    value={dob}
                    onChange={setDOB}
                    />
                  </div>
              </PopoverContent>
            </Popover>                  
          </div>

          <button 
          className="btn btn-ghost bg-[#00ACAC] mt-8
           text-white font-bold"
           onClick={handleSubmit}
           >Submit</button>

        </div>




        </div>


    </div>


    </div>
  )
}
