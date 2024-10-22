interface DetailsProps{
    image:string,
    name:string,
    title:string,
}



export default function TeamDetailsCard({image,name,title}:DetailsProps) {
  return (
       
            <div className="w-52 h-72 border-4 border-white rounded-xl 
            flex flex-col justify-center items-center 
            text-white gap-2 text-xl font-bold text-center">
                <div className="w-20 h-20 rounded-full ">
                    <img src={image} className='object-fill w-20 h-20' alt="" />
                </div>
                <h1 className="mt-4  w-[80%]">{name}</h1>
                <h2>{title}</h2>
            </div>
  )
}
