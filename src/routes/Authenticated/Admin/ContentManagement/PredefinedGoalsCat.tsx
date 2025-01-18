
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { collection, endBefore,   getDocs,  limit, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore";
import { db } from "@/firebase-config";
import CustomizedDropdown from "@/customizedComponents/CustomizedDropdown";
import { IoIosAddCircleOutline } from "react-icons/io";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminTableHeader from "@/customizedComponents/AdminTableHeader";
import TableHeaderBar from "@/customizedComponents/TableHeader";
import { pageLimit } from "@/utils";
import GoalsCatForm from "@/adminComponents/GoalsCatForm";
import RemoveGoalsCat from "@/adminComponents/RemoveGoalsCat";


export type PredefinedGoalsCat = { 
  id:string,
  units:string [],
};


export default function PredefinedGoalsCategories() {


  const [loading,setLoading] = useState(false);

  const headers = [
    "Category ID","Measurement Unit",
  ]

  const [baseData,setBaseData] = useState<PredefinedGoalsCat[]|null>(null);
  const [filteredData, setFilteredData] = useState<PredefinedGoalsCat[] | null>(null); // Filtered accounts for display
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [selectedData,setSelectedData] = useState<PredefinedGoalsCat | null>(null)
  const [openForm,setOpenForm] = useState(false);
  const [removalPopup,setRemovalPopup] = useState<boolean>();

  const fetchData = async (action: "start" | "next" | "prev") => {

    setLoading(true);
    try {

      let q;
      const accountsRef = collection(db, "predefined_goals_categories");
  
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
      const temp: PredefinedGoalsCat[] = [];
  
      if (!querySnapshot.empty) {
        // Update first and last document references for pagination
        setFirstVisible(querySnapshot.docs[0]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          } as PredefinedGoalsCat;
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



  const editData= async (selected:PredefinedGoalsCat)=>{
    setSelectedData(selected)
    setOpenForm(true)
  }

  const addData = async ()=>{
    setSelectedData(null);
    setOpenForm(true);
  }


  const deleteData = async (selected:PredefinedGoalsCat)=>{
    setSelectedData(selected)
    setRemovalPopup(true);
  }




  const dropDowns = [

    { 
      actionName:"Edit Category",
      action:editData
    },
    {
      actionName:"Delete Category",
      action:deleteData
    }

  ]



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


    

      <div className="flex flex-col p-10 gap-7 items-center ">
        {/*GRID LEFT SIDE*/}

   

        <div className="flex flex-col h-full w-full">
          <AdminTableHeader
                  header="Content Management > Predefined Goals Category"
                  />  
        
          </div>



     
      {/*RIGHT SIDE */}
      <div className="flex border-2 p-8 flex-col rounded-xl w-full xl:w-[80vw] h-auto">

      {openForm &&
      <GoalsCatForm
      openForm={openForm}
      setOpenForm={setOpenForm}
      fetchData={fetchData}
      SelectedData={selectedData}
      setLoading={setLoading}
      />
      }

      {(removalPopup && selectedData) && 
      <RemoveGoalsCat
      removalPopup={removalPopup}
      setRemovalPopup={setRemovalPopup}
      selectedData={selectedData}
      fetchData={fetchData}
      />
      }


        <div className="flex flex-row justify-between">
            <TableHeaderBar
            mainText="Predefined Goals Category"
              subText="Manage your predefined goals category"
              />
              <button
              onClick={addData} 
              className="btn btn-ghost px-4 bg-[#00ACAC] text-white">
              <IoIosAddCircleOutline size={25} />
                Add Category
                </button>
        </div>

            <Table className="my-10">
               <TableHeader>
                 <TableRow>
                   {headers.map((head)=>(
                    <TableHead>{head}</TableHead>
                   ))}
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredData?.map((data) => (
                   <TableRow key={data.id}>

                    
                     <TableCell className="font-medium pe-10">{data.id}</TableCell>
          
                     <TableCell>
             
                      {data.units.map((item)=>( 
                       
                       <h2 className="mt-2">{item}</h2>

                      ))}
                      </TableCell>
 

 
                     <TableCell className="flex justify-end mx-4">
                  
                       <CustomizedDropdown 
                       subjectData={data}
                       dropDowns={dropDowns}
                       disableDropdown={true}
                       />
                       
                       </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
 
               <TableFooter className="bg-white">
               <TableRow>
                 <TableCell colSpan={headers.length} className="pt-8">Showing 1 - {baseData?.length} Goals Category</TableCell>
                 <TableCell className="text-right pt-8">
                   <div> 
                   <button onClick={() => fetchData("prev")} className="mx-3" disabled={!firstVisible}>Prev</button>
                     <button onClick={()=>fetchData("next")}  disabled={!lastVisible} >Next</button>
                   </div>
                 </TableCell>
               </TableRow>
             </TableFooter>
             </Table>

         
      </div> 
      <div className=" w-full md:col-span-2 flex justify-end">
                 <Link  to='/admin/predefined-goals' className="btn btn-ghost">
                 <h1 className="text-2xl">Next Page </h1> 
                 </Link>
              
        </div>

      </div>

}


  </>
  )


}
