
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/contextProvider'
import { db } from '@/firebase-config';
import { NutriSidebar } from '@/nutriComponents/NutriSidebar'
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import ProfileCreation from './ProfileCreation';

export default function NutritionistLayout() {

  const {user,setLoading,loading} = useAuth();
  const [profileExist,setProfileExists] = useState(true);

  const checkProfile = async ()=>{

    
    
      if (user)
      {
        const profileCollectionRef = doc(db,"accounts",user.uid,"profile","profile_info")
        const subcollectionSnap = await getDoc(profileCollectionRef);
                    
        // if practicing info exists
        if (!subcollectionSnap.exists())
        {
            setProfileExists(false);
        }
        console.log(subcollectionSnap);
      }
    
  }

  useEffect(()=>{
    setLoading(true);
    checkProfile();
    setLoading(false);
  },[user])


  if (!loading)
  {
    if (!profileExist)
    {
    
    return <ProfileCreation/>
    }
  }



  return (
    <SidebarProvider>
    <NutriSidebar />
    <main>
      <SidebarTrigger />
      <Outlet/>
    </main>
  </SidebarProvider>
  )
}
