
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/contextProvider'
import { db } from '@/firebase-config';
import { NutriSidebar } from '@/nutriComponents/NutriSidebar'
import { doc,  onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import ProfileCreation from './ProfileCreation';
import Resubmission from './Resubmission';
import dayjs from 'dayjs';

export default function NutritionistLayout() {

  const { user, setLoading, loading} = useAuth();
  const [profileExist, setProfileExists] = useState(true);
  const [expire,setExpiry] = useState(false);


  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const docRef = doc(db, "accounts", user.uid, "approval_info", "practicing_info");
    const profileCollectionRef = doc(db, "accounts", user.uid, "profile", "profile_info");

    // Practicing Info Listener (Real-time)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Firestore Update:", data); // Debugging log

        let dueDate;

        if (data?.dueDate?.toDate) {
          // If Firestore Timestamp
          dueDate = dayjs(data.dueDate.toDate());
        } else if (typeof data?.dueDate === "string") {
          // If Firestore string
          dueDate = dayjs(data.dueDate);
        } else {
          dueDate = null;
        }

        if (dueDate) {
          const today = dayjs().startOf("day");
          console.log("Due Date:", dueDate.format("YYYY-MM-DD"), "Today:", today.format("YYYY-MM-DD"));

          if (dueDate.isBefore(today)) {
            alert("Due date has passed, please renew your information");
            setExpiry(true);
          } else {
            setExpiry(false);
          }
        }
      } else {
        console.log("No practicing info found");
      }
    });

    // Profile Info Listener (Real-time)
    const unsubscribeProfile = onSnapshot(profileCollectionRef, (profileSnap) => {
      setProfileExists(profileSnap.exists());
    });

    setLoading(false);

    // Cleanup function
    return () => {
      unsubscribe();
      unsubscribeProfile();
    };
  }, [user]);


  if (!loading && !profileExist) {
    return <ProfileCreation />;
  }

  if (!loading && expire)
  {
    return <Resubmission/>;
  }

  


  return (
    <>
   
    <SidebarProvider>
      <NutriSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>    
    </>

  );
}