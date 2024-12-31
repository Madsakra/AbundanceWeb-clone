type MembershipProps = {
  title:string,
  price:number,
  currency:string,
  recurring:string,
  features:string[],
  notAvailable?:string[],
  joinNow:boolean
}




export default function Membershipbox({
  title,price,recurring,features,notAvailable, joinNow
}:MembershipProps) {
  return (
    <div className="w-full md:w-full h-[45rem] rounded-xl 
     bg-white border-2 border-[#009797] flex flex-col justify-center items-center text-center gap-4">
      <h1 className="text-2xl underline font-bold">{title}</h1>
      <h2 className="text-4xl mt-2 font-bold text-[#009797] mb-5">$ {price} / {recurring}</h2>


      {features.map((feature,index)=>(
        <div className="bg-[#009797] p-4 w-60 rounded h-20 text-white font-black text-center flex items-center justify-center" key={index}>
          {feature}
        </div>
      ))}

      {notAvailable?.map((missingFeature,index)=>(
        <div className="bg-[#D9D9D9] p-4 w-60 rounded h-20 text-center font-black flex items-center justify-center" key={index}>
          {missingFeature}
        </div>
      ))}

      {joinNow? 
      <button className="bg-[#009797]  text-white hover:bg-white border-2 border-white hover:text-[#009797] hover:border-[#009797] 
      w-60 rounded-lg h-14 mt-8 
        text-center 
       flex items-center justify-center">
        <h1 className="font-black">Join Now</h1>
      </button>:
      <></>}

    </div>
  )
}
