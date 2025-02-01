import { CalorieLogType, GlucoseLogType } from "@/types/nutritionistTypes";
import { useEffect, useState } from "react";

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ScatterChart } from 'recharts';

interface Props {
    caloriesData?: CalorieLogType[];
    glucoseData?: GlucoseLogType[];
  }




export default function CaloriesGlucoseChart({caloriesData,glucoseData}:Props) {

    const [mergedData, setMergedData] = useState<({
        calories: number;
        glucose: number;
        timestamp: number;
    } | null)[]
    >([]);

    const mergeDataByTimeWindow = (
        caloriesData: CalorieLogType[], 
        glucoseData: GlucoseLogType[], 
        windowMs: number = 60 * 60 * 1000 // Default: 1-hour window
      ) => {
        if (!caloriesData.length || !glucoseData.length) return [];
      
        return caloriesData.map(calorie => {
          // Find glucose readings within the time window
          const glucoseInRange = glucoseData.filter(g => 
            Math.abs(g.timestamp.toMillis() - calorie.timestamp.toMillis()) <= windowMs
          );
      
          if (!glucoseInRange.length) return null; // Skip if no matching glucose data
      
          // Pick the closest glucose reading
          const nearestGlucose = glucoseInRange.reduce((closest, g) => 
            Math.abs(g.timestamp.toMillis() - calorie.timestamp.toMillis()) < 
            Math.abs(closest.timestamp.toMillis() - calorie.timestamp.toMillis()) 
            ? g : closest
          );
      
          return { 
            calories: calorie.amount, 
            glucose: nearestGlucose.reading,
            timestamp: calorie.timestamp.toMillis() // Store timestamp in milliseconds
          };
        }).filter(Boolean); // Remove null values
      };
    



      useEffect(()=>{
        if (caloriesData && glucoseData)
            {
              if (caloriesData.length>0 && glucoseData.length > 0)
              {
                  const data =  mergeDataByTimeWindow(caloriesData,glucoseData);
                  console.log(data);
                 setMergedData(data);
              }
            }
      },[])


      return (
        <>
        {(mergedData && mergedData.length>1)?
        <ResponsiveContainer height={400}  className="my-20 ms-10 " width="90%" >
        <ScatterChart   margin={{
            top: 20,
            right: 20,
            bottom: 10,
            left: 60,
        }}>
          <CartesianGrid />
          <YAxis type="number" dataKey="calories" name="Calories" domain={['auto', 'auto']} unit="kcal" />
          <XAxis type="number" dataKey="glucose" name="Glucose Level" unit="mmo/L"/>
          <Tooltip 
            cursor={{ strokeDasharray: "3 3" }} 
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const { calories, glucose, timestamp } = payload[0].payload;
              const date = new Date(timestamp); // Convert timestamp to Date
              const formattedDate = !isNaN(date.getTime()) ? date.toLocaleString() : "Invalid Date"; // Handle invalid date
              return (
                <div>
                  <p><strong>Calories:</strong> {calories}</p>
                  <p><strong>Glucose:</strong> {glucose}</p>
                  <p><strong>Time:</strong> {formattedDate}</p> {/* Show time */}
                </div>
              );
            }} 
          />
          <Scatter name="Glucose Response" data={mergedData} fill="#ff7300" />
        </ScatterChart>
      </ResponsiveContainer>:
      <div className="h-[20vh] flex items-center justify-center">
        <h1>Client does not have enough data logged to show the correlation</h1>
      </div>
        
        }
       

      
      
    </>
      );




}
