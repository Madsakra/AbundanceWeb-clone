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
import AdminTableHeader from "@/customizedComponents/AdminTableHeader"
import CustomizedDropdown from "@/customizedComponents/CustomizedDropdown"
import TableHeaderBar from "@/customizedComponents/TableHeader"
import { db } from "@/firebase-config"
import ArticlesPopupForm from "@/nutriComponents/ArticlesPopupForm"
import { pageLimit } from "@/utils"
import { collection, endBefore, getDocs, limit, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore"
import { useEffect, useState } from "react"
import { BsThreeDots } from "react-icons/bs";


export type ArticlesType = {
  id:string,
  title:string,
  image:string, 
  description:string,
}



const headers = [

  "Image","Title","Description"

]


export default function ViewArticles() {
  
  

  const [articles, setArticles] = useState<ArticlesType[]>([]);

  const [filteredArticles, setFilteredArticles] = useState<ArticlesType[] | null>(null); // Filtered accounts for display


  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  

  // data manipulation popups
    const [openForm,setOpenForm] = useState(false);
    const [selectedData,setSelectedData] = useState<ArticlesType | undefined>(undefined)
    const [removalPopup,setRemovalPopup] = useState<boolean>();




 const fetchData = async (action: "start" | "next" | "prev") => {

    setLoading(true);
    try {

      let q;
      const dataRef = collection(db, "articles");
  
      if (action === "start") {
        // Initial fetch
        q = query(dataRef, limit(pageLimit));
      } 
      
      else if (action === "next" && lastVisible) {
        // Fetch next page
        q = query(dataRef, startAfter(lastVisible), limit(pageLimit));
      } 
      
      else if (action === "prev" && firstVisible) {
        // Fetch previous page
        q = query(dataRef, endBefore(firstVisible), limit(pageLimit));
      } 
      
      else {
        console.warn("Invalid action or missing cursors.");
        setLoading(false);
        return;
      }
  
      const querySnapshot = await getDocs(q);

      const temp: ArticlesType[] = [];
  
      if (!querySnapshot.empty) {
        // Update first and last document references for pagination
        setFirstVisible(querySnapshot.docs[0]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  
        querySnapshot.forEach((doc) => {

          const data = {
            id: doc.id,     
            ...doc.data(),
          } as ArticlesType;
          temp.push(data);
        });
  
        // Update state with fetched data
        setArticles(temp);
        setFilteredArticles(temp);
      } else {
        console.warn("No documents found.");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  
    setLoading(false);
  };
  
    // Helper function to get the first 5 words
    const getFirstFiveWords = (text:string) => {
      return text.split(" ").slice(0, 5).join(" ") + (text.split(" ").length > 5 ? "..." : "");
    };

  useEffect(()=>{
    fetchData("start");

  },[]);
  


  const editData = async (selectedData:ArticlesType)=>{
    setSelectedData(selectedData);
    setOpenForm(true)
  }

  const deleteData = async (selectedData:ArticlesType)=>{
    setSelectedData(selectedData);
    setRemovalPopup(true);
  }

  const addData= async ()=>{
    setSelectedData(undefined);
    setOpenForm(true); 
  }

  const dropDowns = [
    { 
      actionName:"Edit Articles",
      action:editData
    },
    {
      actionName:"Delete Articles",
      action:deleteData
    }
  ]




  
  return (

    

    

    <div className="flex flex-col p-10">
      {/* Parent */}


      {openForm &&
        <ArticlesPopupForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        selectedData={selectedData}
        />
      
      }








      <h1 className="mb-5">View Articles</h1>

      <div className="border-2 rounded-2xl shadow-lg
      w-[80vw] h-[80vh] p-10">

      <div className="flex flex-row justify-between  items-center">
      <TableHeaderBar
              mainText="All Articles"
              subText="Manage All The Articles You Have Written"
              />


      <button className="btn btn-ghost bg-[#00ACAC] text-white" onClick={addData}>Add Article</button>
      </div>
          <Table>
          <TableHeader>
            <TableRow>

   
              {headers.map((item,index)=>(
                <TableHead key={index}>{item}</TableHead>
              ))}
       
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.title}>
                <TableCell className="font-medium">
                <img src={article.image} className="w-20 h-20 rounded"/>
                </TableCell>
                <TableCell>{article.title}</TableCell>
                <TableCell>
                     <h1>{getFirstFiveWords(article.description)}</h1>
               </TableCell>

              <TableCell>

              
                     <CustomizedDropdown 
                      subjectData={article}
                      dropDowns={dropDowns}
                      disableDropdown={true}
                      />



              </TableCell>

              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
              <TableRow>
       
                <TableCell className="text-right pt-8" colSpan={headers.length}>
       
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
  )
}
