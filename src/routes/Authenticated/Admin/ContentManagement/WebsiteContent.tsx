import AdminTableHeader from "@/customizedComponents/AdminTableHeader";
import TableHeaderBar from "@/customizedComponents/TableHeader";
import { useEffect, useState } from "react"
import { CiLocationOn } from "react-icons/ci";
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
import { FaRegPenToSquare } from "react-icons/fa6";
import EditAddress from "@/adminComponents/EditAddress";

import { Link } from "react-router-dom";
import { CiPhone } from "react-icons/ci";
import WebsiteVideoForm from "@/adminComponents/WebsiteVideoForm";
import RemoveVid from "@/adminComponents/RemoveVid";
import { pageLimit } from "@/utils";

export type CompanyContactDetails = {
  address:string,
  openingTime:string,
  closingTime:string,
  embeddedLink:string,
  phone:string, 

};

export type WebsiteLinks = { 
  id: string; 
  name:string;
  link:string;
}; 




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
  const [appVideoLinks,setAppVideoLinks] = useState<WebsiteLinks[] | null>(null);

  const [openForm,setOpenForm] = useState(false);
  const [selectedLink,setSelectedLink] = useState<WebsiteLinks | undefined>(undefined)
  const [removalPopup,setRemovalPopup] = useState<boolean>();
  const [editAddress,setEditAddress] = useState(false);
  
  


  const [selectedVid,setSelectedVid] = useState<WebsiteLinks|null>(null);
  const [vidLinkForm,setVidLinkForm] = useState(false);
  const [removeVid,setRemoveVid] = useState(false);


  
  

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

 
    const vidSnap = await getDocs(collection(db, "video_links"));
    

    if (docSnap.exists()) {
      setCompanyAddress(docSnap.data() as CompanyContactDetails)
    } else {
      console.log("No such document!");
    }

    if (vidSnap)
    {
      let temp:WebsiteLinks[] = [];
      vidSnap.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        } as WebsiteLinks;
        temp.push(data);
      });

      setAppVideoLinks(temp);
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


  const addVideoLink = async ()=>{
    setSelectedVid(null);
    setVidLinkForm(true);
  };

  const editVideoLink = async (selectedVid:WebsiteLinks)=>{
    setSelectedVid(selectedVid);
    setVidLinkForm(true);
  };

  const removeVideoLink = async (selectedVid:WebsiteLinks)=>{
    setSelectedVid(selectedVid);
    setRemoveVid(true);
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


  const videoLinksDropdown = [
    {
      actionName:"Edit Video Link",
      action:editVideoLink
    },
    {
      actionName:"Remove Video Link",
      action:removeVideoLink
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

          {
            editAddress &&
            <EditAddress
            companyAddress={companyAddress}
            fetchData={fetchData}
            editAddress={editAddress}
            setEditAddress={setEditAddress}
            />

          }



          {
            vidLinkForm && 
            <WebsiteVideoForm
              vidLinkForm={vidLinkForm}
              setVidLinkForm={setVidLinkForm}
              fetchData={fetchData}
              video={selectedVid}
            />
          }

          {
            (selectedVid && removeVid) && 
            <RemoveVid
            removeVid={removeVid}
            setRemoveVid={setRemoveVid}
            fetchData={fetchData}
            selectedData={selectedVid}
            />
          }

        <div className="flex flex-col h-full w-full">
          <AdminTableHeader
                  header="Content Management > Website Content"
                  />  
          {/*ADDRESS BOX*/}  
          <div className="border-2 p-10 my-4 rounded-2xl">
            <div className="flex flex-row justify-between">
            <h1 className="underline">Company's Contact Details</h1>
            <button onClick={()=>setEditAddress(true)}>
              <FaRegPenToSquare size={25}/>
            </button>

            </div>
            {/*Location*/}
            <div className="flex-col gap-5 my-5">
              <div className="flex gap-5 items-center">
              <CiLocationOn size={30}/>
              <h2>{companyAddress?.address}</h2>
              </div>

            <div className="flex flex-col my-8">
            <h1>Embedded Address:</h1>
            <h3 className="truncate">{companyAddress?.embeddedLink}</h3>

            </div>
            </div>
            
            {/*Phone*/}

            <div className="flex gap-4 items-center mt-10">
              <CiPhone size={30}/>
              <h3>{companyAddress?.phone}</h3>
            </div>

          </div>


          {/* EDIT Video Link*/}  
          <div className="border-2 p-10 my-4 rounded-2xl">


          <div className="flex flex-row justify-between">
            <TableHeaderBar
            mainText="Website Video Links"
              subText="Manage your video(s) displayed on home screen"
              />
              <button
              onClick={addVideoLink} 
              className="btn btn-ghost px-7 bg-[#00ACAC] text-white">
              <IoIosAddCircleOutline size={25} />
                Add Link
                </button>
             </div>
        
             <Table className="my-10">
               <TableHeader>
                 <TableRow>    
                    <TableHead>Video Name</TableHead>
                    <TableHead>Video Link</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {appVideoLinks?.map((data,index) => (
                   <TableRow key={index}>
                     <TableCell className="w-40">{data.name}</TableCell>
                     <TableCell className="w-40">
                      <a href={data.link}>
                      {data.link}
                      </a>
                    
                      </TableCell>
 
                     <TableCell className="flex justify-end mx-4">
                  
                       <CustomizedDropdown 
                       subjectData={data}
                       dropDowns={videoLinksDropdown}
                       disableDropdown={true}
                       />
                       
                       </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
 
               <TableFooter className="bg-white">
             </TableFooter>
             </Table>
          </div>
        </div>
        {/* END OF EDIT Video Link*/}  


        {/*END OF LEFT SIDE*/}  
     
      {/*RIGHT SIDE */}
      <div className="flex border-2 p-8 flex-col rounded-xl w-auto h-auto">
        <div className="flex flex-row justify-between">
            <TableHeaderBar
            mainText="Social Media Links"
              subText="Manage your socail media links to reach more audience"
              />
              <button
              onClick={addLink} 
              className="btn btn-ghost px-7 bg-[#00ACAC] text-white">
              <IoIosAddCircleOutline size={25} />
                Add Link
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
                     <TableCell className="w-40">{data.name}</TableCell>
                     <TableCell className="w-40">
                      <a href={data.link}>
                      {data.link}
                      </a>
                    
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
                 <TableCell colSpan={headers.length} className="pt-8">Showing 1 - {baseData?.length}  Links</TableCell>
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
                 <Link  to='/admin/app-features' className="btn btn-ghost">
                 <h1 className="text-2xl">Next Page </h1> 
                 </Link>
              
        </div>

      </div>

}


  </>
  )
}
