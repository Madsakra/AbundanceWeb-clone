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
import { HiOutlineDotsHorizontal } from "react-icons/hi";


type CustomizedDropdownProps = {
    // pass in any subject data
    subjectData:any,
    disableDropdown?:boolean,
    dropDowns:{
        actionName:string,
        action:(params:any)=>any
    }[]
}








export default function CustomizedDropdown({subjectData,dropDowns,disableDropdown}:CustomizedDropdownProps) {
  
  
  const [popUp,setPopup] = useState(false);
  const [focusedAction,setFocusedAction] = useState<{actionName:string,action:(params:any)=>any} | null>(null)

  return (
    <>
    <DropdownMenu>
    <DropdownMenuTrigger className="border-2 btn btn-ghost px-6 py-1 ">
    <HiOutlineDotsHorizontal size={28}/>

    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
   
        {! disableDropdown && dropDowns.map((drop)=>
              <DropdownMenuItem
              onClick={()=>{
                setFocusedAction(drop);
                setPopup(true);
              }}>
                {drop.actionName}
                </DropdownMenuItem>
        )}

        {
          disableDropdown && dropDowns.map((drop)=>
            <DropdownMenuItem
          onClick={()=>{
            drop.action(subjectData);
            
          }}>
            {drop.actionName}
            </DropdownMenuItem>
          )
        }
      
    </DropdownMenuContent>
  </DropdownMenu>    
        {
          !disableDropdown &&

          <AlertDialog open={popUp} onOpenChange={setPopup}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">{focusedAction?.actionName}</AlertDialogTitle>
              <AlertDialogDescription className="">
                Note: This action is irreversible!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={()=>focusedAction?.action(subjectData)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


        }




    </>

  )
}

