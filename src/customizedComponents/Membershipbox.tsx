type MembershipProps = {
  title:string,
  price:number,
  currency:string,
  recurring:string,
  features:string[],
  notAvailable?:string[],
  joinNow:boolean,
  key:number
}




export default function Membershipbox({
  title,price,recurring,features,notAvailable, joinNow
}:MembershipProps) {


  const getBackgroundColor = (title: string) => {
    switch (title) {
      case 'Full Premium':
        return 'bg-gradient-to-b from-[#00ACAC] to-[#E7E7E7]';

      default:
        return 'bg-white'; // Default background color
    }
  };

  const getTextColor = (title: string) => {
    switch (title) {
      case 'Full Premium':
        return 'text-white';

      default:
        return 'text-[#00ACAC]'; // Default background color
    }
  };

  return (
    <div className={`w-full lg:w-[80%] h-[40rem] rounded-2xl 
      shadow-2xl flex flex-col items-center text-center mt-5 gap-4 ${getBackgroundColor(title)}`} >

      <h1 className="text-2xl mt-8 font-medium">{title}</h1>
      <h2 className={`text-4xl mt-2 font-bold mb-5 ${getTextColor(title)}`}>$ {price} / {recurring}</h2>

      {features.map((feature,index)=>(
        <div className="bg-[#00ACAC] w-40 p-4 rounded text-sm text-white font-black text-center flex items-center justify-center" key={index}>
          {feature}
        </div>
      ))}

      {notAvailable?.map((missingFeature,index)=>(
        <div className="bg-[#D9D9D9] w-40 p-4 text-sm rounded text-center font-black flex items-center justify-center" key={index}>
          {missingFeature}
        </div>
      ))}

    {joinNow? 
      <button className="bg-[#00ACAC]  text-white hover:bg-white hover:border-2 hover:text-[#009797] 
      w-60 rounded-lg h-14 mt-8 
        text-center 
       flex items-center justify-center">
        <h1 className="font-black">Join Now</h1>
      </button>:
      <></>}


    </div>
  )
}
