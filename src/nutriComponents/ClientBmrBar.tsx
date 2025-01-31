
import * as IoIcons from "react-icons/io5"; // Import all icons

interface ClientBmrBarProps {
    subject:string,
    subjectData:number | string,
    unit?:string,
    iconName?: keyof typeof IoIcons;
}

export default function ClientBmrBar({subject,subjectData,unit,iconName}:ClientBmrBarProps) {

   const IconComponent = iconName ? IoIcons[iconName] : null; // Dynamically get the icon

  return (
    <div className='bg-[#ECECEC] xl:w-1/2 p-4 rounded-lg flex flex-row justify-between'>
        <h1>{subject}: {subjectData} {unit}</h1>
        {IconComponent && <IconComponent size={24} />} {/* Render icon if provided */}    
    </div>

  )
}
