
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
import PredefinedGoalsForm from "@/adminComponents/PredefinedGoalsForm";
import RemovePredefinedGoals from "@/adminComponents/RemovePredefinedGoals";
import { PredefinedGoalsType } from "@/types/adminTypes";










export default function PredefinedGoals() {


    const [loading,setLoading] = useState(false);

    const headers = [
      "Goal ID","Category ID","Minimum Value","Max Value","Measurement Unit",
    ]

  const [baseData,setBaseData] = useState<PredefinedGoalsType[]|null>(null);
  const [filteredData, setFilteredData] = useState<PredefinedGoalsType[] | null>(null); // Filtered accounts for display
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [selectedData,setSelectedData] = useState<PredefinedGoalsType | null>(null)
  const [openForm,setOpenForm] = useState(false);
  const [removalPopup,setRemovalPopup] = useState<boolean>();

  const fetchData = async (action: "start" | "next" | "prev") => {
    setOpenForm(false);
    setLoading(true);
    
    try {
      let q;
      const accountsRef = collection(db, "predefined_goals_categories");
  
      if (action === "start") {
        q = query(accountsRef, limit(pageLimit));
      } else if (action === "next" && lastVisible) {
        q = query(accountsRef, startAfter(lastVisible), limit(pageLimit));
      } else if (action === "prev" && firstVisible) {
        q = query(accountsRef, endBefore(firstVisible), limit(pageLimit));
      } else {
        console.warn("Invalid action or missing cursors.");
        setLoading(false);
        return;
      }
  
      const querySnapshot = await getDocs(q);
      const temp: PredefinedGoalsType[] = [];
  
      if (!querySnapshot.empty) {
        // Update first and last document references for pagination
        setFirstVisible(querySnapshot.docs[0]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  
        // Fetch subcollection data with a limit
        const subcollectionPromises = querySnapshot.docs.map(async (doc) => {
          const goalsSubcollection = collection(doc.ref, "predefined_goals");
          const subcollectionQuery = query(goalsSubcollection, limit(pageLimit)); // Add subcollection limit here
          const subcollectionSnapshot = await getDocs(subcollectionQuery);
          
          subcollectionSnapshot.forEach((subdoc) => {
            temp.push({
              id: subdoc.id,
              ...subdoc.data(),
            } as PredefinedGoalsType);
          });
        });
  
        // Wait for all subcollection queries to complete
        await Promise.all(subcollectionPromises);
  
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



  const editData= async (selected:PredefinedGoalsType)=>{
    setSelectedData(selected)
    setOpenForm(true)
  }

  const addData = async ()=>{
    setSelectedData(null);
    setOpenForm(true);
  }


  const deleteData = async (selected:PredefinedGoalsType)=>{
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


return(
    <>
   

    {loading? 
    <div className="flex h-screen w-screen justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
    </div>

    
    :


    

      <div className="flex flex-col p-10 gap-7 items-center ">
        {/*GRID LEFT SIDE*/}

       {openForm &&
         <PredefinedGoalsForm
         openForm={openForm}
         setOpenForm={setOpenForm}
         fetchData={fetchData}
         SelectedData={selectedData}
         />
         }
   

         {
          (removalPopup && selectedData) &&
          <RemovePredefinedGoals
          removalPopup={removalPopup}
          setRemovalPopup={setRemovalPopup}
          selectedData={selectedData}
          fetchData={fetchData}
          />
         }

        <div className="flex flex-col h-full w-full">
          <AdminTableHeader
                  header="Content Management > Predefined Goals Category"
                  />  
        
          </div>



     
      {/*RIGHT SIDE */}
      <div className="flex border-2 p-8 flex-col rounded-xl w-full xl:w-[80vw] h-auto">



        <div className="flex flex-row justify-between">
            <TableHeaderBar
            mainText="Predefined Goals"
              subText="Manage your predefined goals"
              />
              <button
              onClick={addData} 
              className="btn btn-ghost px-4 bg-[#00ACAC] text-white">
              <IoIosAddCircleOutline size={25} />
                Add Predefined Goals
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
                     <TableCell>{data.categoryID}</TableCell>
                    <TableCell>{data.min}</TableCell>
                    <TableCell>{data.max}</TableCell>
                    <TableCell>{data.unit}</TableCell>

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
      <div className=" w-full md:col-span-2 flex">
                 <Link  to='/admin/predefined-goals-category' className="btn btn-ghost">
                 <h1 className="text-2xl">Previous Page </h1> 
                 </Link>
              
        </div>

      </div>

}


  </>
  )

}
