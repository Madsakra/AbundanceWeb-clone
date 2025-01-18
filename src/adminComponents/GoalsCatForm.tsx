import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"

import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase-config";
import { PredefinedGoalsCat } from "@/routes/Authenticated/Admin/ContentManagement/PredefinedGoals";

import { IoIosRemoveCircleOutline } from "react-icons/io";

type GoalsCatForm = {
    openForm:boolean,
    setOpenForm:(open:boolean)=>void,
    SelectedData:PredefinedGoalsCat | null
    fetchData:(time:"start")=>void;
    setLoading:(load:boolean)=>void
}


export default function GoalsCatForm({openForm,setOpenForm,SelectedData,fetchData,setLoading}:GoalsCatForm) {

    const [disableName,setDisableName] = useState(false);
    const [categoryName,setCategoryName] = useState<string>("")
    const [inputUnit, setInputUnit] = useState("");


    const [unitContainer,setUnitContainer] = useState<string[] | undefined>(SelectedData?.units)
   


    // VALIDATION FUNCTION NOT WORKING
    // function isValidUnit(): boolean {
    //     try {
    //       // Try to create a unit object
    //       const newUnit = unit(inputUnit);
    //       return true; // If no error is thrown, the unit is valid
    //     } catch (error) {
    //       return false; // If an error is thrown, the unit is invalid
    //     }
    //   }

    const removeUnit = (unitToRemove:string)=>{
        setUnitContainer(prevUnits => {
            if (prevUnits) {
              // Remove the unit by filtering it out
              return prevUnits.filter(unit => unit !== unitToRemove);
            }
            return prevUnits; // Return the same value if unitContainer is undefined
          });
    } 


    const addUnit = () => {
        try {
            {
                setUnitContainer(prevUnits => {
                    if (prevUnits) {
                      if (prevUnits.includes(inputUnit)) {
                        // Alert the user if duplicate is found
                        alert('This unit is already added.');
                        return prevUnits; // Return the previous state without modifying it
                      } else {
                        return [...prevUnits, inputUnit]; // Add the new unit if it's not a duplicate
                      }
                    }
                    return [inputUnit]; // If unitContainer is undefined, initialize it with the new unit
                  });
                
            }

          } catch (error) {
            // If an error occurs, the unit is invalid
            return false; 
          }
      };



      const handleAddOrEditTier = async () => { 
        setLoading(true);
        try { 
          if (SelectedData?.id) { 
            // Edit Tier 
            const docRef = doc(db, "predefined_goals_categories",SelectedData.id); 
            await updateDoc(docRef, { 
                units:unitContainer
            }); 
            alert("Predefined Goals Category edited successfully"); 
            
          } else { 
            // Add Tier 
       
            await setDoc(doc(db,"predefined_goals_categories",categoryName),{ 
                units:unitContainer
            }); 

            alert("Predefined Goals Category added successfully"); 
          } 
          
         fetchData("start");
    
        } catch (error) { 
          console.error("Error adding/updating tier: ", error); 
          alert("Failed to process request. Please try again."); 
        } 
      }; 



      useEffect(()=>{
        if (SelectedData)
        {
            setDisableName(true);
        }
      },[])

   


      return (
        <AlertDialog onOpenChange={setOpenForm} open={openForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {SelectedData? 
            <AlertDialogTitle>Edit Category</AlertDialogTitle>:      
            <AlertDialogTitle>Add Category</AlertDialogTitle>
            }

            {
                SelectedData?
                <AlertDialogDescription>Edit Category for predefined goals creation</AlertDialogDescription>:
                <AlertDialogDescription>Please enter the category name and measurement unit</AlertDialogDescription>
            }
          </AlertDialogHeader>
    
            <div className="flex flex-col">

                <label className="text-sm font-bold">Category name</label>
                <input placeholder="Enter Category name" type="text" 
                value={categoryName}
                className="input input-bordered w-full my-5 mt-2"
                onChange={(e)=>setCategoryName(e.target.value)}
                disabled={disableName}
                />
                


          
                    <>
                    <label className="text-sm font-bold mb-2">Available Measurement Units</label>
                    
                    <div className="border-2  p-4 flex flex-col gap-2 rounded-2xl">
                    {unitContainer?.map((item,index)=>(
                        <div className="flex flex-row items-center gap-3" key={index}>
                       <h2 className="font-bold">{item}</h2>
                       <button className="btn btn-circle" onClick={()=>removeUnit(item)}>
                       <IoIosRemoveCircleOutline className="text-destructive" size={20}/>
                       </button>
                        </div>
                        
                    ))}
                    </div>

                    </>
                


        
                <label className="text-sm font-bold mb-2 mt-8">Add Measurement Unit</label>
                <div className="flex flex-row gap-2 items-center">
                <input placeholder="Enter Unit (e.g., kg/m^2)" type="text" 
                value={inputUnit}
                className="input input-bordered w-full"
                onChange={(e)=>setInputUnit(e.target.value)}
                />

                <button onClick={addUnit}
                className="btn btn-md"
                >Add unit</button>
                </div>
    
            </div>
    
    
    
          <AlertDialogFooter className="mt-10">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddOrEditTier}>Validate unit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
}
