import { useAuth } from "@/contextProvider";
import { db} from "@/firebase-config";
import { MembershipTier } from "@/types/userTypes";
import { addDoc, collection,  onSnapshot } from "firebase/firestore";







export default function Membershipbox({
 id,description,unit_amount,currency,interval,management
}:MembershipTier) {


  
  const {user} = useAuth();
  


  const newData = {
    price: id,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
    // ... other data
  };





  // ONLY FOR FIRST TIME USERS
  const startCheckout = async ()=>{
    if (user)
    {
      const checkoutSessionsRef = collection(db, "accounts", user.uid, "checkout_sessions");

      addDoc(checkoutSessionsRef, newData).then((docRef) => {
        onSnapshot(docRef, (snap) => {
          const data = snap.data(); // Get the data, may be undefined
          
          const error = data?.error; // Use optional chaining: if data is undefined, error will be undefined
          const url = data?.url;     // Same for the url
      
          if (error) {
            alert(`An error occurred: ${error.message}`); // error is either a valid error object or undefined
          }
          if (url) {
            window.location.assign(url);

          }
      
          // Important: Add this check to handle the case where the document might exist but have no data yet
          if (!data && snap.exists()) {
            console.log("Document exists but has no data yet.");
            // You might want to display a message to the user or wait for data
          }
      
        });
      }).catch(error => {
        console.error("Error adding document: ", error);
        alert("An error occurred while creating the checkout session.");
      });
    }
  }



  return (
    <div className={`w-full p-6 rounded-2xl 
      shadow-lg border-2 border-[#E8E6E6] flex flex-col items-center text-center mt-5 gap-4`} >

      <h1 className="text-xl font-medium">{description}</h1>
      <h2 className={`text-3xl mt-2 font-bold mb-5`}>$ {unit_amount/100} {currency.toUpperCase()} / {interval}</h2>
    
      {
        management &&
        <button className="btn btn-ghost w-full bg-black text-white" onClick={startCheckout}>Select Tier</button>

      }

    </div>
  )
}
