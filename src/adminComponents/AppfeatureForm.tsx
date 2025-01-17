
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

import { useEffect, useState } from "react"
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebase-config";
import { AppFeature } from "@/routes/Authenticated/Admin/ContentManagement/Appfeatures";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


type ReviewsFormProps = {
    openForm:boolean,
    setOpenForm:(open:boolean)=>void,
    selectedData?:AppFeature,
    fetchData:(time:"start")=>void;
    setLoading:(load:boolean)=>void,
}


export default function AppfeatureForm({openForm,setOpenForm,selectedData,fetchData,setLoading}:ReviewsFormProps) {
  
  
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageLink,setImageLink] = useState("");

    const [name,setName] = useState<string>("");
    const [description,setDescription] = useState<string>("");
 
    const validateInputs = () => {
        if (!name.trim()) {
          alert("App feature name cannot be empty.");
          return false;
        }
        if (!description.trim()) {
          alert("Description cannot be empty.");
          return false;
        }
        if (!imageFile && !selectedData?.image) {
          alert("Please upload an image.");
          return false;
        }
        return true;
      };
    







    const handleAddOrEditTier = async () => { 
        
        if (!validateInputs()) return;

        
        try { 

        setLoading(true);
        let finalImageLink = imageLink;
        if (imageFile) {
            // Upload the image to Firebase Storage
            const imageRef = ref(storage, `app_features/${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            finalImageLink = await getDownloadURL(imageRef);
            setImageLink(finalImageLink);
          }
    



          if (selectedData?.id) { 
            // Edit Tier 
            const docRef = doc(db,"app_features",selectedData.id); 
            await updateDoc(docRef, { 
              name,
              description,
              image:finalImageLink 
            }); 
            alert("Feature edited successfully");
            
          } else { 
            // Add Tier 
            const collectionRef = collection(db, "app_features"); 
            await addDoc(collectionRef, { 
                name,
                description,
                image:finalImageLink
            }); 
            alert("Feature added successfully");
          } 
          
         fetchData("start");
    
        } catch (error) { 
          console.error("Error adding/updating tier: ", error); 
          alert("Failed to process request. Please try again."); 
        } 
      }; 


      useEffect(()=>{
        if (selectedData)
        {
            setName(selectedData.name);
            setDescription(selectedData.description);
            setImageLink(selectedData.image);

        }

      },[])
    
 
      return (
        <AlertDialog onOpenChange={setOpenForm} open={openForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedData? <h2>Edit App Feature</h2>:<h1>Add App Feature</h1>}</AlertDialogTitle>
            <AlertDialogDescription>
            {selectedData? <h2>Edit App Feature</h2> :<h1>Add App Feature</h1>} 
            
            </AlertDialogDescription>
          </AlertDialogHeader>
    
            <div className="flex flex-col">
                <input placeholder="App Feature Name" type="text" 
                value={name}
                className="input input-bordered w-full my-5 mt-2"
                onChange={(e)=>setName(e.target.value)}
                />
    
                <input placeholder="Description"  className="input input-bordered w-full " 
                value={description}
                onChange={(e)=>setDescription(e.target.value)}/>
    
                    <label className="mt-5 mb-2">App Feature Image</label>
                    <input
                            type="file"
                            accept="image/*"
                            className="border-2 py-4  w-full p-4 "
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                        {selectedData?.image && !imageFile && (
                            <p className="text-sm mt-2 text-gray-500">
                            Current Image: {selectedData.image}
                            </p>
                        )}
            </div>
    
    
    
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddOrEditTier}>
            {selectedData ? "Edit Feature" : "Add Feature"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
    

}
