import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { EdamamFoodResponse, SearchResult, TotalNutrientItem } from "@/types/Edamam";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


type NutrientObject ={
  quantity:number,
  unit:string,
}

type MealPlan = {
  label:string,
  calories:NutrientObject,
  carbs:NutrientObject,
  protein:NutrientObject,
  fats:NutrientObject,
}


const FOOD_ID = import.meta.env.VITE_EDAMAM_FOOD_ID;
const FOOD_KEY = import.meta.env.VITE_EDAMAM_FOOD_KEY;

export default function MealPlan() {

    let { clientID } = useParams();
    const [query, setQuery] = useState("");
    const [foods, setFoods] = useState<SearchResult[]>([]);
    const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
    let navigate = useNavigate();
    const fetchFoods = async (searchTerm: string): Promise<SearchResult[]> => {
      try {
        const response = await axios.get<EdamamFoodResponse>(
          `https://api.edamam.com/api/food-database/v2/parser?ingr=${searchTerm}&app_id=${FOOD_ID}&app_key=${FOOD_KEY}`
        );
    


        // Create a map to store the highest-calorie version of each food
        const foodMap = new Map<string, SearchResult>();
        console.log(response.data.hints)
        response.data.hints.forEach((hint) => {
          const label = hint.food.label;
          const calories = hint.food.nutrients.ENERC_KCAL || 0; // Default to 0 if missing
          const foodItem: SearchResult = {
            type: "food",
            label,
            image: hint.food.image,
            nutrients: Object.entries(hint.food.nutrients).reduce((acc, [key, value]) => {
              acc[key] = { label: key, quantity: value, unit: "" };
              return acc;
            }, {} as { [key: string]: TotalNutrientItem }),
          };
          // Check if this food label already exists in the map
          if (!foodMap.has(label) || foodMap.get(label)!.nutrients!.ENERC_KCAL?.quantity < calories) {
            foodMap.set(label, foodItem); // Keep the highest-calorie version
          }
        });
        // Convert the map values to an array
        return Array.from(foodMap.values());
      } catch (error) {
        console.error("Error fetching foods:", error);
        return [];
      }
    };
  
    const fetchData = async () => {
      try {
        const [fetchedFoods] = await Promise.all([
          fetchFoods(query),
        ]);
        setFoods(fetchedFoods);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFoods([]);
      }
    };
    const debouncedFetchData = _.debounce(fetchData, 300);
    useEffect(() => {
      if (!query) {
        // Clear both results if search term is empty
        setFoods([]);
        return;
      }
      debouncedFetchData();
      return () => {
        debouncedFetchData.cancel(); // Cleanup to prevent memory leaks
      };
    }, [query]); // Dependency on searchTerm

 
    const addToMealPlan = (food: SearchResult) => {
      const isAlreadyAdded = mealPlan.some((item)=>item.label === food.label)
      if (!isAlreadyAdded)
      {
      
        const updatedFood = {
          label:food.label,

          calories:{
            unit:"kcal",
            quantity:Number(food.nutrients?.ENERC_KCAL?.quantity.toFixed(2)) ?? 0,
          },

          fats: {
            unit: "g", // specify the unit for fats
            quantity: Number(food.nutrients?.FAT?.quantity.toFixed(2)) ?? 0, // assign the fat quantity, default to 0 if undefined
          },
          // Similarly, you can do the same for other nutrients like carbs, protein, etc.
          protein: {
            unit: "g",
            quantity: Number(food.nutrients?.PROCNT?.quantity.toFixed(2)) ?? 0,
          },
          carbs: {
            unit: "g",
            quantity: Number(food.nutrients?.CHOCDF?.quantity.toFixed(2)) ?? 0,
          },
        
        };
    
        setMealPlan([...mealPlan, updatedFood]);
      }
      else{
        alert("This item is already in the meal plan!"); // Optional feedback
      }
    };
  
    const totalCalories = mealPlan.reduce((sum, item) => sum + (item.calories.quantity ?? 0), 0);
    const removeFromMealPlan = (food: MealPlan) => {
      setMealPlan(mealPlan.filter((item)=> item.label !==food.label));
    };

    useEffect(() => {
      // Fetch stored data from local storage
      const storedData = localStorage.getItem("adviceData");
      if (storedData) {
        const adviceArray = JSON.parse(storedData);
        
        // Ensure the stored data is an array
        if (Array.isArray(adviceArray)) {
          // Find the advice object for the current client
          const adviceForClient = adviceArray.find(
            (item: { clientID: string }) => item.clientID === clientID
          );
    
          if (adviceForClient) {
         
            setMealPlan(adviceForClient.mealPlan || []); // Default to empty array if missing
          }
        }
      }
    }, [clientID]); // Runs when clientID changes


    // SAVE MEAL PLAN
    const saveMealPlanToAdvice = () => {

      if (mealPlan.length < 2)
      {
        alert("Please enter at least 2 food to complete your client's meal plan")
        return;
      }

      if (!clientID) return;
      // Get existing stored data
      const storedData = localStorage.getItem("adviceData");
      let adviceArray = storedData ? JSON.parse(storedData) : [];
    
      // Ensure adviceArray is an array
      if (!Array.isArray(adviceArray)) {
        adviceArray = [];
      }
    
      // Find the index of the client's existing advice
      const existingIndex = adviceArray.findIndex((item: { clientID: string }) => item.clientID === clientID);
    
      if (existingIndex !== -1) {
        // Update the existing advice object
        adviceArray[existingIndex] = {
          ...adviceArray[existingIndex], // Keep existing title and content
          mealPlan, // Add meal plan
        };
      }
    
      // Save updated array back to localStorage
      localStorage.setItem("adviceData", JSON.stringify(adviceArray));
      navigate(`/nutri/advice/${clientID}/goalsAdvice`)

    };

    

  return (
    <div className="p-10 w-[100vw] flex flex-col lg:w-[85vw] gap-10">

      <div className="flex flex-col gap-2 bg-[#C68F5E] p-10 rounded-2xl">
        <label htmlFor="input" className="text-2xl mb-2 font-bold text-white">Search for food to add</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for recipes or food..."
            className="input input-bordered w-full "
          />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="text-2xl font-bold mb-10">Foods</h3>
          {foods.length > 0 ? (
            <Table>
            <TableCaption>Searched Food Results</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Fat</TableHead>
                <TableHead>Protein</TableHead>
                <TableHead>Carbs</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foods.map((item,index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell>{item.nutrients?.ENERC_KCAL?.quantity.toFixed(2) ?? "N/A"} kcal</TableCell>
                  <TableCell>{item.nutrients?.FAT?.quantity.toFixed(2) ?? "N/A"} g</TableCell>
                  <TableCell>{item.nutrients?.PROCNT?.quantity.toFixed(2) ?? "N/A"} g</TableCell>
                  <TableCell>{item.nutrients?.CHOCDF?.quantity.toFixed(2) ?? "N/A"} g</TableCell>
                  <TableCell>    
                    <button className="px-4 py-1 bg-blue-500 text-white rounded" onClick={() => addToMealPlan(item)}>
                      Add
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Displayed Results: {foods.length} results returned</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          ) : (
            <p>No foods found.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold my-14">Prepared Meal Plan</h3>
          {mealPlan.length > 0 ? (
              <Table className=" text-xl rounded-lg w-[80%]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Fat</TableHead>
                  <TableHead>Protein</TableHead>
                  <TableHead>Carbs</TableHead>
                
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealPlan.map((item,index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell>{item.calories.quantity} kcal</TableCell>
                    <TableCell>{item.fats.quantity} g</TableCell>
                    <TableCell>{item.protein.quantity} g</TableCell>
                    <TableCell>{item.carbs.quantity} g</TableCell>
                    <TableCell className="flex justify-end">    
                      <button className="px-4 py-1 bg-rose-600 text-white rounded" onClick={() => removeFromMealPlan(item)}>
                        Remove
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
       
            </Table>
          ) : (
            <p>No items added to meal plan.</p>
          )}
          <h3 className="text-xl font-bold my-10">Total Calories: {totalCalories.toFixed(2)} kcal</h3>

                  <div className="flex gap-5">
                    <button className="bg-[#D9D9D9] h-14 w-[30%]  btn" onClick={()=>{  navigate(`/nutri/advice/${clientID}`)}}>
                      <h1>Back</h1>
                    </button>
          
                    <button className='btn bg-black  text-white 
                    hover:bg-[#00ACAC] text-lg
                    h-14 w-[70%] flex gap-5' onClick={saveMealPlanToAdvice}>
                     Next
                  </button>
                </div>
      </div>
      </div>
 
    </div>

  )
}
