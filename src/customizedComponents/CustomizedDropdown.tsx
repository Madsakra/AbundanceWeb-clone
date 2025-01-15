import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useState } from "react"
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



type CustomizedDropdownProps = {
    // pass in any subject data
    subjectData:any,
    dropDowns:{
        actionName:string,
        action:(params:any)=>any
    }[]
}








export default function CustomizedDropdown({subjectData,dropDowns}:CustomizedDropdownProps) {
  
  
  const [popUp,setPopup] = useState(false);
  const [focusedAction,setFocusedAction] = useState<{actionName:string,action:(params:any)=>any} | null>(null)

  return (
    <>
    <DropdownMenu>
    <DropdownMenuTrigger className="border-2 btn btn-ghost px-6 py-1 bg-[#00ACAC] text-white">Open</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
   
        {dropDowns.map((drop)=>
              <DropdownMenuItem
              onClick={()=>{
                setFocusedAction(drop);
                setPopup(true);
              }}>
                {drop.actionName}
                </DropdownMenuItem>
        )}
      
    </DropdownMenuContent>
  </DropdownMenu>    
    
        <AlertDialog open={popUp} onOpenChange={setPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">{focusedAction?.actionName}</AlertDialogTitle>
            <AlertDialogDescription className="">
              Note that this action is not irreversible!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={()=>focusedAction?.action(subjectData)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>



    </>

  )
}

