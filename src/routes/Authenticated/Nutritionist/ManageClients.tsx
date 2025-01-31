import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contextProvider";

import TableHeaderBar from "@/customizedComponents/TableHeader";
import { db } from "@/firebase-config";
import { ClientAccountType, ClientProfileInfoType } from "@/types/nutritionistTypes";
import { pageLimit } from "@/utils";
import { collection, doc, endBefore, getDoc, getDocs, limit, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const headers = [
  "Avatar", "Client UID", "Name","Email"
];



export default function ManageClients() {

  const [loading,setLoading] = useState(false);
  const [baseData,setBaseData] = useState<ClientAccountType[] | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filteredData, setFilteredData] = useState<ClientAccountType[] | null>(null); // Filtered accounts for display
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);

  const {user} = useAuth();
  const navigate = useNavigate();
    const fetchData = async (action: "start" | "next" | "prev") => {
 
      setLoading(true);
      try {

        let q;
        const accountsRef = collection(db, "accounts",user!.uid,"client_requests");
    
        if (action === "start") {
          // Initial fetch
          q = query(accountsRef, limit(pageLimit));
        } 
        
        else if (action === "next" && lastVisible) {
          // Fetch next page
          q = query(accountsRef, startAfter(lastVisible), limit(pageLimit));
        } 
        
        else if (action === "prev" && firstVisible) {
          // Fetch previous page
          q = query(accountsRef, endBefore(firstVisible), limit(pageLimit));
        } 
        
        else {
          console.warn("Invalid action or missing cursors.");
          setLoading(false);
          return;
        }
    
        const querySnapshot = await getDocs(q);
        const promises: Promise<ClientAccountType>[] = []; // Array to hold promises

        if (!querySnapshot.empty) {
       
              setFirstVisible(querySnapshot.docs[0]);
              setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

            querySnapshot.forEach((snapshot) => {
                const profileRef = doc(db, "accounts", user!.uid, "client_requests", snapshot.id, "profile", "profile_info");
                const promise = getDoc(profileRef).then((profileClient) => { // Create and store promises
                    const clientProfile = profileClient.data() as ClientProfileInfoType;
                    return {
                        uid: snapshot.id,
                        name: snapshot.data().name,
                        role: snapshot.data().role,
                        avatar: clientProfile?.image, // Handle potential undefined image
                        email: snapshot.data().email
                    } as ClientAccountType;
                });
                promises.push(promise); // Add each promise to the array
            });

            // Wait for all promises to resolve
            const temp = await Promise.all(promises);

            setBaseData(temp);
            setFilteredData(temp);

        
        
          // Update state with fetched data
          setBaseData(temp);
          setFilteredData(temp);

        } else {
          console.warn("No documents found.");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    
      setLoading(false);
    };
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter accounts based on the search query
    if (baseData) {
      const filtered = baseData.filter((base) =>
        base.name.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };
  useEffect(()=>{
    fetchData("start");
  },[])


  return (

    <>
    
    {loading?
    
    <div className="flex h-screen w-screen justify-center items-center">
    <span className="loading loading-infinity loading-lg"></span>
    </div>:

    <div className="flex flex-col p-10">
    <div className="flex lg:flex-row justify-between items-center mb-8">
      <h1 className="text-lg">View Clients</h1>
    </div>



    <div className="w-[80vw] h-auto border-2 p-8 rounded-xl">

          {/*TABLE HEADER*/}
            <div className="flex flex-row justify-between">
              {/*Header section*/}
              <TableHeaderBar
              mainText="Manage Clients" subText="Manage your clients and send them tailored advice"
              />

              {/*SEARCH BAR*/}
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by ID"
                  className="input w-full max-w-xs"
                  value={searchQuery}
                  onChange={handleSearchChange} // Handle input changes
                />
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </label>


              
            </div>


      <Table className="my-10">
        <TableHeader>
          <TableRow>
            {headers.map((head, index) => (
              <TableHead key={index}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData?.map((client) => (
            <TableRow key={client.uid}>
              <TableCell>
                <img className="w-20 h-20 border-2 rounded-lg " src={client.avatar} alt="Profile" />
              </TableCell>
              <TableCell className="font-medium">{client.uid}</TableCell>
              <TableCell>
                <p className="w-[150px] truncate">{client.name}</p>
              </TableCell>
              <TableCell className="font-medium">{client.email}</TableCell>
              <TableCell>
                <button className="btn bg-[#00ACAC] text-white" onClick={() => navigate(`/nutri/clientInfo/${client.uid}`)}>Manage</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter className="bg-white">
              <TableRow>
                <TableCell colSpan={headers.length} className="pt-8">Showing 1 - {baseData?.length} Clients</TableCell>
                <TableCell className="text-right pt-8">
       
                   <div> 
                   <button onClick={() => fetchData("prev")} className="mx-6" disabled={!firstVisible}>Prev</button>
                     <button onClick={()=>fetchData("next")}  disabled={!lastVisible} >Next</button>
                   </div>
      
                </TableCell>
              </TableRow>
            </TableFooter>


      </Table>
    </div>
    </div>

    }
    
    </>



  );
}
