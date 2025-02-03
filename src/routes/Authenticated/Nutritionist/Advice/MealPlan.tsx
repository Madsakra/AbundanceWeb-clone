import { useParams } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { EdamamApiResponse, EdamamFoodResponse, EdamamItem, SearchResult, TotalNutrientItem } from "@/types/Edamam";

const RECIPE_ID = import.meta.env.VITE_EDAMAM_ID;
const RECIPE_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

const FOOD_ID = import.meta.env.VITE_EDAMAM_FOOD_ID;
const FOOD_KEY = import.meta.env.VITE_EDAMAM_FOOD_KEY;

export default function MealPlan() {

    let { clientID } = useParams();
    console.log(clientID);
    const [query, setQuery] = useState("");

    const [recipes, setRecipes] = useState<EdamamItem[]>([]);
    const [foods, setFoods] = useState<SearchResult[]>([]);
    

 

    const fetchRecipes = async (searchTerm: string) => {
      try {
        const response = await axios.get<EdamamApiResponse>(
          `https://api.edamam.com/api/recipes/v2?type=public&q=${searchTerm}&app_id=${RECIPE_ID}&app_key=${RECIPE_KEY}`
        );
    
        const newData: EdamamItem[] = response.data.hits.map((hit) => hit.recipe);
        return newData;

      } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
      }
    };
    
    const fetchFoods = async (searchTerm: string): Promise<SearchResult[]> => {
      try {
        const response = await axios.get<EdamamFoodResponse>(
          `https://api.edamam.com/api/food-database/v2/parser?ingr=${searchTerm}&app_id=${FOOD_ID}&app_key=${FOOD_KEY}`
        );
    
        return response.data.hints.map((hint) => ({
          type: "food",
          label: hint.food.label,
          image: hint.food.image,
          nutrients: Object.entries(hint.food.nutrients).reduce((acc, [key, value]) => {
            acc[key] = { label: key, quantity: value, unit: "" };
            return acc;
          }, {} as { [key: string]: TotalNutrientItem }),
        }));
      } catch (error) {
        console.error("Error fetching foods:", error);
        return [];
      }
    };

    
    const fetchData = async () => {
      try {
        const [fetchedRecipes, fetchedFoods] = await Promise.all([
          fetchRecipes(query),
          fetchFoods(query),
        ]);
  
        // Set the results into the appropriate states
        setRecipes(fetchedRecipes);
        setFoods(fetchedFoods);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRecipes([]);
        setFoods([]);
      }
    };
    const debouncedFetchData = _.debounce(fetchData, 300);


    useEffect(() => {
      if (!query) {
        // Clear both results if search term is empty
        setRecipes([]);
        setFoods([]);
        return;
      }
    
      debouncedFetchData();
      return () => {
        debouncedFetchData.cancel(); // Cleanup to prevent memory leaks
      };
      
    }, [query]); // Dependency on searchTerm

 





  return (
    <div>
          <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for recipes or food..."
      />
<div className="grid grid-cols-2">

<h3>Foods</h3>
  {foods.length > 0 ? (
    <ul className="mb-20">
      {foods.map((item, index) => (
        <li key={index}>
          <span>{item.label}</span>
          <p><strong>Calories:</strong> {item.nutrients?.ENERC_KCAL?.quantity ?? 'N/A'} kcal</p>
          <p><strong>Fat:</strong> {item.nutrients?.FAT?.quantity ?? 'N/A'} g</p>
          <p><strong>Protein:</strong> {item.nutrients?.PROCNT?.quantity ?? 'N/A'} g</p>
          <p><strong>Carbs:</strong> {item.nutrients?.CHOCDF?.quantity ?? 'N/A'} g</p>

        </li>
      ))}
    </ul>
  ) : (
    <p>No foods found.</p>
  )}


  <h3 className="">Food Recipes</h3>
  {recipes.length > 0 ? (
    <ul>
      {recipes.map((item, index) => (
        <li key={index}>
          <h1>{item.label}</h1>
          <h2>Calories - {item.calories}</h2>
        </li>
      ))}
    </ul>
  ) : (
    <p>No recipes found.</p>
  )}


</div>
    </div>
  )
}
