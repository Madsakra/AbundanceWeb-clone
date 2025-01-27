import { useParams } from "react-router-dom";


export default function AdviceMessage() {

    let { clientID } = useParams();

  return (
    <div>
      {clientID?
      
        <h1>{clientID}</h1>:
        <h2>Does not have client ID</h2>
    
        }
    </div>
  )
}
