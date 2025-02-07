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
import { deleteDoc, doc } from "firebase/firestore";
import { ProfileSpecialisation } from "./SpecialisationForm";


type RemoveReviewsProps = {
    removalPopup:boolean,
    setRemovalPopup:(open:boolean)=>void,
    selectedData:ProfileSpecialisation,
    fetchData:(time:"start")=>void,
    collectionName:string,
    naming:string,
}



export default function RemoveSpecialisation({removalPopup,setRemovalPopup,selectedData,fetchData,collectionName,naming}:RemoveReviewsProps) {

    const handleRemoveTier = async () => { 
        if (!selectedData) 
            { 
                alert(`No ${naming} to remove!`)
                return
            }; 
        try { 
          const docRef = doc(db, collectionName, selectedData.id); 
          await deleteDoc(docRef); 
          alert(`${naming} removed successfully`); 
          fetchData("start") // Refresh the table data 
            setRemovalPopup(false);


        } catch (error) { 
          console.error(`Error removing ${naming}`+error); 
          alert(`Failed to remove ${naming}. Please try again.`); 
        } 
      }; 



  return (
    <AlertDialog open={removalPopup} onOpenChange={setRemovalPopup}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-destructive">Remove {naming}? </AlertDialogTitle>
        <AlertDialogDescription className="">
          Do you want to remove {naming}: {selectedData.name} ? Do note that this action is irreversible!
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
