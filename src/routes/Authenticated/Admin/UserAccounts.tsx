import { db } from "@/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react"



type AppReviewsType = {
  name:string,
  value:number
  id:string,
}


export default function UserAccounts() {



  const [appReviews,setAppReviews] = useState<AppReviewsType []>()


  async function fetchAppReviews(){
    try {
      const appReviewsCollection = collection(db, "app_reviews");
      const snapshot = await getDocs(appReviewsCollection);
      const temp : AppReviewsType [] = []
      snapshot.docs.map(doc => {
        const data = doc.data() as Omit<AppReviewsType, "id">; // Exclude the id temporarily
        temp.push({
          id: doc.id, // Add the document ID directly
          ...data, // Spread the other fields
        });
      });
  
      setAppReviews(temp)
  


    } catch (error) {
      console.error("Error fetching app reviews:", error);
      throw error;
    }
  }





  useEffect(()=>{
    fetchAppReviews();
    
  },[])


  return (
    <div className='w-full h-screen'>
    
      {appReviews?.map((item,index)=>(
      <div className="flex flex-row gap-10 my-10" key={index}>
      <h2>{item.id}</h2>
      <h1>{item.name}</h1>
      <h2>{item.value}</h2>


        <div className="flex flex-col">
        <input type="text" placeholder="number"/>     
          <button className="bg-rose-400 p-4">Change {item.name}</button>
        </div>
     
      <div className="flex flex-col">
      <input type="number" placeholder="number" />
      <button className="bg-rose-400 p-4">Change value</button>
      </div>

      </div>
      
      ))}



    </div>
  )
}
