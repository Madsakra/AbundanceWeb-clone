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
import { useAuth } from "@/contextProvider";
import { db } from "@/firebase-config";

import { ArticlesType } from "@/routes/Authenticated/Nutritionist/ViewArticles";
import { deleteDoc, doc } from "firebase/firestore";


type RemoveArticlesProps = {
    removalPopup:boolean,
    setRemovalPopup:(open:boolean)=>void,
    selectedData:ArticlesType,
    fetchData:(time:"start")=>void,
}


export default function RemoveArticles({removalPopup,setRemovalPopup,selectedData,fetchData}:RemoveArticlesProps) {
    
    const {user} = useAuth();


    const handleRemoveTier = async () => { 
        if (!selectedData) 
            { 
                alert("No Article to remove!")
                return
            }; 
        try { 
            
          const docRef = doc(db, "articles",user!.uid,"written_articles",selectedData.id); 
          await deleteDoc(docRef); 
          alert("Article removed successfully"); 
          fetchData("start") // Refresh the table data 
          setRemovalPopup(false);


        } catch (error) { 
          console.error("Error removing article: ", error); 
          alert("Failed to remove article. Please try again."); 
        } 
      }; 

    return (
    <AlertDialog open={removalPopup} onOpenChange={setRemovalPopup}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-destructive">Remove Article? </AlertDialogTitle>
        <AlertDialogDescription className="">
          Do you want to remove article: {selectedData.title} ? Do note that this action is irreversible!
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
