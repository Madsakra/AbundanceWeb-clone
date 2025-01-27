import { useParams } from "react-router-dom";


export default function MealPlan() {

    let { clientID } = useParams();
    let viteAPIKEY = import.meta.env.VITE_EDAMAM_ID

  return (
    <div>
            {clientID?
      
      <h1>{clientID} ,  {viteAPIKEY}</h1>:
      <h2>Does not have client ID</h2>
  
      }
    </div>
  )
}
