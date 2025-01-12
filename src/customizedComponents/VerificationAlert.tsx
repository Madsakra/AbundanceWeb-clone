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

import { IoMdCheckboxOutline } from "react-icons/io";

type VerificationAlertProps = {
    resendEmail:()=>void;
    logOut:()=>void;
    mainMessage:string;
    subMessage:string
}

export default function VerificationAlert({resendEmail,mainMessage,subMessage,logOut}:VerificationAlertProps) {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl my-2 gap-4 flex flex-row items-center">
            {mainMessage}
            <IoMdCheckboxOutline size={30} />
        </AlertDialogTitle>


          <AlertDialogDescription>
           {subMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          
        <AlertDialogCancel onClick={logOut}>Log Out</AlertDialogCancel>
        <AlertDialogAction onClick={resendEmail}>Resend Email</AlertDialogAction>
   
        
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
