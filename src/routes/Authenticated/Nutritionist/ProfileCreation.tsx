import { useEffect, useState } from "react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAuth } from "@/contextProvider";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase-config";
import {  useNavigate } from "react-router-dom";
import { Dayjs } from "dayjs";

export default function ProfileCreation() {

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [displayedTitle,setDisplayedTitle] = useState("");
    const [dob, setDOB] = useState<Dayjs|null>(null);
    const [gender,setGender] = useState<string>("");
    

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
    if (!imageFile || !displayedTitle || !dob || !gender)
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
                            avatar,
                            title:displayedTitle,
                            dob: dob.format("YYYY-MM-DD"),
                            gender
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
        
        <div className="flex flex-col gap-4 w-full mt-10">

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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker value={dob} onChange={setDOB} disableFuture/>
                      </LocalizationProvider>           
          </div>

            {/* GENDER */}
          <div className="flex flex-col gap-4 mt-4 ">
        <label htmlFor="" className="font-bold">Gender</label>
        <select className="select select-bordered w-full max-w-xs"
        onChange={(e)=>setGender(e.target.value)}
        >
            <option disabled selected>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>     
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
