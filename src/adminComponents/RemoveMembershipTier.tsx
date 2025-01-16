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
import { MembersipTier } from "@/routes/Authenticated/Admin/ContentManagement/MembershipPrice"
import { deleteDoc, doc } from "firebase/firestore";


type RemoveMembershipTierProps = {
    removeTierPopup:boolean,
    setRemoveTierPopup:(open:boolean)=>void,
    selectedTier:MembersipTier,
    fetchData:()=>void
}


export default function RemoveMembershipTier({removeTierPopup,setRemoveTierPopup,selectedTier,fetchData}:RemoveMembershipTierProps) {


    const handleRemoveTier = async () => { 
        if (!selectedTier) 
            { 
                alert("No tier to remove!")
                return
            }; 
        try { 
          const docRef = doc(db, "membership", selectedTier.id); 
          await deleteDoc(docRef); 
          alert("Membership tier removed successfully"); 
          fetchData() // Refresh the table data 
            setRemoveTierPopup(false);


        } catch (error) { 
          console.error("Error removing tier: ", error); 
          alert("Failed to remove tier. Please try again."); 
        } 
      }; 



  return (
    <AlertDialog open={removeTierPopup} onOpenChange={setRemoveTierPopup}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-destructive">Remove Membershhip Tier</AlertDialogTitle>
        <AlertDialogDescription className="">
          Do you want to remove {selectedTier.tier_name} tier? Do note that this action is irreversible!
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
