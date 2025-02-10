import { AppFeature } from "@/types/adminTypes";
import { motion } from "motion/react"


type ComparisonTableProps = {
    appFeatures: AppFeature[] | null;
  };

export default function ComparisonTable({appFeatures}:ComparisonTableProps) {
  return (
    <motion.div className="overflow-x-auto w-xl p-20" 
    initial={{opacity:0, y: 50}}
    whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.5}}}
    viewport={{once:false,amount:0.5}}
    >
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Free</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Premium</th>
          </tr>
        </thead>
        <tbody>
          {appFeatures?.map((feature) => (
            <tr key={feature.id} className="border border-gray-300">
              <td className="border border-gray-300 px-4 py-2">{feature.name}</td>
      

              {feature.name==="Chart Your Glucose and Calories"?
                <td className="border border-gray-300 px-4 py-2 text-center">
                ✅
              </td>:
                <td className="border border-gray-300 px-4 py-2 text-center">
                ❌
              </td>
            }


              <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}
