import { useNavigate, useParams } from "react-router-dom";


export default function AdviceMessage() {

    let { clientID } = useParams();
    let navigate = useNavigate();




  return (
    <div>
      {clientID?
      
        <h1>{clientID}</h1>:
        <h2>Does not have client ID</h2>
        }

        <button className='btn bg-black text-white h-14 mt-14 flex gap-5' onClick={()=>{
          navigate(`/nutri/advice/${clientID}/mealPlan`)
        }}>
          Set Meal Plan
          </button>
    </div>
  )
}
