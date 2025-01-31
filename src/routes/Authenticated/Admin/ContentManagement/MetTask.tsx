import { db } from "@/firebase-config"

import { collection, endBefore, getDocs, limit, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore";
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
import { IoIosAddCircleOutline } from "react-icons/io";
import { pageLimit } from "@/utils";
import MET_TaskForm from "@/adminComponents/MET_TaskForm";
import RemoveMET from "@/adminComponents/RemoveMET";
import { MET_Task_Type } from "@/types/adminTypes";



export const reviewHeaders = [
    "ID","Task Name","Value"
  ]

export default function MetTask() {


  const [loading,setLoading] = useState(true);
  const [baseData,setBaseData] = useState<MET_Task_Type[]|null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [filteredData, setFilteredData] = useState<MET_Task_Type[] | null>(null); // Filtered accounts for display
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);


  const [openForm,setOpenForm] = useState(false);
  const [selectedData,setSelectedData] = useState<MET_Task_Type | undefined>(undefined)
  const [removalPopup,setRemovalPopup] = useState<boolean>();

  const fetchData = async (action: "start" | "next" | "prev") => {

    setLoading(true);
    try {

      let q;
      const accountsRef = collection(db, "MET_tasks");
  
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
      const temp: MET_Task_Type[] = [];
  
      if (!querySnapshot.empty) {
        // Update first and last document references for pagination
        setFirstVisible(querySnapshot.docs[0]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          } as MET_Task_Type;
          temp.push(data);
        });
  
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

  const editTask = async (selected:MET_Task_Type)=>{
    setSelectedData(selected);
    setOpenForm(true)
  }

  const deleteTask = async (selected:MET_Task_Type)=>{
    setSelectedData(selected);
    setRemovalPopup(true);
  }

  const addTask= async ()=>{
    setSelectedData(undefined);
    setOpenForm(true); 
  };

  const dropDowns = [
    { 
      actionName:"Edit Task",
      action:editTask
    },
    {
      actionName:"Delete Link",
      action:deleteTask
    }
  ];


  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter accounts based on the search query
    if (baseData) {
      const filtered = baseData.filter((rev) =>
        rev.id.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };


  useEffect(()=>{
    fetchData("start")
   },[]);


  return (
    <>
   

      {loading? 
      <div className="flex h-screen w-screen justify-center items-center">
          <span className="loading loading-infinity loading-lg"></span>
      </div>

      
      :

        <div className="flex flex-col p-10 gap-7">
          
          {openForm &&
          <MET_TaskForm
          openForm={openForm}
          setOpenForm={setOpenForm}
          selectedData={selectedData}
          fetchData={fetchData}
          variation="App"
          />
          }

        {
            (removalPopup && selectedData) && 
              <RemoveMET
              removalPopup={removalPopup}
              setRemovalPopup={setRemovalPopup}
              selectedData={selectedData}
              fetchData={fetchData}
              />
          }
 
           {/* Screen Top */}
           <div className="flex flex-col md:flex-row justify-between">
          <AdminTableHeader
          header="Predefined MET_TASK"
          />    
          <button className="btn btn-ghost bg-[#00ACAC] text-white py-2 px-7" onClick={addTask}>
          <IoIosAddCircleOutline size={24} />
            Add MET Task
            </button>
          </div>

          {/*TABLE*/}
          <div className="w-[80vw] h-auto border-2 p-8 rounded-xl">
            
            {/*TABLE HEADER*/}
            <div className="flex flex-row justify-between">
              {/*Header section*/}
              <TableHeaderBar
              mainText="Predefined MET_TASK"
              subText="Manage your Predefined MET_TASK so that your users can upload calories output"
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
                  {reviewHeaders.map((head)=>(
                   <TableHead>{head}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData?.map((rev) => (
                  <TableRow key={rev.id}>
                    <TableCell className="font-medium">{rev.id}</TableCell>
                    <TableCell>{rev.name}</TableCell>
                    <TableCell>{rev.value}</TableCell>
                    <TableCell className="flex justify-end">
                      
                      <CustomizedDropdown 
                      subjectData={rev}
                      dropDowns={dropDowns}
                      disableDropdown={true}
                      />
                      
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter className="bg-white">
              <TableRow>
                <TableCell colSpan={reviewHeaders.length} className="pt-8">Showing 1 - {baseData?.length} Predefined Review (App)</TableCell>
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

  )
}
