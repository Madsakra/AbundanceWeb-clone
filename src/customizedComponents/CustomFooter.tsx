
import { IoShareSocialOutline } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { WebsiteLinks } from '@/routes/Authenticated/Admin/ContentManagement/WebsiteContent';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase-config';

export default function CustomFooter() {

  const [loading,setLoading] = useState(true);
  const [socialLinks,setSocialLinks] = useState<WebsiteLinks[] | null>(null)

  const getData = async ()=>{


        try{
        const querySnapshot = await getDocs(collection(db, "website_links"));
        const tempAF:WebsiteLinks[] = []
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          tempAF.push(
            {
              id:doc.id,
              ...doc.data() 
           } as WebsiteLinks)
        });

        setSocialLinks(tempAF);
        setLoading(false);

      }
      catch(err)
      {
        console.log(err);
      }
  }

  useEffect(()=>{

    getData();



  })



  if (loading)
    {
      return (
        <div className="flex  justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
        </div>
      )
    }


  return (
<footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
  
  <div className='py-4 flex gap-5'>
    <h1 className='text-2xl'>Connect with us at </h1>
    <IoShareSocialOutline size={25}/>
  </div>
  <nav className="grid grid-flow-col gap-10 text-lg">
    {
      socialLinks?.map((social)=>(
        <a className="link link-hover"
        key={social.id} 
        href={social.link}
         target="_blank" rel="noopener noreferrer"
        >{social.name}</a>

      ))
    }

  </nav>
  <nav>

  </nav>
  <aside>
    <p>Copyright © {new Date().getFullYear()} - All right reserved by Abundance</p>
  </aside>
</footer>  )
}
