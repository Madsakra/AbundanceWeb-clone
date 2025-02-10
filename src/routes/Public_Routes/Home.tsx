import { Button } from '@/components/ui/button'

import abundance_dashboard from '../../assets/Images/DISPLAY_ART.png'
import Membershipbox from '@/customizedComponents/Membershipbox';
import { motion } from "motion/react"

import MotionFeature from '@/customizedComponents/MotionFeature';
import AppReviewCard from '@/customizedComponents/AppReviewCard';
import ContactInfo from '@/customizedComponents/ContactInfo';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { MembershipTier } from '@/types/userTypes';
import { AppFeature, CompanyContactDetails, WebsiteLinks } from '@/types/adminTypes';
import { FaApple } from 'react-icons/fa';
import { DiAndroid } from "react-icons/di";
import ComparisonTable from '@/customizedComponents/ComparisonTable';



export type UserAppReviews = {
  review:{
    name:string,
    reasons:string[],
    score:number
  },
  user:{
    avatar:string,
    email:string,
    name:string
  }

}











export default function Home() {
  
  const [loading,setLoading] = useState(true);
  const [videoLinks,setVideoLinks] = useState<WebsiteLinks[]|null>([]);
  const [appFeatures,setAppFeatures] = useState<AppFeature []| null>(null);
  const [membershipTier,setMembershiptier] = useState<MembershipTier []| null>(null); 
  const [contactInfo,setContactInfo] = useState<CompanyContactDetails| null>(null);
  const [iosLink,setIosLink] = useState<string | null>(null);
  const [androidLink,setAndroidLink] = useState<string | null>(null);

  const [appReviews,setAppReviews] = useState<UserAppReviews []|null>(null)

  const fetchData = async()=>{
    try{
    const querySnapshot = await getDocs(collection(db, "app_features"));
    const tempAF:AppFeature[] = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      tempAF.push(
        {
          id:doc.id,
          ...doc.data() 
       } as AppFeature)
    });

    setAppFeatures(tempAF);

      const collectionRef = collection(db, "membership","prod_RgC8KOaMNtX5PL","prices"); 
      const q = query(collectionRef, orderBy("unit_amount", "asc"));

      const snapshot = await getDocs(q); 
      console.log(snapshot);
      const tiersData = snapshot.docs.map((doc) => ({ 
        id:doc.id,
        description: doc.data().description, 
        unit_amount:doc.data().unit_amount, 
        currency: doc.data().currency, 
        interval:doc.data().interval,
      })); 
    setMembershiptier(tiersData);

    const companyAdRef= doc(db, "company_info", "contact_details");
    const docSnap = await getDoc(companyAdRef);


    if (docSnap.exists()) {
      setContactInfo(docSnap.data() as CompanyContactDetails)
    } else {
      console.log("No such document!");
    }

    const vidSnap = await getDocs(collection(db, "video_links"));
    if (vidSnap)
      {
        let temp:WebsiteLinks[] = [];
        vidSnap.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          } as WebsiteLinks;
            temp.push(data);
        })
        setVideoLinks(temp);
      };
      

      const reviewQuery = query(collection(db, "user-Reviews-App"), limit(3));
      const reviewSnap = await getDocs(reviewQuery);
      if (reviewSnap)
        {
          let temp: UserAppReviews[] = [];
          reviewSnap.forEach((doc) => {
            const data = {
              ...doc.data(),
            } as UserAppReviews;
              temp.push(data);
          })
          console.log(temp);
          setAppReviews(temp);
        };


    const appLinksSnap = await getDocs(collection(db,"website_links"))
    appLinksSnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = {
        id:doc.id,
        ...doc.data()
      }as WebsiteLinks;
  
      // Check if the name is not "ios_download" or "android_download"
      if (data.name === "ios_download") {
        setIosLink(data.link)
      }
      if (data.name === "android_download" ){
        setAndroidLink(data.link);
      }

    });


  }
  catch(err)
  {
    console.log(err);
  }
    setLoading(false);
    
  }

  useEffect(()=>{
    fetchData();
  },[])


  if (loading)
  {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
      <span className="loading loading-infinity loading-lg"></span>
      </div>
    )
  }


  if (!loading)
  {
    return (
      <div className='flex flex-col '>
      
          <motion.div className='min-h-screen xl:h-[85vh] w-full  
            md:flex flex-col gap-3 xl:flex-row xl:justify-evenly
           items-center pt-24 xl:pt-0 p-4 mb-20'
  
           initial={{opacity:0, y: 50}}
           whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.5}}}
           viewport={{once:false,amount:0.5}}
           >
  
          <img         
          src={abundance_dashboard} className='w-full md:w-[70%] lg:w-1/2 xl:w-[35%] rounded-lg'></img>
  
          <div className="w-full 
                        md:w-[70%] lg:w-1/2 xl:w-[35%] p-4 md:p-0  my-8
                          flex flex-col gap-1 md:gap-4 ">
  
            <h1 className="text-4xl md:text-6xl font-black tracking-widest leading-tight my-4">
              TAKE CONTROL OF YOUR
              <br />
              <span className="text-[#00ACAC]">HEALTH</span>
              <br />
              WITH OUR
              <br />
              <span className="text-[#00ACAC]">MOBILE APP</span>
            </h1>
        
              <p className='text-lg md:text-2xl  tracking-wide my-4 xl:w-[90%] '>Use Our Mobile App Abundace, eat healthy, and take control of your insulin levels</p>
  
              {
                iosLink &&
                <Button className='p-8 text-white bg-black shadow-lg font-bold rounded-3xl my-4 lg:my-2'>
                <a className='flex items-center gap-2' href={iosLink} target="_blank" rel="noopener noreferrer">
                 <h1>Download for IOS APK</h1>   
                 <FaApple size={20}/>  
                </a>
                </Button>
              }

  
              {
                androidLink && 
                <Button className='p-8 text-[#00ACAC] bg-black shadow-lg font-bold rounded-3xl '>
                <a className='flex items-center gap-2' href={androidLink} target="_blank" rel="noopener noreferrer">
                 <h1>Download Android APK</h1>     
                 <DiAndroid size={20}/>
                  </a>
                </Button>

              }
  

  
  
          </div>
  
   
  
  
  
          </motion.div>
  
  
  
    
            <motion.h1 
            initial={{opacity:0, y: 80}}
            whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
            viewport={{once:false,amount:0.4}}
            className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14 h-[20vh]'>  
             Our <span className='text-[#009797]'>Premium </span> App <span className='text-[#009797]'>Features</span></motion.h1>
            
  
  
            {appFeatures?.map((item,index)=>(
              <MotionFeature imgSrc={item.image} title={item.name} content={item.description} key={index}/>
            ))}
  
  
  
  
            <motion.h1 
            initial={{opacity:0, y: 80}}
            whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
            viewport={{once:false,amount:0.4}}
            className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14 h-[20vh] mt-32'>
             Our App <span className='text-[#009797]'>Reviews</span></motion.h1>
  
  
  
            {/*APP REVIEW CARD*/}
            <motion.div
            initial={{opacity:0, y: 80}}
            whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
            viewport={{once:false,amount:0.4}}
            
            className='flex flex-col xl:flex-row gap-10  xl:justify-evenly items-center p-5 '
            >
            {appReviews?.map((review,index)=>(
              <AppReviewCard
              key={index}
              name={review.user?.name}
              avatar={review.user?.avatar}
              email={review.user?.email}
              reasonName={review?.review.name}
              score={review.review?.score}
              reasons={review.review?.reasons}

              />
            ))}
            </motion.div>
  
  
  
  
            <motion.h1 
            initial={{opacity:0, y: 80}}
            whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
            viewport={{once:false,amount:0.4}}
            className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14 h-[20vh] mt-32'>
             Our Premium <span className='text-[#009797]'>Price Tiers</span></motion.h1>
  
  
  
  
  
          <motion.div 
                    initial={{opacity:0, y: 80}}
                    whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
                    viewport={{once:false,amount:0.2}}
                    
          className='mt-5 self-center w-[90%]  h-auto grid md:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-center mb-32'>
            {membershipTier?.map((tier,index)=>(
              <Membershipbox {...tier} key={index}/>
            ))}
          </motion.div>
  
          <motion.h1 
            initial={{opacity:0, y: 80}}
            whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
            viewport={{once:false,amount:0.4}}
            className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14 h-[20vh] mt-32'>
            Premium Tier <span className='text-[#009797]'>Benefits</span></motion.h1>



            <ComparisonTable
            appFeatures={appFeatures}
            />




          <motion.h1 
            initial={{opacity:0, y: 80}}
            whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
            viewport={{once:false,amount:0.4}}
            className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14 h-[20vh] mt-32'>
             Your Reason  <span className='text-[#009797]'>to join us</span></motion.h1>
            
            <div className='flex flex-col gap-4 items-center'>
            {videoLinks?.map((vid,index)=>(
              <iframe  className='w-96 h-96 xl:w-[1000px] xl:h-[900px]'
              key={index}
              src={vid.link}>
              </iframe>
            ))}
            </div>



          <motion.h1 
            initial={{opacity:0, y: 80}}
            whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
            viewport={{once:false,amount:0.4}}
            className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14 h-[20vh] mt-32'>
             Our <span className='text-[#009797]'>Location</span></motion.h1>
  
            
            {contactInfo &&
              <ContactInfo
               embeddedLink={contactInfo.embeddedLink}
              address={contactInfo.address}
              phone={contactInfo.phone}
             openingTime={contactInfo.openingTime}
              closingTime={contactInfo.closingTime}
              />            
                
            }

  
    
  
      </div>
    )
  }
  }

