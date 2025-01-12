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
    handleFeatureChange: (index:number)=>void
  };


  
  export default function CustomAccordion({appFeatures,handleFeatureChange}:AccordionProps) {
    
    return (
        
        


        <Accordion type="single" 
        collapsible className=" rounded-lg shadow-lg bg-white"
        style={{
            width: '350px', // fixed width
            height: 'auto', // or fixed height if needed
          }}
        defaultValue={appFeatures[0]?.content}
        >





        {appFeatures.map((feature,index)=>(
        <AccordionItem value={feature.content} key={index} className="rounded-xl p-4 shadow-lg">
        <AccordionTrigger
               style={{
                width: '100%', // maintain the width of the trigger
              }} 
        className="text-[#009797] text-2xl" 
        onClick={()=>handleFeatureChange(index)}>{feature.trigger}</AccordionTrigger>
        <AccordionContent
                style={{
                    width: '100%', // maintain content width
                    height: '100px', // fixed height for content
                    overflowY: 'auto', // scrollable if content overflows
                  }}
         className="font-light text-lg">
            {feature.content}
        </AccordionContent>
      </AccordionItem>
        ))}


      </Accordion>
    )
  }
  