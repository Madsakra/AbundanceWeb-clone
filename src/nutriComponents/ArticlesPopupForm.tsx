import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

import { ArticlesType } from "@/routes/Authenticated/Nutritionist/ViewArticles";

type ArticlesPopupFormProps = {
    openForm:boolean,
    setOpenForm:(open:boolean)=>void;
    selectedData?:ArticlesType;


}



export default function ArticlesPopupForm({openForm,setOpenForm,selectedData}:ArticlesPopupFormProps) {







    
  return (
    <AlertDialog open={openForm} onOpenChange={setOpenForm}>
    <AlertDialogContent>
      <AlertDialogHeader>

        {selectedData?
        <AlertDialogTitle>Edit article</AlertDialogTitle>:
        <AlertDialogTitle>Add article</AlertDialogTitle>     
    }
   
        <AlertDialogDescription>
             
                {selectedData?.description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}
