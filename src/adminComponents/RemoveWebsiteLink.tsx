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
import { WebsiteLinks } from "@/types/adminTypes";
import { deleteDoc, doc } from "firebase/firestore";


type RemoveWebsiteLinkProps = {
    removalPopup:boolean,
    setRemovalPopup:(open:boolean)=>void,
    selectedData:WebsiteLinks,
    fetchData:(time:"start")=>void
}


export default function RemoveWebsiteLink({removalPopup,setRemovalPopup,selectedData,fetchData}:RemoveWebsiteLinkProps) {


    const handleRemoveTier = async () => { 
        if (!selectedData) 
            { 
                alert("No tier to remove!")
                return
            }; 
        try { 
          const docRef = doc(db, "website_links", selectedData.id); 
          await deleteDoc(docRef); 
          alert("Website Links removed successfully"); 
          fetchData("start") // Refresh the table data 
            setRemovalPopup(false);


        } catch (error) { 
          console.error("Error removing website links: ", error); 
          alert("Failed to remove website link. Please try again."); 
        } 
      }; 



  return (
    <AlertDialog open={removalPopup} onOpenChange={setRemovalPopup}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-destructive">Remove Website Link?</AlertDialogTitle>
        <AlertDialogDescription className="">
          Do you want to remove {selectedData.name} link ? Do note that this action is irreversible!
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
