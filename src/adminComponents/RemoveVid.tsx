import { WebsiteLinks } from "@/routes/Authenticated/Admin/ContentManagement/WebsiteContent"
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
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase-config";



type RemoveVidProps = {
    removeVid:boolean,
    setRemoveVid:(open:boolean)=>void,
    selectedData:WebsiteLinks,
    fetchData:(time:"start")=>void,
    
}

export default function RemoveVid({removeVid,setRemoveVid,selectedData,fetchData}:RemoveVidProps) {
    const handleRemoveTier = async () => { 
        if (!selectedData) 
            { 
                alert("No Review to remove!")
                return
            }; 
        try { 
          const docRef = doc(db, "video_links", selectedData.id); 
          await deleteDoc(docRef); 
          alert("Review removed successfully"); 
          fetchData("start") // Refresh the table data 
          setRemoveVid(false);


        } catch (error) { 
          console.error("Error removing review: ", error); 
          alert("Failed to remove review. Please try again."); 
        } 
      }; 



  return (
    <AlertDialog open={removeVid} onOpenChange={setRemoveVid}>
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
