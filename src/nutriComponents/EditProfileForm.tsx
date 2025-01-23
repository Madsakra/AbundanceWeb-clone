
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"




import { useAuth } from "@/contextProvider";
import { useRef, useState } from "react";
import ImageSelector from "@/customizedComponents/ImageSelector";




type EditProfileFormProps = {
    editProfile:boolean;
    setEditProfile:(open:boolean)=>void;
};


export default function EditProfileForm({editProfile,setEditProfile}:EditProfileFormProps) {
  

    const {profile} = useAuth();

        const fileInputRef = useRef<HTMLInputElement>(null);
        const [imageFile, setImageFile] = useState<File | null>(null);
        const [preview, setPreview] = useState<string | null>(profile!.avatar);
        const [displayedTitle,setDisplayedTitle] = useState(profile!.title);
        const [gender,setGender] = useState<string>("");

      // Handle file selection, display image for nutritionist to see
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setImageFile(file);
          setPreview(URL.createObjectURL(file));
        }
      };
      const handleSvgClick = () => {
        fileInputRef.current?.click(); // Programmatically trigger the file input click
      };
  


      const handleSubmit = ()=>{
      
      }





    return (
    <AlertDialog open={editProfile} onOpenChange={setEditProfile}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profile</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your new profile information below
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col w-full ">

        <div className="flex flex-col gap-8 mt-4 ">


            {
                preview?
                <div className="relative self-center">
                <img src={preview} alt="Image Preview" className="w-32 h-32 rounded-full"></img>  
                <ImageSelector
                handleFileChange={handleFileChange}
                handleSvgClick={handleSvgClick}
                fileInputRef={fileInputRef}
                />
                </div>
                    :
                  <div className="relative self-center">
                    <div className="bg-[#C4C4C4] w-52 h-52   rounded-full"></div>
                    <ImageSelector
                    handleFileChange={handleFileChange}
                    handleSvgClick={handleSvgClick}
                    fileInputRef={fileInputRef}
                    />
                  </div>
               
            }


            <div className="flex flex-col">
            <label htmlFor="" className="font-bold">Displayed Name</label>
            <input 
            onChange={(e)=>setDisplayedTitle(e.target.value)}
            type="text" 
            placeholder="Type here" 
            value={displayedTitle}
            className="mt-1 input input-bordered w-full" />
            </div>




            {/* GENDER */}
          <div className="flex flex-col gap-1 ">
        <label htmlFor="" className="font-bold">Gender</label>
        <select className="select select-bordered w-full"
        defaultValue={gender}
        onChange={(e)=>setGender(e.target.value)}
        >
            <option disabled selected>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>     
        </div>




        </div>

        </div>


        <AlertDialogFooter className="mt-8">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <button className="btn btn-sm btn-ghost bg-black text-white" onClick={handleSubmit}>Continue</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
