import { db, functions } from "@/firebase-config"
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"




type ViewAccountsResponse = {
  users: User[];
};

type ApprovedAccounts = {
  id:string,
  name:string,
  role:string,
  email:string,
};

const headers = [
  "UID","name","email","role"

]

export default function UserAccounts() {

  const [loading,setLoading] = useState(true);
  const [approvedAccounts,setApprovedAccounts] = useState<ApprovedAccounts []|null>(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filteredAccounts, setFilteredAccounts] = useState<ApprovedAccounts[] | null>(null); // Filtered accounts for display



  const viewApprovedAccounts = async () =>{

    const viewAccounts = httpsCallable<{}, ViewAccountsResponse>(functions, 'viewAccounts');
    const result = await viewAccounts({});
 
    
        // Fetch all accounts from Firestore
        const querySnapshot = await getDocs(collection(db, "accounts"));
       
        // Assuming `approvedAccounts` is an array of user objects with an `id` field
        const filteredAccounts = querySnapshot.docs.filter((doc) =>
          result.data.users.some((user) => user.uid === doc.id)
        );

          // Map `doc.data()` for each filtered document and set it to state
          const filteredData = filteredAccounts.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name, // Ensure Firestore has this field
              role: data.role, // Ensure Firestore has this field
              email: data.email, // Ensure Firestore has this field
            } as ApprovedAccounts;
          });

          console.log(filteredData);

          setApprovedAccounts(filteredData);
          setFilteredAccounts(filteredData); // Initially, display all accounts
          setLoading(false);

          
  }


  useEffect(()=>{
    viewApprovedAccounts();
  },[])

  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter accounts based on the search query
    if (approvedAccounts) {
      const filtered = approvedAccounts.filter((account) =>
        account.id.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredAccounts(filtered);
    }
  };

  return (
 
    <>
   

      {loading? 
      <div className="className='flex h-screen w-screen justify-center items-center">
          <span className="loading loading-infinity loading-lg"></span>
      </div>

      
      :

        <div className="flex flex-col p-10 gap-7">
         
           {/* Screen Top */}
         <h1 className=" font-medium text-lg text-[#656363]">Account Management - Accounts (Approved)</h1>
         
          {/*TABLE*/}
          <div className="w-[80vw] h-auto border-2 p-8 rounded-xl">
            
            {/*TABLE HEADER*/}
            <div className="flex flex-row justify-between">
              {/*Header section*/}
              <div className="flex flex-col gap-1">
              <h2 className="text-4xl">Accounts</h2>
              <h3>Manage your user accounts</h3>
              </div>

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
           


            {/*ACTUAL TABLE*/}
            <Table className="my-10">
              
              <TableHeader>
                <TableRow>
 
                  {headers.map((head)=>(
                   <TableHead>{head}</TableHead>

                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts?.map((accounts) => (
                  <TableRow key={accounts.id}>
                    <TableCell className="font-medium">{accounts.id}</TableCell>
                    <TableCell>{accounts.name}</TableCell>
                    <TableCell>{accounts.email}</TableCell>
                    <TableCell>{accounts.role}</TableCell>
                    <TableCell className="flex justify-end">
                      
                      <button className="bg-[#00ACAC] btn-ghost px-4 py-3 rounded text-white font-bold ">View More</button>
                      
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter className="bg-white">
              <TableRow>
                <TableCell colSpan={headers.length} className="pt-8">Showing 1 - {approvedAccounts?.length} Accounts</TableCell>
                <TableCell className="text-right pt-8">
                  <div> 
                    <button className="mx-6">Prev</button>
                    <button>Next</button>
                  </div>
                </TableCell>
              </TableRow>
              
            </TableFooter>

    
            </Table>


          </div>





        </div>
    
    }
    



    </>
  )
}
