import { db } from "@/firebase-config";

import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    AlertDialog,

    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { PredefinedGoalsCat, PredefinedGoalsType } from "@/types/adminTypes";


type GoalsCatForm = {
    openForm:boolean,
    setOpenForm:(open:boolean)=>void,
    SelectedData:PredefinedGoalsType | null
    fetchData:(time:"start")=>void;
}


export default function PredefinedGoalsForm({openForm,setOpenForm,SelectedData,fetchData}:GoalsCatForm) {
    
    const [internalLoad,setInternalLoad] = useState(true);
  
    const [minValue,setMinValue] = useState<number|undefined>(SelectedData?.min);
    const [maxValue,setMaxValue] = useState<number|undefined>(SelectedData?.max);
    const [displayedCategories,setDisplayedCategories] = useState<PredefinedGoalsCat[] | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(SelectedData?.categoryID);
    const [availableUnits, setAvailableUnits] = useState<string[]>([]);
      // Initialize selected unit based on SelectedData
    const [selectedUnit, setSelectedUnit] = useState<string | null>(
        SelectedData?.unit || null
    );

    const fetchCategories = async ()=>{
        const tempCategories : PredefinedGoalsCat[] = [];
        const querySnapshot = await getDocs(collection(db, "predefined_goals_categories",));
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        tempCategories.push({
            id:doc.id,
            ...doc.data(),
        } as PredefinedGoalsCat)
        });
        setDisplayedCategories(tempCategories);
        setInternalLoad(false);

        setSelectedCategory(tempCategories[0].id);
        setAvailableUnits(tempCategories[0].units)

         // Initialize units for the selected category from SelectedData
        if (SelectedData?.categoryID) {
        const category = tempCategories.find((cat) => cat.id === SelectedData.categoryID);
        if (category) {
          setAvailableUnits(category.units || []);
        }
      }
    }


  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);

    // Find the selected category and update available units
    const category = displayedCategories?.find((cat) => cat.id === categoryId);
    if (category) {
      setAvailableUnits(category.units || []);
      setSelectedUnit(null); // Reset the selected unit when category changes
    }
  };


  // Handle unit selection
  const handleUnitChange = (unit: string) => {
    setSelectedUnit(unit);
  };



  const handleAddOrEditData = async ()=>{
        
        

        if (!selectedCategory || !selectedUnit || !minValue || !maxValue )
        {
            alert("You have missed out some fields !");
        }

        if (maxValue! < minValue!)
        {
            alert("You can't have a maximum value that is lesser than minimum!")
        }

        if (maxValue === minValue)
        {
            alert("Your minimum and maximum value can't be the same!")

        }


        else{

            try{
                
                if (SelectedData)
                {
                    if (!SelectedData.id)
                    {
                        throw new Error("Selected Data does not have an ID!");
                    }
        
                    const docRef = doc(db, "predefined_goals_categories", SelectedData.categoryID, "predefined_goals", SelectedData.id);
                    await setDoc(docRef,
                        { 
                            categoryID:selectedCategory,
                            max:maxValue,
                            min:minValue,
                            unit:selectedUnit,
                        }); // Use merge: true to update only the specified fields
                        
                    alert("Predefined Goal updated successfully");
                }

                else{
                    if (!selectedCategory) {
                        throw new Error("Parent document ID (selectedCategory) is missing.");
                      }
                
                      // Reference the parent document's subcollection
                      const parentDocRef = doc(db, "predefined_goals_categories", selectedCategory);
                      const subcollectionRef = collection(parentDocRef, "predefined_goals");
                
                      // Add the new item to the subcollection
                      await addDoc(subcollectionRef, {
                        categoryID:selectedCategory,
                        max:maxValue,
                        min:minValue,
                        unit:selectedUnit,
                      });
                      alert("Predefined Goal updated successfully");
                }
                fetchData("start")
            }

            catch(err)
            {
                alert(err)
            }





        }


  }





    useEffect(()=>{
        
        fetchCategories();

    },[])

  
    return(
        <>
    {internalLoad? 
    <div className="flex h-screen w-screen justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
    </div>:
    
    
    
    <AlertDialog onOpenChange={setOpenForm} open={openForm}>
    <AlertDialogContent>
      <AlertDialogHeader>
        {SelectedData? 
        <AlertDialogTitle>Edit Predefined Goals</AlertDialogTitle>:      
        <AlertDialogTitle>Add Predefined Goals</AlertDialogTitle>
        }

        {
            SelectedData?
            <AlertDialogDescription>Edit predefined goals for profile creation</AlertDialogDescription>:
            <AlertDialogDescription>Enter the category, unit , min and max range.</AlertDialogDescription>
        }
      </AlertDialogHeader>

        <div className="flex flex-col">

        {/* Category Select */}
        <label htmlFor="category-select" className="font-semibold">Select Category:</label>
          <select
            className="select select-bordered w-full max-w-xs my-2"
            value={selectedCategory || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option disabled selected>-- Select a Category --</option>
            {displayedCategories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.id}
              </option>
            ))}
          </select>
            


                {/* Units Section */}
           
            <div className="mt-4">
              <h4 className="font-semibold">Select Unit:</h4>
              <select
              className="select select-bordered w-full max-w-xs my-2"
                value={selectedUnit || ""}
                onChange={(e) => handleUnitChange(e.target.value)}
              >
                <option value="">-- Select a Unit --</option>
                {availableUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          
        <div className="flex flex-col gap-1">
        <label className="mt-4 font-semibold">Minimum Value</label>
        <input type="number" 
        value={minValue}
        onChange={(e)=>setMinValue(Number(e.target.value))}
        placeholder="Enter Minimum Value"
         className="input input-bordered w-full max-w-xs" />
        </div>

    
        <div className="flex flex-col gap-1">
        <label className="mt-4 font-semibold">Maximum Value</label>
        <input type="number" value={maxValue}
         onChange={(e)=>setMaxValue(Number(e.target.value))}
        placeholder="Enter Minimum Value"
         className="input input-bordered w-full max-w-xs" />
        </div>




        </div>



      <AlertDialogFooter className="mt-10">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        {
          SelectedData?
          <button className="bg-black btn text-white" onClick={handleAddOrEditData}>Edit Predefined Goal</button>:
          <button className="bg-black btn text-white" onClick={handleAddOrEditData}>Add Predefined Goal</button>
        }
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

    }

        </>
    )

  
}
