import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"



type CustomizedDropdownProps = {
    // pass in any subject data
    subjectData:any,
    dropDowns:{
        actionName:string,
        action:(params:any)=>any
    }[]
}








export default function CustomizedDropdown({subjectData,dropDowns}:CustomizedDropdownProps) {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger className="border-2 btn btn-ghost px-6 py-1 bg-[#00ACAC] text-white">Open</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
   
        {dropDowns.map((drop)=>
              <DropdownMenuItem
               
              onClick={()=>drop.action(subjectData)}>
                {drop.actionName}
                
                </DropdownMenuItem>
        )}
      


    </DropdownMenuContent>
  </DropdownMenu>
  )
}

