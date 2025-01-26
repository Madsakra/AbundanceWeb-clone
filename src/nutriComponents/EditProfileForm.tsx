import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useAuth } from "@/contextProvider"; // Assuming useAuth is defined in your context
import { useRef, useState } from "react";
import ImageSelector from "@/customizedComponents/ImageSelector";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebase-config"; // Assuming db and storage are your Firebase instances
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

type EditProfileFormProps = {
  editProfile: boolean;
  setEditProfile: (open: boolean) => void;
  fetchProfile:()=>void
};

export default function EditProfileForm({ editProfile, setEditProfile,fetchProfile }: EditProfileFormProps) {
  const { profile,user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(profile?.avatar || '/default-avatar.png');
  const [displayedTitle, setDisplayedTitle] = useState(profile?.title || "");
  const [gender, setGender] = useState<string>(profile?.gender || "");

  // Handle file selection, display image for preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSvgClick = () => {
    fileInputRef.current?.click(); // Programmatically trigger file input click
  };

  const handleSubmit = async () => {
    try {
      // Get user document reference
      const userDocRef = doc(db,"accounts",user!.uid,"profile","profile_info");
      

      if (userDocRef) {
        console.log("userDocRef:", userDocRef); // Log the document reference

        // Update data
        const updatedData: { avatar?: string; title: string; gender: string } = {
          title: displayedTitle,
          gender: gender,
        };

        // Upload image (if selected) and update avatarURL in updatedData
        if (imageFile) {
          const imageRef = ref(storage, `avatars/${uuidv4()}-${imageFile.name}`);
          await uploadBytes(imageRef, imageFile);
          updatedData.avatar = await getDownloadURL(imageRef);
        }

        // Update the user document in Firestore
        await updateDoc(userDocRef, updatedData);

        // Close the edit profile form
        setEditProfile(false);

        // Show success message to the user
        alert("Profile updated successfully!");
        fetchProfile();
      } else {
        console.error("User or user ID is undefined.");
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile.");
    }
  };

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
            {preview ? (
              <div className="relative self-center">
                <img src={preview} alt="Image Preview" className="w-32 h-32 rounded-full" />
                <ImageSelector
                  handleFileChange={handleFileChange}
                  handleSvgClick={handleSvgClick}
                  fileInputRef={fileInputRef}
                />
              </div>
            ) : (
              <div className="relative self-center">
                <div className="bg-[#C4C4C4] w-52 h-52 rounded-full" />
                <ImageSelector
                  handleFileChange={handleFileChange}
                  handleSvgClick={handleSvgClick}
                  fileInputRef={fileInputRef}
                />
              </div>
            )}

            <div className="flex flex-col">
              <label htmlFor="" className="font-bold">Displayed Name</label>
              <input
                onChange={(e) => setDisplayedTitle(e.target.value)}
                type="text"
                placeholder="Type here"
                value={displayedTitle}
                className="mt-1 input input-bordered w-full"
              />
            </div>

            {/* GENDER */}
            <div className="flex flex-col gap-1 ">
              <label htmlFor="" className="font-bold">Gender</label>
              <select
                className="select select-bordered w-full"
                defaultValue={gender}
                onChange={(e) => setGender(e.target.value)}
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
          <button className="btn btn-sm btn-ghost bg-black text-white" onClick={handleSubmit}>
            Continue
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}