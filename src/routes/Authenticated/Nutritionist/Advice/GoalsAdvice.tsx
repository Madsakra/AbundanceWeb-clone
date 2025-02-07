import { useAuth } from "@/contextProvider";
import { db } from "@/firebase-config";
import { PredefinedGoalsType } from "@/types/adminTypes";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface PartialGoals {
    goalID: string;
    categoryID: string;
    min: number;
    max: number;
    unit: string;
}

export default function GoalsAdvice() {

    let { clientID } = useParams();
    let navigate = useNavigate();
    const [clientGoals,setClientGoals] = useState<PredefinedGoalsType[]|undefined>([]);
    const [goalAdvice,setGoalAdvice] = useState("");
    const {user} = useAuth();

    const fetchData = async()=>{
        if (clientID)
        {
            const profileRef = doc(db,"accounts",clientID,"profile","profile_info")
            const profileDoc = await getDoc(profileRef);

            if (profileDoc.exists())
            {
                const goalsWithIDs = profileDoc.data()?.goals?.map((goal:PartialGoals) => ({
                    ...goal, // keep all original properties of the goal
                    id: goal.goalID // set goalID, assuming a custom ID
                })) || [];
            setClientGoals(goalsWithIDs as PredefinedGoalsType[]);
            }

            else{
                setClientGoals([]);
            }
        }
    }


    const sendToClient = async()=>{

        if (goalAdvice.trim()==="")
        {
            alert("Please Comment on your client's goals for their benefit");
            return
        }

        if (clientID && user)
        {
        
            const clientRef = collection(db,"accounts",clientID,"tailored_advice",user.uid,"advice");
            const statusRef = doc(db,"accounts",clientID,"tailored_advice",user.uid)
            const storedData = localStorage.getItem("adviceData");
            if (storedData) {
              const adviceArray = JSON.parse(storedData);
              
              // Ensure the stored data is an array
              if (Array.isArray(adviceArray)) {
                // Find the advice object for the current client
                const adviceForClient = adviceArray.find(
                  (item: { clientID: string }) => item.clientID === clientID
                );

                const combinedData = {
                    title:adviceForClient.title,
                    content:adviceForClient.content,
                    mealPlans:adviceForClient.mealPlan,
                    goalAdvice,
                    timestamp:serverTimestamp(), 
                };
                
                try{
                    await addDoc(clientRef,combinedData);
                    await updateDoc(statusRef,{
                        status:"complete",
                        updatedAt: serverTimestamp(),
                    })

                    // Remove the adviceData for the current client from the array
                    const updatedAdviceArray = adviceArray.filter(
                        (item: { clientID: string }) => item.clientID !== clientID
                    );

                    // Store the updated array back in localStorage
                    localStorage.setItem("adviceData", JSON.stringify(updatedAdviceArray));

                    const nutriClientRef = doc(db,"accounts",user.uid,"client_requests",clientID);
                    const nutriClientSubRef = doc(db,"accounts",user.uid,"client_requests",clientID,"profile","profile_info")
                    await deleteDoc(nutriClientRef);
                    await deleteDoc(nutriClientSubRef);

                    alert("Tailored Advice Sent!");
                    navigate("/nutri")

                }
                catch(err)
                {
                   alert("Failed to send tailored advice.")
                }
            }
            }
        }
    }



    useEffect(()=>{
        fetchData()
    },[clientID])


  return (
    <>

        {clientGoals?
            <div className="p-10 xl:p-20 flex flex-col w-[100vw] lg:w-[80vw]">
            <h1 className="text-2xl font-bold mb-3">Goals</h1>
            <h2 className="mb-5">Give some advice / comments on your clients goals</h2>
            
            {clientGoals.map((goal)=>(
                <div className="flex flex-col mb-10 mt-4" key={goal.id}>
                <h1 className="text-xl font-bold mb-2">{goal.categoryID} </h1>
                <div className="flex flex-row px-8 py-4 bg-[#8797DA] rounded-full">
                    <h1 className="text-xl font-bold text-white"> {goal.min} - {goal.max} / {goal.unit}  - per day </h1>
                    </div>
                </div>
            ))}
        <div className="flex flex-col pl-5 md:pl-0">
          <label htmlFor="input" className="text-lg font-bold">Advice Content</label>
          <textarea
          value={goalAdvice}
          onChange={(e)=>setGoalAdvice(e.target.value)}
          placeholder="Leave some comments on your client's goals"
          className="textarea textarea-bordered textarea-lg md:w-full min-h-96 mt-2 w-[90%] bg-[#F0F0F0]"></textarea>
        </div>


        <div className="flex gap-5 mt-10">
                    <button className="bg-[#D9D9D9] h-14 w-[30%]  btn" onClick={()=>{  navigate(`/nutri/clientInfo/${clientID}`)}}>
                      <h1>Back</h1>
                    </button>
          
                    <button className='btn bg-black  text-white 
                    hover:bg-[#00ACAC] text-lg
                    h-14 w-[70%] flex gap-5' onClick={sendToClient}>
                     Sent to client
                  </button>
                </div>
    
    
    
        </div>:

            <div className="flex h-screen w-screen justify-center items-center">
                <span className="loading loading-infinity loading-lg"></span>
            </div>
    
    
        }


    </>

  )
}
