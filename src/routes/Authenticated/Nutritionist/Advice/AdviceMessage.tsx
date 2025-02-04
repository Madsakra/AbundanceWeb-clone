import { db } from "@/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GiMeal } from "react-icons/gi";

export default function AdviceMessage() {

    let { clientID } = useParams();
    let navigate = useNavigate();

    const [client, setClient] = useState<{image:string,name:string,id:string,email:string} | undefined>(undefined);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");


    const handleSave = () => {
      if (!clientID) return;
      if (title.trim()===""||content.trim()==="")
      {
        alert("Please Enter the title and message content of your tailored advice!")
        return;
      }

      // Get existing stored data
      const storedData = localStorage.getItem("adviceData");
      let adviceArray = storedData ? JSON.parse(storedData) : [];
    
      // Ensure adviceArray is an array
      if (!Array.isArray(adviceArray)) {
        adviceArray = [];
      }
    
      // Check if advice already exists for this client
      const existingIndex = adviceArray.findIndex((item: { clientID: string }) => item.clientID === clientID);
    
      if (existingIndex !== -1) {
        // Update existing advice
        adviceArray[existingIndex] = { clientID, title, content };
      } else {
        // Add new advice
        adviceArray.push({ clientID, title, content });
      }
    
      // Save updated array back to localStorage
      localStorage.setItem("adviceData", JSON.stringify(adviceArray));
    
      navigate(`/nutri/advice/${clientID}/mealPlan`);
    };
    
    useEffect(() => {
      // Fetch stored data from local storage
      const storedData = localStorage.getItem("adviceData");
      if (storedData) {
        const adviceArray = JSON.parse(storedData);
    
        // Ensure it's an array before searching
        if (Array.isArray(adviceArray)) {
          const adviceForClient = adviceArray.find((item: { clientID: string }) => item.clientID === clientID);
    
          if (adviceForClient) {
            setTitle(adviceForClient.title);
            setContent(adviceForClient.content);
          }
        }
      }
    }, [clientID]); // Runs when clientID changes

    useEffect(() => {
      const fetchClientData = async () => {
        try {
          const accountRef = doc(db, "accounts", clientID!);
          const accountDoc = await getDoc(accountRef);
  
          const profileRef = doc(db, "accounts", clientID!, "profile", "profile_info");
          const profileDoc = await getDoc(profileRef);
  
          if (accountDoc.exists()) {
            setClient({
              image: profileDoc.exists() ? profileDoc.data().image || "https://via.placeholder.com/150" : "https://via.placeholder.com/150",
              name: accountDoc.data().name || "Unknown",
              id: accountDoc.id,
              email:accountDoc.data().email
            });
          }
        } catch (err) {
          console.error("Error fetching client data:", err);
        }
      };
  
      fetchClientData();
    }, [clientID]);


  return (
    <>
      {client !==undefined?
      <div className="flex flex-col lg:p-20 gap-10 w-screen md:w-[80vw]">

        <div className="flex flex-col lg:flex-row gap-10 w-full items-center">
          <img src={client.image} alt="client Avatar"  className="w-48 h-48 rounded object-cover" />
          <div className="flex flex-col gap-2">
            <h1 className="text-6xl">{client.name}</h1>
            <h2 className="text-lg">ID: {client.id}</h2>
            <h3 className="text-lg">Email: {client.email}</h3>  
          </div>
        </div>

        <div className="flex flex-col pl-5 md:pl-0">
          <label htmlFor="input" className="text-lg font-bold">Advice Title</label>
          <input 
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          type="text" placeholder="Type here" 
          className="input mt-2 w-[90%] md:w-full bg-[#F0F0F0]" />
        </div>

        <div className="flex flex-col pl-5 md:pl-0">
          <label htmlFor="input" className="text-lg font-bold">Advice Content</label>
          <textarea
          value={content}
          onChange={(e)=>setContent(e.target.value)}
          placeholder="Enter your Advice content here"
          className="textarea textarea-bordered textarea-lg md:w-full min-h-96 mt-2 w-[90%] bg-[#F0F0F0]"></textarea>
        </div>

        <div className="flex gap-5">
          <button className="bg-[#D9D9D9] h-14 w-[30%]  btn" onClick={()=>{navigate(`/nutri/clientInfo/${client.id}`)}}>
            <h1>Back</h1>
          </button>

          <button className='btn bg-black  text-white 
          hover:bg-[#00ACAC] text-lg
          h-14 w-[70%] flex gap-5' onClick={handleSave}>
            Prepare Meal Plans
            <GiMeal size={25} />
        </button>



        </div>


      </div>
      
      
      :
        
      <div className="flex h-screen w-screen justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    
      }
    
    
    
    
    
    </>
  )
}
