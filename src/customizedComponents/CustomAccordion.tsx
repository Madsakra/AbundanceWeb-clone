import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";


  interface AccordionProps{
    appFeatures:{
        trigger:string,
        content:string,
    }[];

  };


  
  export default function CustomAccordion({appFeatures}:AccordionProps) {
    
    return (
        
        


        <Accordion type="single" collapsible className=" w-1/3 rounded-lg shadow-lg bg-white">





        {appFeatures.map((feature,index)=>(
        <AccordionItem value={feature.content} key={index} className="rounded-xl p-4 shadow-lg">
        <AccordionTrigger className="text-[#009797] text-2xl">{feature.trigger}</AccordionTrigger>
        <AccordionContent className="font-light text-lg">
            {feature.content}
        </AccordionContent>
      </AccordionItem>
        ))}


      </Accordion>
    )
  }
  