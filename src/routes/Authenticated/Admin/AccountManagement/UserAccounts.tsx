import { db } from "@/firebase-config"
import { collection, endBefore, getDocs, limit, query, QueryDocumentSnapshot, startAfter, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import CustomizedDropdown from "@/customizedComponents/CustomizedDropdown";
import AdminTableHeader from "@/customizedComponents/AdminTableHeader";
import TableHeaderBar from "@/customizedComponents/TableHeader";
import { ApprovedAccounts } from "@/types/userTypes";
import { deleteAccountAuth, pageLimit, resetPassword } from "@/utils";








// DYNAMIC - NEED TO CHANGE
const headers = [
  "UID","name","email","role"

]

export default function UserAccounts() {

  const [loading,setLoading] = useState(true);
  const [approvedAccounts,setApprovedAccounts] = useState<ApprovedAccounts []|null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filteredAccounts, setFilteredAccounts] = useState<ApprovedAccounts[] | null>(null); // Filtered accounts for display
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);





  const fetchAccounts = async (action: "start" | "next" | "prev") => {

    setLoading(true);
    try {

      let q;
      const accountsRef = collection(db, "accounts");
  
      if (action === "start") {
        // Initial fetch
        q = query(accountsRef, where("role", "!=", "admin"), limit(pageLimit));
      } 
      
      else if (action === "next" && lastVisible) {
        // Fetch next page
        q = query(accountsRef, where("role", "!=", "admin"), startAfter(lastVisible), limit(pageLimit));
      } 
      
      else if (action === "prev" && firstVisible) {
        // Fetch previous page
        q = query(accountsRef, where("role", "!=", "admin"), endBefore(firstVisible), limit(pageLimit));
      } 
      
      else {
        console.warn("Invalid action or missing cursors.");
        setLoading(false);
        return;
      }
  
      const querySnapshot = await getDocs(q);
      const temp: ApprovedAccounts[] = [];
  
      if (!querySnapshot.empty) {
        // Update first and last document references for pagination
        setFirstVisible(querySnapshot.docs[0]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          } as ApprovedAccounts;
          temp.push(data);
        });
  
        // Update state with fetched data
        setApprovedAccounts(temp);
        setFilteredAccounts(temp);
      } else {
        console.warn("No documents found.");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  
    setLoading(false);
  };




  const deleteAccount = async (approvedAccount:ApprovedAccounts)=>{
    setLoading(true);
    const deleted = await deleteAccountAuth(approvedAccount,"accounts");
    if (deleted)
    {
      fetchAccounts("start");
    };
   
  }


  



  const dropDowns = [

    { 
      actionName:"Reset Password",
      action:resetPassword
    },
    {
      actionName:"Delete Account",
      action:deleteAccount
    }

  ]



  useEffect(()=>{
   fetchAccounts("start")
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
      <div className="flex h-screen w-screen justify-center items-center">
          <span className="loading loading-infinity loading-lg"></span>
      </div>

      
      :

        <div className="flex flex-col p-10 gap-7">
     
           {/* Screen Top */}
        
          <AdminTableHeader
          header="Approved accounts"
          />


 




          {/*TABLE*/}
          <div className="w-[80vw] h-auto border-2 p-8 rounded-xl">
            
            {/*TABLE HEADER*/}
            <div className="flex flex-row justify-between">
              {/*Header section*/}
              <TableHeaderBar
              mainText="Accounts"
              subText="Manage your approved accounts"
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
                      
                      <CustomizedDropdown 
                      subjectData={accounts}
                      dropDowns={dropDowns}
                      />
                      
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter className="bg-white">
              <TableRow>
                <TableCell colSpan={headers.length} className="pt-8">Showing 1 - {approvedAccounts?.length} Accounts</TableCell>
                <TableCell className="text-right pt-8">
                  <div> 
                  <button onClick={() => fetchAccounts("prev")} className="mx-6" disabled={!firstVisible}>Prev</button>
                    <button onClick={()=>fetchAccounts("next")}  disabled={!lastVisible} >Next</button>
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
