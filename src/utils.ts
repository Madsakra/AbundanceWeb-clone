import { sendPasswordResetEmail } from "firebase/auth";
import { ApprovedAccounts } from "./vite-env";
import { auth, db, functions } from "./firebase-config";
import { httpsCallable } from "firebase/functions";
import { deleteDoc, doc, setDoc } from "firebase/firestore";



export const resetPassword = async (account:ApprovedAccounts)=>{

    sendPasswordResetEmail(auth,account.email)
    .then(() => {
      // Password reset email sent!
      alert("Password Reset Email sent")
      // ..
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
      // ..
    })
  }


export const deleteAccountAuth = async(account:ApprovedAccounts,collectionName:string)=>{
   
    try{
      const deleteAccount = httpsCallable(functions,'deleteAccount');
      //delete from auth side first
      
      const data = {
        uid:account.id
      }
      const responseJSON = await deleteAccount(data);
      const responseProperty = responseJSON.data
      console.log(responseProperty);
      await deleteDoc(doc(db, collectionName,account.id));
      alert("Account Deleted");
      return true;
    }
  
    catch(err)
    {
      console.log(err)
      alert(err);
    }

  }

  export const createAccount = async (email:string,password:string,userName:string,collectionName:string)=>{
    const createAccount = httpsCallable(functions,'addAccount');
    const data = {
      email:email,
      password:password,
    }

    const responseJSON = await createAccount(data);
    const responseProperty = responseJSON.data as any
    const newUID = responseProperty.id as string
    const docRef =  doc(db, collectionName,newUID);

        await setDoc(docRef, {
          name:userName,
          email:email,
          role:"admin",
        });

    return true;
    
  }
