import { MembersipTier } from "@/routes/Authenticated/Admin/ContentManagement/MembershipPrice";





export default function Membershipbox({
 tier_name,value,currency,recurring
}:MembersipTier) {




  return (
    <div className={`w-full p-6 rounded-2xl 
      shadow-2xl flex flex-col items-center text-center mt-5 gap-4`} >

      <h1 className="text-xl mt-8 font-medium">{tier_name}</h1>
      <h2 className={`text-3xl mt-2 font-bold mb-5`}>$ {value} {currency} / {recurring}</h2>


    </div>
  )
}
