import { DisplayedReview } from "@/routes/Authenticated/Nutritionist/Profile";
import { FaStar } from "react-icons/fa";


export default function ReviewCard(item:DisplayedReview) {
  return (
    <div className="flex flex-col w-full border-2 h-auto p-10 rounded-xl shadow-lg">
    <div className="flex gap-6 items-center">
      <img src={item?.userInfo?.avatar} className="w-16 h-16 rounded-full"/>
      <div className="flex flex-col gap-1">
      <h2 className="text-2xl">{item.userInfo.name}</h2>
      <h3 className="text-[#838383]">{item.userInfo.email}</h3>
      <div className="flex gap-2 items-center">
      <h3 className="text-xl">Gave {item.score}</h3>
      <FaStar color="#00ACAC" size={20} />
      
      </div>
   
      </div>

    </div>
    <h1 className="text-xl my-4 mt-8">Overall Review: <span className="font-bold"> {item.name}</span></h1>
    <div className="grid  lg:grid-cols-3 mt-6 gap-3">
    
      {
        item.reasons.map((reason)=>(
            <div className="flex-wrap  flex items-center gap-5 h-auto p-3 rounded-3xl bg-[#00ACAC]">
            <div className="bg-white w-5 h-5 rounded-full"></div>
            <h2 className="text-white">{reason}</h2>
          </div>
        ))
      }

    </div>

  </div>
  )
}
