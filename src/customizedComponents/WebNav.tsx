import { Button } from "@/components/ui/button";
import logo from '../assets/Images/logo.png'




const mainNavItems = ['Home', 'About Us', 'Product'];


export default function WebNav(){
    return (
        <div className="p-5 hidden gap-2 md:flex items-center border-2 ">
            <div className="ms-2 flex items-center gap-1">
            <h1 className="text-2xl text-[#009797] font-bold">Abundance</h1>
            <img src={logo} className="w-20 h-20 "></img>
            
            </div>
      
            
            <div className="flex justify-between ms-10  w-[90%]">
                <div>
                {mainNavItems.map((item,index)=>(
                    <Button key={index} variant="link" className="lg:text-lg text-[#009797]">
                        {item}
                    </Button>
                ))}
                </div>

                
                <div className="flex gap-4">
                    <Button variant="link" className="bg-[#009797] text-white px-7 py-5 shadow-lg">Login</Button>
                    <Button variant="link" className="border-[0.5px] px-7 py-5 text-[#009797] border-[#009797] shadow-lg">Register</Button>
                </div>



            </div>
            
           


        </div>
    )
}

