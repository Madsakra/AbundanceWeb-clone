import { CalorieLogType, LogEntry } from "@/types/nutritionistTypes";
import calo_output from "../assets/Images/client_data_images/calo_output.jpg"
import calo_input from "../assets/Images/client_data_images/calo_input.jpg";
import glucose_log from "../assets/Images/client_data_images/glucose_log.jpg"

// TYPE GUARD
const isCalorieLog = (entry: LogEntry): entry is CalorieLogType => {
    return "amount" in entry && ("food_info" in entry || "MET_task" in entry);
  };


// Props interface
interface LogEntryItemProps {
    entry: LogEntry;
  }

export default function LogEntryItem({entry}:LogEntryItemProps) {
    return (
        <div className="p-2">

    
          {isCalorieLog(entry) ? (
            <div className="flex flex-col xl:flex-row items-center border-2 rounded-xl p-4 gap-4">
                {entry.type==="input"?
                <img src={calo_input} className="w-36 h-36 rounded"/>:
                <img src={calo_output} className="w-36 h-36 rounded"/>
                }
                

                {
                    entry.type==="input"?
                    <div className="flex flex-col w-full ms-10 gap-2">
                    <p className="text-lg mb-4">Time: {entry.timestamp.toDate().toLocaleString()}</p>
                    <p className="text-xl font-bold text-[#C68F5E]">Food: {entry.food_info?.name}</p> 
                    <p className="text-xl font-bold text-[#C68F5E]">Calories: {entry.amount} kcal</p>
                    </div>:
                    <div className="flex flex-col w-full ms-10 gap-2">
                    <p className="text-lg mb-4">Time: {entry.timestamp.toDate().toLocaleString()}</p>
                    <p className="text-xl font-bold text-[#C68F5E]">Activity: {entry.MET_task?.name}</p> 
                    <p className="text-xl font-bold text-[#C68F5E]">Calories: {Math.round(entry.amount).toFixed(2)} kcal</p>
                    </div>
                }


                <div className="flex me-2 w-full text-end">
                <p className="uppercase font-bold text-2xl w-full text-[#C68F5E]">{entry.type}</p>
           
                </div>
    
 
            </div>
          ) : (
          

              <div className="flex flex-col xl:flex-row items-center border-2 rounded-xl p-4 gap-4">
                
             
                <img src={glucose_log} className="w-36 h-36 rounded"/>
                
          
                <div className="flex flex-col w-full ms-10 gap-2">
                    <p className="text-lg mb-4">Time: {entry.timestamp.toDate().toLocaleString()}</p>
                  
                    <p className="text-xl font-bold text-[#DB8189]">Glucose Reading: {entry.reading} {entry.unit}</p>
                </div>
            
                <div className="flex me-2 w-full text-end">
                <p className="uppercase font-bold text-2xl w-full text-[#DB8189]">Glucose Logging</p>
                </div>
    
 
            </div>

      
          )}
        </div>
      );
}
