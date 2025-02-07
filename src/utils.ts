import { sendPasswordResetEmail } from "firebase/auth";
import { ApprovedAccounts,PendingAccounts } from "./types/userTypes";
import { auth, db, functions } from "./firebase-config";
import { httpsCallable } from "firebase/functions";
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";
import { Dayjs } from "dayjs";
import { CalorieLogType, GlucoseLogType, LogEntry } from "./types/nutritionistTypes";




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


export const deleteAccountAuth = async(account:ApprovedAccounts | PendingAccounts)=>{
   
    try{
      const deleteAccount = httpsCallable(functions,'deleteAccount');
      //delete from auth side first
      
      const data = {
        uid:account.id
      }
      const responseJSON = await deleteAccount(data);
      const responseProperty = responseJSON.data
      console.log(responseProperty);
      await deleteDoc(doc(db, "accounts",account.id));
      alert("Account Deleted");
      return true;
    }
  
    catch(err)
    {
      console.log(err)
      alert(err);
    }

  }

  export const createAccount = async (email:string,password:string,userName:string)=>{
    const createAccount = httpsCallable(functions,'addAccount');
    const data = {
      email:email,
      password:password,
    }

    const responseJSON = await createAccount(data);
    const responseProperty = responseJSON.data as any
    const newUID = responseProperty.id as string
    const docRef =  doc(db, "accounts",newUID);

        await setDoc(docRef, {
          name:userName,
          email:email,
          role:"admin",
        });

    return true;
    
  }

  export const pageLimit = 6;


export const fetchDataByDate = async (clientID:string, subcollectionName:string, date:Dayjs)=>{

  const accountsCollection = collection(db, "accounts");
  const userDocRef = doc(accountsCollection, clientID);

  const subcollectionRef = collection(userDocRef, subcollectionName);

  // 1. Convert Day.js object to Timestamp
  const startOfDay = date.startOf('day'); // Day.js start of day
  const endOfDay = date.endOf('day');     // Day.js end of day

  const startTimestamp = Timestamp.fromDate(startOfDay.toDate());
  const endTimestamp = Timestamp.fromDate(endOfDay.toDate());

  // query db
  const q = query(
    subcollectionRef,
    where("timestamp",">=",startTimestamp),
    where("timestamp","<=",endTimestamp),
    orderBy("timestamp")
  );
  try{
    const querySnapshot = await getDocs(q);

    let temp: (CalorieLogType | GlucoseLogType)[] = [];

    

    querySnapshot.forEach((doc) => {
    

      if (subcollectionName==="calories")
      {
        temp.push(doc.data() as CalorieLogType);
      }
      else if (subcollectionName==="glucose-logs")
      {
        temp.push(doc.data() as GlucoseLogType);
      } 
    });
    
    return temp;

  }
  catch(err)
  {
    console.log(err);
    return[];
  }
}

export const mergeAndSort = (calorieLogs:CalorieLogType[],glucoseLogs:GlucoseLogType[])=>{

  // merge both and sort
  const combinedLogs:LogEntry[] = [...calorieLogs,...glucoseLogs];

  // sort in ascending order based on time stamp

  combinedLogs.sort((a,b)=>a.timestamp.toMillis() - b.timestamp.toMillis());

  return combinedLogs;

}