import { useAuth } from "@/contextProvider";
import { useEffect, useState } from "react";
import Membershipbox from "@/customizedComponents/Membershipbox";
import { collection,  getDocs, orderBy, query } from "firebase/firestore";
import { db, stripeFunctions } from "@/firebase-config";
import { MembershipTier } from "@/types/userTypes";
import { httpsCallable } from "firebase/functions";




export default function Membership() {
  
    const {user} = useAuth();
    const [membershipTiers,setMembershiptiers] = useState<MembershipTier []| null>(null); 
    const [firstTime,setFirstTime] = useState<boolean>(true)
    const [customerURL,setCustomerURL] = useState("");
    
    const checkUserMembership = async()=>{
    if (user)
    {
      const subRef = collection(db, "accounts", user.uid, "subscriptions");
      const subDoc = await getDocs(subRef);
      if (!subDoc.empty)
      {
          setFirstTime(false);
          const functionRef = httpsCallable(stripeFunctions,
            "ext-firestore-stripe-payments-createPortalLink"
          );
          const {data} = await functionRef({
            customerId:user?.uid,
            returnUrl:window.location.origin
          })

          let dataWithUrl = data as {url:string}
          console.log(dataWithUrl.url);
          setCustomerURL(dataWithUrl.url);

      }
    }
      
    }




    const fetchData = async()=>{

      const collectionRef = collection(db, "membership","prod_RgC8KOaMNtX5PL","prices"); 
      const q = query(collectionRef, orderBy("unit_amount", "asc"));

      const snapshot = await getDocs(q); 
      console.log(snapshot);
      const tiersData = snapshot.docs.map((doc) => ({ 
        id:doc.id,
        description: doc.data().description, 
        unit_amount:doc.data().unit_amount, 
        currency: doc.data().currency, 
        interval:doc.data().interval,
      })); 

          setMembershiptiers(tiersData);
          checkUserMembership();
    }






  useEffect(()=>{
    fetchData();

  },[])

  return (
    <div className='w-full h-full flex flex-col gap-4 self-center  items-center '>
      
      {firstTime?
      <>
      <h1 className="text-4xl text-center mt-10 md:mt-20">Membership Management</h1>
      <h3 className="text-center my-2">Please select the following tier to upgrade your account</h3>
      <div 
          className='xl:mt-5 md:w-1/2 h-auto grid grid-cols-1  gap-4 mb-32'>
            {membershipTiers?.map((tier,index)=>{
              if (tier.unit_amount!==0)
              {
                return <Membershipbox {...tier} key={index} management={true}  fetchData={fetchData}/>
              }
              })}
          </div>      
      </>:

      <div className="border-2 rounded-2xl w-96 xl:w-[55%] 
      p-2 xl:p-20 h-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  flex flex-col *:items-center justify-center ">
              <h1 className="text-4xl text-center">Membership Management</h1>
              <h3 className="text-center my-2">Please select the following tier to upgrade your account</h3>
        <a className="btn btn-ghost my-4 bg-[#00ACAC] text-white" href={customerURL}>Manage your membership</a>
      </div>
    
      }


    </div>
  )
}
