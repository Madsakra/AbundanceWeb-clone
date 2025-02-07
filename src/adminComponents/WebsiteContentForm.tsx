
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
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase-config";
import { WebsiteLinks } from "@/types/adminTypes";



type WebsiteContentFormProps = {
    openForm:boolean,
    setOpenForm:(open:boolean)=>void,
    websiteLink?:WebsiteLinks,
    fetchData:(time:"start")=>Promise<void>;
}





export default function WebsiteContentForm({openForm,setOpenForm,websiteLink,fetchData}:WebsiteContentFormProps) {
 
    const [name,setName] = useState<string>("");
    const [link,setLink] = useState<string>("");
    
    const collectionName = "website_links";

   const serverCheck = async () => {
    try {
      const colRef = collection(db, collectionName);
  
      let q = query(
        colRef,
        where("name", "==", name),
        where("link", "==", link)
      );
  
      // Exclude the goal being edited
      if (websiteLink?.id) {
        q = query(q, where("__name__", "!=", websiteLink.id)); // "__name__" refers to Firestore document ID
      }
  
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking predefined goal:", error);
      return false;
    }
  };



    const handleAddOrEditTier = async () => { 
        
        if (name.trim()==="" || link.trim()==="")
        {
          alert("Please do not leave out the name or link blank!");
          return;
        }

        const checkServer = await serverCheck();
        if (checkServer)
        {
          alert("The name and link already exists, please check again");
          return;
        }
        
        try { 
          if (websiteLink?.id) { 
            // Edit Tier 
            const docRef = doc(db, collectionName,websiteLink.id); 
            await updateDoc(docRef, { 
              name: name, 
              link: link, 

            }); 
            alert("Website Link edited successfully"); 
            
          } else { 
            // Add Tier 
            const collectionRef = collection(db, collectionName); 
            await addDoc(collectionRef, { 
                name: name, 
                link: link, 
            }); 
            alert("Website Link added successfully"); 
          } 
          
         fetchData("start");
    
        } catch (error) { 
          console.error("Error adding/updating website link: ", error); 
          alert("Failed to process request. Please try again."); 
          return;
        } 
      }; 
    

      useEffect(() => {
        if (websiteLink)
            {
                setName(websiteLink.name);
                setLink(websiteLink.link);
            }
      }, []);





 
    return (
        <AlertDialog onOpenChange={setOpenForm} open={openForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{websiteLink? <h2>Edit Website Link</h2>: <h1>Add Website  Link</h1>}</AlertDialogTitle>
            <AlertDialogDescription>
            {websiteLink?  <h2>Edit Website link for your users to view</h2>:<h1>Add Website Media link for your users to view</h1> } 
            
            </AlertDialogDescription>
          </AlertDialogHeader>
    
            <div className="flex flex-col">
                <input placeholder="Link Name" type="text" 
                value={name}
                className="input input-bordered w-full my-5 mt-2"
                onChange={(e)=>setName(e.target.value)}
                />
    
                <input placeholder="Website Url" type="text" 
                className="input input-bordered w-full " 
                value={link}
                onChange={(e)=>setLink(e.target.value)}/>
     
            </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddOrEditTier}>
            {websiteLink? <h2>Edit Website Link</h2>: <h1>Add Website Link</h1>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    
  )
}
