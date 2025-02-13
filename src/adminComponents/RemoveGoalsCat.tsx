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
import { db } from "@/firebase-config";
import { PredefinedGoalsCat } from "@/types/adminTypes";

import { deleteDoc, doc } from "firebase/firestore";


type RemoveGoalsCatProps = {
    removalPopup:boolean,
    setRemovalPopup:(open:boolean)=>void,
    selectedData:PredefinedGoalsCat,
    fetchData:(time:"start")=>void,
}




export default function RemoveGoalsCat({removalPopup,setRemovalPopup,selectedData,fetchData}:RemoveGoalsCatProps) {
 
 
    const handleRemoveTier = async () => { 
        if (!selectedData) 
            { 
                alert("No Category to remove!")
                return
            }; 
        try { 
          const docRef = doc(db, "predefined_goals_categories", selectedData.id); 
          await deleteDoc(docRef); 
          alert("Goals Category Removed successfully"); 
          fetchData("start") // Refresh the table data 
            setRemovalPopup(false);


        } catch (error) { 
          console.error("Error removing category: ", error); 
          alert("Failed to remove category. Please try again."); 
        } 
      }; 

 
 
 
 
 
 
 
    return (
        <AlertDialog open={removalPopup} onOpenChange={setRemovalPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Remove Goal Category? </AlertDialogTitle>
            <AlertDialogDescription className="">
              Do you want to remove category: {selectedData.id} ? Do note that this action is irreversible!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveTier}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}
