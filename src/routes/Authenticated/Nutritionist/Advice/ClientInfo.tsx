
import { useAuth } from '@/contextProvider';
import { db } from '@/firebase-config';
import ClientBmrBar from '@/nutriComponents/ClientBmrBar';
import ClientHealthCondi from '@/nutriComponents/ClientHealthCondi';
import GraphCalendar from '@/nutriComponents/GraphCalendar';
import { ClientAccountType, ClientProfileInfoType } from '@/types/nutritionistTypes';
import dayjs, { Dayjs } from 'dayjs';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ClientInfo() {
    
    let { clientID } = useParams();

    const {user} = useAuth();
    const [loading,setLoading] = useState(false);
    const [clientAccount,setClientAccount] = useState<ClientAccountType | undefined>();
    const [clientProfile,setClientProfile] = useState<ClientProfileInfoType | undefined>();
    const [graphDate, setGraphDate] = useState<Dayjs|null>(null);


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
    console.log(graphDate);  
};

  // Move to next date (only if not in the future)
  const handleNext = () => {
    if (!graphDate?.isSame(dayjs(), "day")) {
      setGraphDate((prev) => (prev ? prev.add(1, "day") : dayjs()));
      console.log(graphDate);
    }
  };



    const fetchData = async ()=>{
            setLoading(true);

            try{
                const accountsRef = doc(db, "accounts",user!.uid,"client_requests",clientID!);
                const accountDoc = await getDoc(accountsRef);
        
                const profileRef = doc(db,"accounts",user!.uid,"client_requests",clientID!,"profile","profile_info")
                const profileDoc = await getDoc(profileRef);

                setClientAccount({
                    uid:accountDoc.id,
                    ...accountDoc.data()
                } as ClientAccountType);
    
    
                setClientProfile({
                    ...profileDoc.data()
                } as ClientProfileInfoType);
            }
            catch(err)
            {
                console.log(err);
                alert("Unable to get clients' data")
            }



            setLoading(false);
        }

    useEffect(()=>{
        fetchData();
    },[])


  return (

    <>
    
    {(loading || !clientAccount || !clientProfile)?
    
    <div className="flex h-screen w-screen justify-center items-center">
    <span className="loading loading-infinity loading-lg"></span>
    </div>:
    
    <div className='flex flex-col px-8 py-4'>
    
    {/* TOP LEFT HEADER */}
    <div className="flex lg:flex-row justify-between items-center mb-8">
      <h1 className="text-lg text-[#656363]">View Clients / User {clientID}</h1>
    </div>

    {/* Main Container*/}
    <div className=' flex flex-col w-full xl:w-[80vw] h-auto'>
       
       <div className='flex flex-col xl:flex-row items-center gap-20'>
        
        {/*USER AVATART*/}
       <img src={clientProfile?.image} className='w-52 h-52 rounded object-fit'/>
        
        {/*NAME SECTION*/}
        <div className='flex flex-col gap-1 text-center xl:text-start'>
            <h1 className='text-4xl '>{clientAccount?.name}</h1>
            <h2 className='text-lg'>{clientAccount?.email}</h2>
        </div>


       </div>

        <div className='flex flex-col mt-20 gap-4 xl:w-1/2 '>
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
        <div className='flex flex-col xl:flex-row my-10 gap-10 xl:gap-24'>
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



    </div>


    </div>    
    
    }
    </>
)
}
