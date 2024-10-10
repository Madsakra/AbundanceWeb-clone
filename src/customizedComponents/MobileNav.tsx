import { useState } from "react";
import { 
    Sheet,
    SheetContent,
    SheetTrigger,

 } from "@/components/ui/sheet";

 import { Button } from "@/components/ui/button";
 import { Menu as MenuIcon } from "lucide-react";
 import logo from '../assets/Images/logo.png'

 const mobileItems = ['Home', 'About Us', 'Product'];


 export default function MobileNav(){
    const [open, setOpen] = useState(false);
    return(
        <Sheet open={open} onOpenChange={setOpen}>

      {/* Flex container for logo, name, and menu button */}
      <div className="flex items-center justify-between w-full md:hidden border-2 p-4">
        {/* Logo and Company Name */}
        <div className="flex items-center">
        
        <h1 className="text-2xl text-[#009797] font-bold">Abundance</h1>
        <img src={logo} className="w-20 h-20 "></img>
        </div>

        {/* This button will trigger open the mobile sheet menu */}
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="size-10 text-[#009797]" />
          </Button>
        </SheetTrigger>
      </div>
  
        <SheetContent side="right"> 
          <div className="flex flex-col items-start gap-3 mt-[10%] ">
            {mobileItems.map((item, index) => (
              <Button
                className="border-b-2 justify-start w-full text-lg text-[#009797]"
                key={index}
                variant="link"
                onClick={() => {
                  setOpen(false);
                }}
              >
                {item}
              </Button>
            ))}

                <div className="flex flex-col w-full gap-2 mt-[10%]">
                    <Button variant="link" className="bg-[#009797] text-white px-7 py-5 shadow-lg">Login</Button>
                    <Button variant="link" className="border-[0.5px] px-7 py-5 text-[#009797] border-[#009797] shadow-lg">Register</Button>
                </div>  

          </div>
        </SheetContent>
  
      </Sheet>
    )


 }