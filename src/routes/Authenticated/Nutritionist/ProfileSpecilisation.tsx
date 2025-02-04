import { db } from "@/firebase-config";
import { ProfileSpecialisation, SelectedHealthProfile } from "@/types/nutritionistTypes";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

type ProfileSpecialisationType={
    profileSpec:SelectedHealthProfile[];
    toggleCondition:(condition: ProfileSpecialisation) => void;
    selectVariation:(conditionId: string, variation: string) => void;
    handleSubmit:()=>void;
}


export default function ProfileSpecilisation({profileSpec,toggleCondition,selectVariation,handleSubmit}:ProfileSpecialisationType) {

  const [healthList,setHealthList] = useState<ProfileSpecialisation[]>([]);
  const [dietList,setDietList] = useState<ProfileSpecialisation[]>([]);

  // FETCH ALL SPECIALISATION
  const fetchSpecialisation = async()=>{

    const healthRef = collection(db,"health_conditions");
    const dietRef = collection(db,"dietary_restrictions");

    const healthSnap = await getDocs(healthRef);
    const dietSnap = await getDocs(dietRef)

    const tempHealths:ProfileSpecialisation[] = [];
    const tempDiets:ProfileSpecialisation[]=[];

    healthSnap.docs.map((doc)=>{
      tempHealths.push({
        id:doc.id,
        ...doc.data()
      } as ProfileSpecialisation)
    });

    dietSnap.docs.map((doc)=>{
      tempDiets.push({
        id:doc.id,
        ...doc.data()
      } as ProfileSpecialisation)
    })

    setHealthList(tempHealths);
    setDietList(tempDiets);

  }

  useEffect(()=>{
    fetchSpecialisation();
  },[])

  const isConditionSelected = (conditionId: string) => {
    return profileSpec.some((condi) => condi.id === conditionId);
  };

  const getSelectedVariation = (conditionId: string) => {
    const selectedCondition = profileSpec.find((condi) => condi.id === conditionId);
    return selectedCondition ? selectedCondition.variation : null;
  };


  return (
    <div className="flex flex-col">
        
        <div className="flex gap-20">
        <div className="flex flex-col">
        <h1 className="text-2xl font-bold my-5">Health Specilization</h1>
        <div className="flex flex-col gap-4">
            {healthList.map((item)=>(
                  <div key={item.id} className="flex flex-col gap-2">
                      <button
                      className={`badge py-6 ${
                        isConditionSelected(item.id) ? 'bg-[#6B7FD6] text-white' : 'badge-neutral'
                      }`}
                      onClick={() => toggleCondition(item)}
                    >
                      {item.name}
                    </button>
           
          </div>
        ))}
      </div>
        </div>
    
        <div className="flex flex-col">
        <h1 className="text-2xl font-bold my-5">Diet Specilization</h1>

            <div className="flex flex-col gap-4">
                {dietList.map((item)=>(
                    <div key={item.id} className="flex flex-col gap-2">
                        <button
                        className={`badge py-6 ${
                            isConditionSelected(item.id) ? 'bg-[#6B7FD6] text-white' : 'badge-neutral'
                        }`}
                        onClick={() => toggleCondition(item)}
                        >
                        {item.name}
                        </button>
                        {isConditionSelected(item.id) && item.variation && item.variation.length > 0 && (
                <div className="flex gap-2">
                    {item.variation.map((variation) => (
                    <button
                        key={variation}
                        className={`badge py-4 ${
                        getSelectedVariation(item.id) === variation ? 'bg-purple-500 text-white' : 'badge-outline'
                        }`}
                        onClick={() => selectVariation(item.id, variation)}
                    >
                        {variation}
                    </button>
                    ))}
                </div>
                )}
            </div>
            ))}
            </div>

        </div>
        </div>

        <button className="btn btn-ghost mt-10 bg-[#00ACAC] text-white " onClick={handleSubmit}>Submit</button>
    </div>
  )
}
