
interface ClientHealthCondiProps {
 label:string;
 data:{
    id:string,
    name:string,
 }[];
 
};

export default function ClientHealthCondi({label,data}:ClientHealthCondiProps) {
  return (
    <div className="w-full xl:w-1/4 h-auto">
        <h1 className="my-4 font-bold">{label}</h1>
        {data.map((data,index)=>(
            <div className="bg-[#8797DA] border-2 p-2 ps-8 rounded-[90px]" key={index}>
                <h1 className="text-white">{data.name}</h1>
            </div>
        ))}
    </div>
  )
}
