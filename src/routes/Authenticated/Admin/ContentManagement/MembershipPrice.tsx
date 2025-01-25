import { db } from "@/firebase-config"

import { collection, getDocs, orderBy, query } from "firebase/firestore";
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
import MembershipForm from "@/adminComponents/MembershipForm";
import RemoveItem from "@/adminComponents/RemoveMembershipTier";



export type MembersipTier = { 
  id: string; 
  tier_name: string; 
  value: number; 
  currency: string; 
  recurring: string; 
}; 


const headers = [
  "Tier ID","Tier Name","Value ($)","Currency","Recurring"
]


export default function MembershipPrice() {

  const [tiers, setTiers] = useState<MembersipTier[]>([]); 
  const [loading,setLoading] = useState(false);
  const [filteredTier,setFilteredTier] = useState<MembersipTier[]>([])
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [openForm,setOpenForm] = useState(false);
  const [selectedTier,setSelectedTier] = useState<MembersipTier | undefined>(undefined)
  const [removeTierPopup,setRemoveTierPopup] = useState<boolean>();

  const fetchTiers = async () => { 
    setLoading(true);
    try { 
      const collectionRef = collection(db, "membership"); 
      const q = query(collectionRef, orderBy("value", "asc"));

      const snapshot = await getDocs(q); 
      const tiersData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        tier_name: doc.data().tier_name, 
        value: doc.data().value, 
        currency: doc.data().currency, 
        recurring: doc.data().recurring, 
      })); 

      // set filtered to initial values
      setFilteredTier(tiersData);
      setTiers(tiersData); 

      setLoading(false);
    } catch (error) { 
      console.error("Error fetching tiers: ", error); 
    } 
  }; 
 

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter accounts based on the search query
    if (tiers) {
      const filtered = tiers.filter((tier) =>
        tier.id.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredTier(filtered);
    }
  };

  useEffect(() => { 
    fetchTiers(); 
  }, []); 


  const addTier = async ()=>{
    setSelectedTier(undefined);
    setOpenForm(true); 
  }

  const removeTier = async (selectedTier:MembersipTier)=>{
    setSelectedTier(selectedTier);
    setRemoveTierPopup(true);
  }

  const editTier = async (selectedTier:MembersipTier)=>{
    setSelectedTier(selectedTier);
    setOpenForm(true); 
  }

  

  const dropDowns = [

    { 
      actionName:"Edit Tier",
      action:editTier
    },
    {
      actionName:"Remove Tier",
      action:removeTier
    }

  ]

return (
 
    <>
   

      {loading? 
      <div className="flex h-screen w-screen justify-center items-center">
          <span className="loading loading-infinity loading-lg"></span>
      </div>

      
      :

        <div className="flex flex-col p-10 gap-7">
          
          {openForm && 
          <MembershipForm
          setLoading={setLoading}
          openForm={openForm}
          setOpenForm={setOpenForm}
          membershipTier={selectedTier}
          fetchData={fetchTiers}
          />
          }

          {
            (removeTierPopup && selectedTier) && 
            <RemoveItem
            removeTierPopup={removeTierPopup}
            setRemoveTierPopup={setRemoveTierPopup}
            selectedTier={selectedTier}
            fetchData={fetchTiers}
            />
          }
 
           {/* Screen Top */}
           <div className="flex flex-col md:flex-row justify-between">
          <AdminTableHeader
          header="Membership Tier"
          />    
          <button className="btn btn-ghost bg-[#00ACAC] text-white py-2 px-7" onClick={addTier}>
          <IoIosAddCircleOutline size={24} />
            Add Membership Tier
            </button>
          </div>

          {/*TABLE*/}
          <div className="w-[80vw] h-auto border-2 p-8 rounded-xl">
            
            {/*TABLE HEADER*/}
            <div className="flex flex-row justify-between">
              {/*Header section*/}
              <TableHeaderBar
              mainText="Membership Tier"
              subText="Manage your membership tiers"
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
                {filteredTier?.map((tier) => (
                  <TableRow key={tier.id}>
                    <TableCell className="font-medium">{tier.id}</TableCell>
                    <TableCell>{tier.tier_name}</TableCell>
                    <TableCell>{tier.value}</TableCell>
                    <TableCell>{tier.currency}</TableCell>
                    <TableCell>{tier.recurring}</TableCell>
                    <TableCell className="flex justify-end">
                      
                      <CustomizedDropdown 
                      subjectData={tier}
                      dropDowns={dropDowns}
                      disableDropdown={true}
                      />
                      
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter className="bg-white">
              <TableRow>
                <TableCell colSpan={headers.length} className="pt-8">Showing 1 - {tiers?.length} Membership Tiers</TableCell>
                <TableCell className="text-right pt-8">
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
