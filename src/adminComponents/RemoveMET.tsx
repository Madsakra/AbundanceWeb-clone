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
import { MET_Task_Type } from "@/types/adminTypes";

import { deleteDoc, doc } from "firebase/firestore";


type RemoveMETProps = {
    removalPopup:boolean,
    setRemovalPopup:(open:boolean)=>void,
    selectedData:MET_Task_Type,
    fetchData:(time:"start")=>void,
}



export default function RemoveMET({removalPopup,setRemovalPopup,selectedData,fetchData}:RemoveMETProps) {

    const handleRemoveTier = async () => { 
        if (!selectedData) 
            { 
                alert("No task to remove!")
                return
            }; 
        try { 
          const docRef = doc(db, "MET_tasks", selectedData.id); 
          await deleteDoc(docRef); 
          alert("MET Task removed successfully"); 
          fetchData("start") // Refresh the table data 
            setRemovalPopup(false);


        } catch (error) { 
          console.error("Error removing MET task: ", error); 
          alert("Failed to remove MET task. Please try again."); 
        } 
      }; 



  return (
    <AlertDialog open={removalPopup} onOpenChange={setRemovalPopup}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-destructive">Remove MET Task? </AlertDialogTitle>
        <AlertDialogDescription className="">
          Do you want to remove task: {selectedData.name} ? Do note that this action is irreversible!
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
