
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/contextProvider'
import { db } from '@/firebase-config';
import { NutriSidebar } from '@/nutriComponents/NutriSidebar'
import { doc,  onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import ProfileCreation from './ProfileCreation';

export default function NutritionistLayout() {
  const { logout } = useAuth();
  const { user, setLoading, loading } = useAuth();
  const [profileExist, setProfileExists] = useState(true);
  const [expire,setExpiry] = useState(false);


  useEffect(() => {
    if (!user) return;
    
    setLoading(true);

    // Reference to the practicing_info document
    const docRef = doc(db, "accounts", user.uid, "approval_info", "practicing_info");

    // Real-time listener for due date updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const dueDateStr = data?.dueDate || null;

        if (dueDateStr) {
          const dueDate = new Date(`${dueDateStr}T00:00:00`);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize time to avoid issues

          if (dueDate < today) {
            alert("Due date has passed, please renew your information");
            console.log(expire);
            setExpiry(true);
            return;
          }
        }
      } else {
        console.log("No practicing info found");
      }
    });

    // Reference to the profile_info document
    const profileCollectionRef = doc(db, "accounts", user.uid, "profile", "profile_info");
    
    const unsubscribeProfile = onSnapshot(profileCollectionRef, (subcollectionSnap) => {
      if (!subcollectionSnap.exists()) {
        setProfileExists(false);
      }
    });

    setLoading(false);

    // Cleanup listeners when the component unmounts
    return () => {
      unsubscribe();
      unsubscribeProfile();
    };
  }, [user, logout]);

  if (!loading && !profileExist) {
    return <ProfileCreation />;
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