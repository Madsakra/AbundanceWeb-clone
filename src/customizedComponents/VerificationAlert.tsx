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
    handleVerifyBox:()=>void;
    regStatus:boolean;
    mainMessage:string;
    subMessage:string
}

export default function VerificationAlert({resendEmail,handleVerifyBox,regStatus,mainMessage,subMessage}:VerificationAlertProps) {
  return (
    <AlertDialog open={regStatus}>
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

        <AlertDialogAction onClick={resendEmail}>Resend Email</AlertDialogAction>
        <AlertDialogCancel onClick={handleVerifyBox}>Close</AlertDialogCancel>
        
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
