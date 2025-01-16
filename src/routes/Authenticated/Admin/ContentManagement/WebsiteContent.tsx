import AdminTableHeader from "@/customizedComponents/AdminTableHeader";
import TableHeaderBar from "@/customizedComponents/TableHeader";
import { useEffect, useState } from "react"
import { CiClock2, CiLocationOn } from "react-icons/ci";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { collection, doc, endBefore, getDoc, getDocs, limit, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore";
import { db } from "@/firebase-config";
import CustomizedDropdown from "@/customizedComponents/CustomizedDropdown";
import { IoIosAddCircleOutline } from "react-icons/io";
import WebsiteContentForm from "@/adminComponents/WebsiteContentForm";
import RemoveWebsiteLink from "@/adminComponents/RemoveWebsiteLink";


export type CompanyContactDetails = {
  address:string,
  opening_hours:string, 
};

export type WebsiteLinks = { 
  id: string; 
  name:string;
  link:string;
}; 

export type VideoLinks = {
  name:string,
  url:string
}


const headers = [
  "Link ID","Name","Link Address",
]




export default function WebsiteContent() {
  
  const [loading,setLoading] = useState(true);
  const [baseData,setBaseData] = useState<WebsiteLinks[]|null>(null);
  const [filteredData, setFilteredData] = useState<WebsiteLinks[] | null>(null); // Filtered accounts for display
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  
  const [companyAddress,setCompanyAddress] = useState<CompanyContactDetails | null>(null);
  const [appVideoLinks,setAppVideoLinks] = useState<VideoLinks[] | null>(null);

  const [openForm,setOpenForm] = useState(false);
  const [selectedLink,setSelectedLink] = useState<WebsiteLinks | undefined>(undefined)
  const [removalPopup,setRemovalPopup] = useState<boolean>();

  const pageLimit = 5;
  
  

  const fetchData = async (action: "start" | "next" | "prev") => {

    setLoading(true);
    try {

      let q;
      const accountsRef = collection(db, "website_links");
  
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
      const temp: WebsiteLinks[] = [];
  
      if (!querySnapshot.empty) {
        // Update first and last document references for pagination
        setFirstVisible(querySnapshot.docs[0]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          } as WebsiteLinks;
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
  

    const companyAdRef= doc(db, "company_info", "contact_details");
    const docSnap = await getDoc(companyAdRef);

    const videoRef= doc(db, "company_info", "app_video");
    const vidSnap = await getDoc(videoRef);

    if (docSnap.exists()) {
      setCompanyAddress(docSnap.data() as CompanyContactDetails)
    } else {
      console.log("No such document!");
    }

    if (vidSnap.exists())
    {
      setAppVideoLinks(vidSnap.data().videos as VideoLinks[])
    }

    else{
      console.log("no such document")
    }




    setLoading(false);
  };

  const editLink = async (selectedLink:WebsiteLinks)=>{
    setSelectedLink(selectedLink);
    setOpenForm(true)
  }

  const deleteLink = async (selectedLink:WebsiteLinks)=>{
    setSelectedLink(selectedLink)
    setRemovalPopup(true);
  }

  const addLink= async ()=>{
    setSelectedLink(undefined);
    setOpenForm(true); 
  }




  const dropDowns = [

    { 
      actionName:"Edit Link",
      action:editLink
    },
    {
      actionName:"Delete Link",
      action:deleteLink
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


    

      <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row p-10 gap-7 items-center ">
        {/*GRID LEFT SIDE*/}

          {openForm && 
            <WebsiteContentForm
            openForm={openForm}
            setOpenForm={setOpenForm}
            websiteLink={selectedLink}
            fetchData={fetchData}
            />
          }

          {
            (removalPopup && selectedLink) && 
            <RemoveWebsiteLink
            removalPopup={removalPopup}
            setRemovalPopup={setRemovalPopup}
            fetchData={fetchData}
            selectedData={selectedLink}
            />
          }

        <div className="flex flex-col h-full w-full">
          <AdminTableHeader
                  header="Content Management > Website Content"
                  />  
          {/*ADDRESS BOX*/}  
          <div className="border-2 p-10 my-4 rounded-2xl">
            <h1 className="underline">Company's Contact Details</h1>
            {/*Location*/}
            <div className="flex gap-5 items-center my-5">
            <CiLocationOn size={30}/>
            <h2>{companyAddress?.address}</h2>
            </div>
            
            {/*Opening Hours*/}
            <div className="flex gap-5 items-center my-5">
            <CiClock2 size={30} />
            <h2>{companyAddress?.opening_hours}</h2>
            </div>
          </div>


          {/*Video Link*/}  
          <div className="border-2 p-10 my-4 rounded-2xl">
            <h1 className="underline mb-4">App Video Link</h1>
            
            {appVideoLinks?.map((appVid,index)=>(
            <div className="grid grid-cols-1 md:grid-cols-2 my-6" key={index}>
            <h1 className="font-bold">{appVid.name}</h1>
            <a className="text-sm max-w-5" 
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley">
            {appVid.url}
            </a>
            </div>
            ))}


          </div>
        </div>



        {/*END OF LEFT SIDE*/}  
     
      {/*Actual Table*/}
      <div className="flex border-2 p-8 flex-col rounded-xl w-auto h-auto">
        <div className="flex flex-row justify-between">
            <TableHeaderBar
            mainText="Membership Tier"
              subText="Manage your membership tiers"
              />
              <button
              onClick={addLink} 
              className="btn btn-ghost px-7 bg-[#00ACAC] text-white">
              <IoIosAddCircleOutline size={25} />
                Add Link
                </button>
        </div>



            {/*ACTUAL TABLE*/}
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
                 {filteredData?.map((data) => (
                   <TableRow key={data.id}>
                     <TableCell className="font-medium pe-10">{data.id}</TableCell>
                     <TableCell className="w-40">{data.name}</TableCell>
                     <TableCell className="w-40">
                      <a href={data.link}>
                      {data.link}
                      </a>
                    
                      </TableCell>
 
                     <TableCell className="flex justify-end">
                  
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
                 <TableCell colSpan={headers.length+1} className="pt-8">Showing 1 - {baseData?.length}  Links</TableCell>
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
