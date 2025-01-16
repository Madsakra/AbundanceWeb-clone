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
import { ReviewType } from "@/routes/Authenticated/Admin/ReviewsManagement/AppReviews";
import { deleteDoc, doc } from "firebase/firestore";


type RemoveReviewsProps = {
    removalPopup:boolean,
    setRemovalPopup:(open:boolean)=>void,
    selectedData:ReviewType,
    fetchData:(time:"start")=>void,
    collectionName:string,
}



export default function RemoveReviews({removalPopup,setRemovalPopup,selectedData,fetchData,collectionName}:RemoveReviewsProps) {

    const handleRemoveTier = async () => { 
        if (!selectedData) 
            { 
                alert("No Review to remove!")
                return
            }; 
        try { 
          const docRef = doc(db, collectionName, selectedData.id); 
          await deleteDoc(docRef); 
          alert("Review removed successfully"); 
          fetchData("start") // Refresh the table data 
            setRemovalPopup(false);


        } catch (error) { 
          console.error("Error removing review: ", error); 
          alert("Failed to remove review. Please try again."); 
        } 
      }; 



  return (
    <AlertDialog open={removalPopup} onOpenChange={setRemovalPopup}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-destructive">Remove Review? </AlertDialogTitle>
        <AlertDialogDescription className="">
          Do you want to remove review {selectedData.id} ? Do note that this action is irreversible!
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
