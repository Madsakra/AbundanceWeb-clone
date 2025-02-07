
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
import { MET_Task_Type } from "@/types/adminTypes";



type ReviewsFormProps = {
    openForm:boolean,
    setOpenForm:(open:boolean)=>void,
    selectedData?:MET_Task_Type,
    fetchData:(time:"start")=>void;
    variation:string,
}


export default function MET_TaskForm({openForm,setOpenForm,selectedData,fetchData}:ReviewsFormProps) {
 
    const [reviewName,setReviewName] = useState("");
    const [value,setValue] = useState<number>()
 
        const checkServer = async () => {
        try {
          const goalsRef = collection(db, "MET_tasks");
      
          let q = query(
            goalsRef,
            where("name", "==", reviewName.toLowerCase()),
            where("value", "==", value)
          );
      
          // Exclude the goal being edited
          if (selectedData?.id) {
            q = query(q, where("__name__", "!=", selectedData.id)); // "__name__" refers to Firestore document ID
          }
      
          const querySnapshot = await getDocs(q);
          return !querySnapshot.empty;
        } catch (error) {
          console.error("Error checking MET TASK:", error);
          return false;
        }
      };






    const handleAddOrEditTier = async () => { 

        // check for empty fields
        if (reviewName.trim()===""|| !value || value<=0)
        {
          alert("Please do not leave task name blank or give it a score that is 0 or negative!");
          return;
        }

        // value check
        else if (value >=20)
        {
          alert("Please give a realstic MET value!");
          return;
        }
        

        // do a server check first
        const serverCheck = await checkServer();
        if (serverCheck)
        {
          alert("MET task already exist, please try again!");
          return;
        }


        try { 
          if (selectedData?.id) { 
            // Edit Tier 
            const docRef = doc(db,"MET_tasks",selectedData.id); 
            await updateDoc(docRef, { 
              name: reviewName.toLowerCase(), 
              value: value, 
            }); 
            alert("MET_Task edited successfully"); 
            
          } else { 
            // Add Tier 
            const collectionRef = collection(db,"MET_tasks"); 
            await addDoc(collectionRef, { 
                name: reviewName.toLowerCase(), 
                value: value, 
            }); 
            alert("MET_Task added successfully"); 
          } 
          
         fetchData("start");
    
        } catch (error) { 
          console.error("Error adding/updating tier: ", error); 
          alert("Failed to process request. Please try again.");
          return; 
        } 
      }; 


      useEffect(()=>{
        if (selectedData)
        {
            setReviewName(selectedData.name);
            setValue(selectedData.value)
        }

      },[])
    
 
      return (
        <AlertDialog onOpenChange={setOpenForm} open={openForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedData? <h2>Edit MET_tasks</h2>:<h1>Add MET_tasks</h1>}</AlertDialogTitle>
            <AlertDialogDescription>
            {selectedData? <h2>Edit MET_tasks for your users to log their calories output</h2> :<h1>Add MET_tasks for your users to log their calories output</h1>} 
            
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
            {selectedData? <h2>Edit MET_Task</h2>:<h1>Add MET_Task</h1>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
}
