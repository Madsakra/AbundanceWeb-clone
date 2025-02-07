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
import { WebsiteLinks } from "@/types/adminTypes";



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
                alert("No video link to remove!")
                return;
            }; 
        try { 
          const docRef = doc(db, "video_links", selectedData.id); 
          await deleteDoc(docRef); 
          alert("Video link removed successfully"); 
          fetchData("start") // Refresh the table data 
          setRemoveVid(false);


        } catch (error) { 
          alert("Failed to remove video link. Please try again.");
          return; 
        } 
      }; 



  return (
    <AlertDialog open={removeVid} onOpenChange={setRemoveVid}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-destructive">Remove Video Link? </AlertDialogTitle>
        <AlertDialogDescription className="">
          Do you want to remove  {selectedData.name} video link ? Do note that this action is irreversible!
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
