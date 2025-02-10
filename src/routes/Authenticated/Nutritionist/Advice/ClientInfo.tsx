

import { db } from '@/firebase-config';
import ClientBmrBar from '@/nutriComponents/ClientBmrBar';
import ClientHealthCondi from '@/nutriComponents/ClientHealthCondi';
import GraphCalendar from '@/nutriComponents/GraphCalendar';
import LogEntryItem from '@/nutriComponents/LogEntryItem';
import { CalorieLogType, ClientAccountType, ClientProfileInfoType, GlucoseLogType, LogEntry } from '@/types/nutritionistTypes';
import { fetchDataByDate,mergeAndSort } from '@/utils';
import dayjs, { Dayjs } from 'dayjs';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoSendSharp } from "react-icons/io5";

export default function ClientInfo() {
    
    let { clientID } = useParams();
    let navigate = useNavigate();
   
    const [loading,setLoading] = useState(false);
    const [clientAccount,setClientAccount] = useState<ClientAccountType | undefined>();
    const [clientProfile,setClientProfile] = useState<ClientProfileInfoType | undefined>();
    const [graphDate, setGraphDate] = useState<Dayjs|null>(dayjs());
    
    const [caloriesData,setCaloriesData] = useState<CalorieLogType[] | undefined>();
    const [glucoseData,setGlucoseData] = useState<GlucoseLogType[] | undefined>();
    const [mergedData,setMergedData] = useState<LogEntry[]|undefined>();

    const getAge = (birthdate: string): number => {
        const birthDate = new Date(birthdate);
        const today = new Date();
      
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
      
        // Adjust if the birthday hasn't happened yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
      
        return age;
      };

  // Move to previous date
  const handlePrevious = () => {
    setGraphDate((prev) => (prev ? prev.subtract(1, "day") : dayjs()));  
};

  // Move to next date (only if not in the future)
  const handleNext = () => {
    if (!graphDate?.isSame(dayjs(), "day")) {
      setGraphDate((prev) => (prev ? prev.add(1, "day") : dayjs()));
    }
  };



    const fetchData = async ()=>{
            setLoading(true);
            try{
                const accountsRef = doc(db, "accounts",clientID!);
                const accountDoc = await getDoc(accountsRef);

                const profileRef = doc(db,"accounts",clientID!,"profile","profile_info")
                const profileDoc = await getDoc(profileRef);

                setClientAccount({
                    uid:accountDoc.id,
                    ...accountDoc.data()
                } as ClientAccountType);
    
    
                setClientProfile({
                    ...profileDoc.data()
                } as ClientProfileInfoType);


                // fetch client's calories data
                const tempCaloriesData = await fetchDataByDate(clientID!, "calories", graphDate!);
                const tempGlucoseData = await fetchDataByDate(clientID!, "glucose-logs", graphDate!);
                setCaloriesData(tempCaloriesData as CalorieLogType[]);
                setGlucoseData(tempGlucoseData as GlucoseLogType[]);
                // Use fetched data directly instead of waiting for state update
                const tempMergedData = mergeAndSort(tempCaloriesData as CalorieLogType[], tempGlucoseData as GlucoseLogType[]);
                setMergedData(tempMergedData);
              
            }
            catch(err)
            {
                console.log(err);
                alert("Unable to get clients' data")
            }

            setLoading(false);
        }

    const reFetchData = async()=>{
      setLoading(true);
      const tempCaloriesData = await fetchDataByDate(clientID!, "calories", graphDate!);
      const tempGlucoseData = await fetchDataByDate(clientID!, "glucose-logs", graphDate!);
      setCaloriesData(tempCaloriesData as CalorieLogType[]);
      setGlucoseData(tempGlucoseData as GlucoseLogType[]);
      // Use fresh data directly
      const tempMergedData = mergeAndSort(tempCaloriesData as CalorieLogType[], tempGlucoseData as GlucoseLogType[]);
      setMergedData(tempMergedData);
      console.log(tempMergedData);
      setLoading(false);
    }
    


    // on start
    useEffect(()=>{
        fetchData();
        console.log(glucoseData, caloriesData);
    },[])



    // when nutri change date
      // Fetch calories data when the graphDate changes
      useEffect(() => {
        if (graphDate) {
          reFetchData();
        }
      }, [graphDate]);



  return (

    <>
    
    {(loading || !clientAccount || !clientProfile)?
    
    <div className="flex h-screen w-screen justify-center items-center">
    <span className="loading loading-infinity loading-lg"></span>
    </div>:
    
    <div className='flex flex-col px-8 py-4'>
    
    {/* TOP LEFT HEADER */}
    <div className="flex lg:flex-row justify-between items-center mb-8">
      <h1 className="text-lg text-[#656363]">View Clients / User: {clientAccount.name}</h1>
    </div>

    {/* Main Container*/}
    <div className=' flex flex-col w-full xl:w-[80vw] h-auto my-16'>
       
       <div className='flex flex-col xl:flex-row items-center gap-20 mb-16'>
        
        {/*USER AVATART*/}
       <img src={clientProfile?.image} className='w-64 h-64 rounded object-fit'/>
        
        {/*NAME SECTION*/}
        <div className='flex flex-col gap-1 text-center xl:text-start'>
            <h1 className='text-4xl '>{clientAccount?.name}</h1>
            <h2 className='text-lg'>{clientAccount?.email}</h2>
        </div>


       </div>

        <div className='flex flex-col my-20 gap-4 xl:w-1/2 '>
            <h1 className='font-bold text-xl'>User Basal Metabolism (BMR)</h1>
            
            <div className='flex flex-col gap-2'>
            <ClientBmrBar
            subject='Weight'
            subjectData={clientProfile!.weight}
            unit='kg'
            iconName='IoBarbell'
            />
            
            <ClientBmrBar
            subject='Height'
            subjectData={clientProfile!.height}
            unit='cm'
            iconName='IoManOutline'
            />

            <ClientBmrBar
            subject='Age'
            subjectData={getAge(clientProfile!.birthDate)}
            iconName='IoCalendarSharp'
            />

            <ClientBmrBar
            subject='Gender'
            subjectData={clientProfile!.gender}
            iconName='IoTransgenderSharp'
            />

            </div>


            
        </div>


        {/* USER'S HEALTH CONDITION */}
        <div className='flex flex-col xl:flex-row mt-10 mb-28 gap-10 xl:gap-24'>
         <ClientHealthCondi
         label='Dietary Restrictions'
         data={clientProfile!.profileDiet}
         />         
         <ClientHealthCondi
         label='Health Conditions'
         data={clientProfile!.profileHealthCondi}
         />
        </div>

        {/* DOB SELECTOR */}
        <GraphCalendar
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        graphDate={graphDate}
        setGraphDate={setGraphDate}
        />


        {/* <CaloriesGlucoseChart
        caloriesData={caloriesData}
        glucoseData={glucoseData}
        /> */}


        {mergedData &&
        <div className='border-2 w-full p-4 mt-4'>
        {mergedData.map((entry,index)=>(
          <LogEntryItem
          key={index}
          entry={entry}
          />
        ))}

        {mergedData.length === 0 &&
        <div className='h-[20vh] flex items-center justify-center'>
          <h1 className='text-2xl'>The client has no logged data on this date</h1>
        </div>
        }
        
        </div>        
        }

        <button className='btn bg-black text-white h-14 mt-14 flex gap-5' onClick={()=>{
          navigate(`/nutri/advice/${clientID}`)
        }}>
            <h1 className='text-[#00ACAC] text-lg'>Send Feedback</h1>
          <IoSendSharp size={25} color='#00ACAC'/>
        </button>

    </div>
  

    </div>    
    
    }
    </>
)
}
