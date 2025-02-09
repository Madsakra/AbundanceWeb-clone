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

import CustomizedDropdown from "@/customizedComponents/CustomizedDropdown";
import TableHeaderBar from "@/customizedComponents/TableHeader";
import { db } from "@/firebase-config";
import ArticlesPopupForm from "@/nutriComponents/ArticlesPopupForm";
import RemoveArticles from "@/nutriComponents/RemoveArticles";
import { pageLimit } from "@/utils";
import { collection, endBefore, getDocs, limit, query, QueryDocumentSnapshot, startAfter } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

export type ArticlesType = {
  id: string;
  title: string;
  image: string;
  description: string;
};

const headers = [
  "Article ID","Image", "Title", "Description"
];

export default function ViewArticles() {
  const [articles, setArticles] = useState<ArticlesType[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticlesType[] | null>(null);
  const [loading, setLoading] = useState(true);


  const [searchQuery, setSearchQuery] = useState(""); // Search query state



  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedData, setSelectedData] = useState<ArticlesType | undefined>(undefined);
  const [removalPopup, setRemovalPopup] = useState<boolean>(false);


  const {user} = useAuth();


  const fetchData = async (action: "start" | "next" | "prev") => {
    setLoading(true);
    try {
      let q;
      const dataRef = collection(db, "articles",user!.uid,"written_articles");

      if (action === "start") {
        q = query(dataRef, limit(pageLimit));
      } else if (action === "next" && lastVisible) {
        q = query(dataRef, startAfter(lastVisible), limit(pageLimit));
      } else if (action === "prev" && firstVisible) {
        q = query(dataRef, endBefore(firstVisible), limit(pageLimit));
      } else {
        console.warn("Invalid action or missing cursors.");
        setLoading(false);
        return;
      }

      const querySnapshot = await getDocs(q);
      const temp: ArticlesType[] = [];

      if (!querySnapshot.empty) {
        setFirstVisible(querySnapshot.docs[0]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          } as ArticlesType;
          temp.push(data);
        });

        setArticles(temp);
        setFilteredArticles(temp);
      } else {
        console.warn("No documents found.");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }

    setLoading(false);
  };


  useEffect(() => {
    fetchData("start");
  }, []);

  const editData = async (selectedData: ArticlesType) => {
    setSelectedData(selectedData);
    setOpenForm(true);
  };

  const deleteData = async (selectedData: ArticlesType) => {
    setSelectedData(selectedData);
    setRemovalPopup(true);
    setOpenForm(false); // Close the form when starting the delete action
  };

  const addData = async () => {
    setSelectedData(undefined);
    setOpenForm(true);
  };


    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
  
      
      if (articles) {
        const filtered = articles.filter((arti) =>
          arti.id.toLowerCase().startsWith(query.toLowerCase())
        );
        setFilteredArticles(filtered)
      }
    };

  const dropDowns = [
    {
      actionName: "Edit Article",
      action: editData,
    },
    {
      actionName: "Delete Article",
      action: deleteData,
    },
  ];




  return (

    <>
   

      {loading? 
      <div className="flex h-screen w-screen justify-center items-center">
          <span className="loading loading-infinity loading-lg"></span>
      </div>

      
      :





    <div className="flex flex-col p-10">
      {/* Article Form Popup */}
      {openForm && (
        <ArticlesPopupForm
          openForm={openForm}
          setOpenForm={setOpenForm}
          selectedData={selectedData}
          setLoading={setLoading}
          fetchData={fetchData}
        />
      )}

      {(removalPopup && selectedData) &&
      <RemoveArticles
      removalPopup={removalPopup}
      setRemovalPopup={setRemovalPopup}
      fetchData={fetchData}
      selectedData={selectedData}
      />
      }

      <div className="flex lg:flex-row justify-between items-center mb-8">
      <h1 className="text-lg">View Articles</h1>
      <button className="btn btn-ghost bg-[#00ACAC] text-white py-2 px-7" onClick={addData}>
        <IoIosAddCircleOutline size={24} />Add Article</button>
      </div>


              {/*TABLE*/}
              <div className="w-[80vw] h-auto border-2 p-8 rounded-xl">
                
                {/*TABLE HEADER*/}
                <div className="flex flex-row justify-between">
                  {/*Header section*/}
                  <TableHeaderBar
                  mainText="Written Articles"
                  subText="Manage your written articles"
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
                    {filteredArticles?.map((fil) => (
                      <TableRow key={fil.id}>
                        <TableCell className="font-medium">{fil.id}</TableCell>
                    
                        <TableCell>
                          <img className="w-20 h-20" src={fil.image}/>
                          </TableCell>
                          <TableCell>
                            <p className="w-[150px] truncate">{fil.title}</p>
                            </TableCell>
                        <TableCell>
                          <p className="w-[320px] truncate">{fil.description}</p>
                      </TableCell>
                        <TableCell className="flex justify-end mt-5">
                          
                          <CustomizedDropdown 
                          subjectData={fil}
                          dropDowns={dropDowns}
                          disableDropdown={true}
                          />
                          
                          </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
    
                  <TableFooter className="bg-white">
                  <TableRow>
                    <TableCell colSpan={headers.length} className="pt-8">Showing 1 - {articles?.length} Articles</TableCell>
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
