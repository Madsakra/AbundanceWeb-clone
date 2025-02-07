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
import { PredefinedGoalsType } from "@/types/adminTypes";
import { deleteDoc, doc } from "firebase/firestore";


type RemovePredefinedGoalsProps = {
    removalPopup:boolean,
    setRemovalPopup:(open:boolean)=>void,
    selectedData:PredefinedGoalsType,
    fetchData:(time:"start")=>void,
}




export default function RemovePredefinedGoals({removalPopup,setRemovalPopup,selectedData,fetchData}:RemovePredefinedGoalsProps) {
  
  
  
    const handleRemoveTier = async () => { 
        if (!selectedData) 
            { 
                alert("No Predefined goal to remove!")
                return
            }; 
        try { 
          const docRef = doc(db, "predefined_goals_categories", selectedData.categoryID,"predefined_goals",selectedData.id); 
          await deleteDoc(docRef); 
          alert("Predefined goal Removed successfully"); 
          fetchData("start") // Refresh the table data 
            setRemovalPopup(false);


        } catch (error) { 
          console.error("Error removing category: ", error); 
          alert("Failed to remove predefined goal. Please try again."); 
        } 
      }; 

  
  
  
  
  
  
  
  
  
    return (
        <AlertDialog open={removalPopup} onOpenChange={setRemovalPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Remove Predefined Goal? </AlertDialogTitle>
            <AlertDialogDescription className="">
              Do you want to remove goal: {selectedData.categoryID} ? Do note that this action is irreversible!
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
