
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
import { db } from "@/firebase-config";
import { ReviewType } from "@/routes/Authenticated/Admin/ReviewsManagement/AppReviews";


type ReviewsFormProps = {
    collectionName:string,
    openForm:boolean,
    setOpenForm:(open:boolean)=>void,
    selectedReview?:ReviewType,
    fetchData:(time:"start")=>void;
    variation:string,
}


export default function ReviewsForm({collectionName,openForm,setOpenForm,selectedReview,fetchData,variation}:ReviewsFormProps) {
 
    const [reviewName,setReviewName] = useState("");
    const [value,setValue] = useState<number>()
 
    const handleAddOrEditTier = async () => { 
        try { 
          if (selectedReview?.id) { 
            // Edit Tier 
            const docRef = doc(db,collectionName,selectedReview.id); 
            await updateDoc(docRef, { 
              name: reviewName, 
              value: value, 
            }); 
            alert("Review edited successfully"); 
            
          } else { 
            // Add Tier 
            const collectionRef = collection(db, collectionName); 
            await addDoc(collectionRef, { 
                name: reviewName, 
                value: value, 
            }); 
            alert("Review added successfully"); 
          } 
          
         fetchData("start");
    
        } catch (error) { 
          console.error("Error adding/updating tier: ", error); 
          alert("Failed to process request. Please try again."); 
        } 
      }; 


      useEffect(()=>{
        if (selectedReview)
        {
            setReviewName(selectedReview.name);
            setValue(selectedReview.value)
        }

      },[])
    
 
      return (
        <AlertDialog onOpenChange={setOpenForm} open={openForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedReview? <h2>Edit Review - {variation}</h2>:<h1>Add Review - {variation}</h1>}</AlertDialogTitle>
            <AlertDialogDescription>
            {selectedReview? <h2>Edit Review for {variation}</h2> :<h1>Add Review for {variation}</h1>} 
            
            </AlertDialogDescription>
          </AlertDialogHeader>
    
            <div className="flex flex-col">
                <input placeholder="Review Name" type="text" 
                value={reviewName}
                className="input input-bordered w-full my-5 mt-2"
                onChange={(e)=>setReviewName(e.target.value)}
                />
    
                <input placeholder="Value" type="number" className="input input-bordered w-full " 
                value={value}
                onChange={(e)=>setValue(Number(e.target.value))}/>
    
            </div>
    
    
    
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddOrEditTier}>
            {selectedReview? <h2>Edit Review - {variation}</h2>:<h1>Add Review - {variation}</h1>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
    









}
