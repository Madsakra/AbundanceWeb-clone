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
import { db, storage } from "@/firebase-config";
import { AppFeature } from "@/routes/Authenticated/Admin/ContentManagement/Appfeatures";

import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";


type RemoveFeatureProps = {
    removalPopup:boolean,
    setRemovalPopup:(open:boolean)=>void,
    selectedData:AppFeature,
    fetchData:(time:"start")=>void,
    setLoading:(load:boolean)=>void
}



export default function RemoveAppFeatureForm({removalPopup,setRemovalPopup,selectedData,fetchData,setLoading}:RemoveFeatureProps) 

{

    const handleRemoveData = async () => { 
        if (!selectedData) 
            { 
                alert("No Review to remove!")
                return
            }; 
            try {
                setLoading(true);
                // Step 1: Delete the image from Firebase Storage
                if (selectedData.image) {
                  const imageRef = ref(storage, selectedData.image); // Pass the storage path of the image
                  await deleteObject(imageRef);
                }
          
                // Step 2: Delete the document from Firestore
                const docRef = doc(db, "app_features", selectedData.id); // Ensure correct collection name
                await deleteDoc(docRef);
          
                alert("Feature removed successfully");
                fetchData("start"); // Refresh the table data
                
                setRemovalPopup(false);
              } catch (error) {
                console.error("Error removing feature: ", error);
                alert("Failed to remove feature. Please try again.");
              }
            
        }



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
        <AlertDialogAction onClick={handleRemoveData}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  )

}


