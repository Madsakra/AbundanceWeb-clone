import {  useAuth } from "@/contextProvider";
import { useEffect, useState } from "react"
import { BsCake2Fill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { FaTransgenderAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import EditProfileForm from "@/nutriComponents/EditProfileForm";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase-config";
import { ProfileType } from "@/types/userTypes";
import ReviewCard from "@/nutriComponents/ReviewCard";


export type DisplayedReview={
  name:string,
  reasons:string[],
  score:number,
  userInfo:{
    avatar:string,
    name:string,
    email:string,
  }
}



export default function Profile() {
 
  const [loading,setLoading] = useState(false);
  const [editProfile,setEditProfile] = useState(false);
  const {user} = useAuth();  
  const [profile,setProfile] = useState<ProfileType | null>(null)
  const [resumeURL, setResumeURL] = useState(null); // State for Resume URL
  const [certificationURL, setCertificationURL] = useState(null); // State for Certificate URL
  const [reviews, setReviews] = useState<DisplayedReview[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);

  const fetchProfile = async()=>{

    if (user)
    {
      const profileRef = doc(db,"accounts",user.uid,"profile","profile_info");
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists())
      {
        console.log(profileSnap.data());
        setProfile(profileSnap.data() as ProfileType);
      }
    }
  }


  // Fetch resumeURL and certificateURL from Firestore
  useEffect(() => {
    if (user && user.uid) {
      fetchProfile();
      const fetchPracticingInfo = async () => {
        try {
          const docRef = doc(db, "accounts", user.uid, "approval_info", "practicing_info");
          const docSnap = await getDoc(docRef);

          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setResumeURL(data?.resumeURL || null);
            setCertificationURL(data?.certificationURL || null);
          } else {
            console.log("No practicing info found");
          }
        } catch (error) {
          console.error("Error fetching practicing info: ", error);
        } finally {
          setLoading(false); // Done loading
        }
      };
      
      fetchPracticingInfo();
    }
  }, [user]);

  // Function to open the document URLs
  const openPDF = (url: string) => {
    if (!url) {
      alert("No document available.");
      return;
    }
    window.open(url, "_blank");
  };



  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    // Reference to the user_reviews collection
    const reviewRef = collection(db, "accounts", user.uid, "user_reviews");

    // Set up the real-time listener
    const unsubscribe = onSnapshot(reviewRef, (querySnapshot) => {
      const reviewsData: DisplayedReview[] = [];
      let totalScore = 0;

      querySnapshot.forEach((doc) => {
        const review = doc.data() as DisplayedReview;
        reviewsData.push(review);

        // Assuming the review has a numerical `score` field
        if (review.score !== undefined) {
          totalScore += review.score;
        }
      });

      setReviews(reviewsData);

      // Calculate average score
      const avgScore = reviewsData.length > 0 ? totalScore / reviewsData.length : null;
      setAverageScore(avgScore);

      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [user?.uid]);




  return (
    <>
   

    {loading? 
    <div className="flex h-screen w-screen justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
    </div>

    
    :


    <div className="flex flex-col ps-12 lg:ps-20 py-10">

        {
          editProfile && 
          <EditProfileForm
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          fetchProfile={fetchProfile}
          />
        }



      <h1 className="text-[#656363] text-2xl mb-5">Profile</h1>
        <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex flex-col items-center w-96 p-8 gap-2 rounded-2xl shadow-2xl  border-2">

              <button className="btn-ghost self-end rounded-lg w-10 h-10 bg-[#6B7FD6] flex justify-center items-center" onClick={()=>setEditProfile(true)}>
              <FaRegEdit color="white" size={20}/>
              </button>
  
              <img src={profile?.avatar} className="w-40 h-40 rounded-full mt-5"/>
              <div className="flex flex-col gap-2  mt-20 xl:mt-10 text-center">
              <h1 className="text-2xl">Title: {profile?.title}</h1>
              <h2 className="text-[#6C6C6C] mt-2 mb-4">ID: {user?.uid}</h2>

              {/*BIRTH DATE*/}
              <div className="bg-[#6B7FD6] rounded-2xl p-4 gap-4 w-80 h-10 flex items-center ">
              <BsCake2Fill color={"white"} />
              <h1 className="text-white">{profile?.dob}</h1>
              </div>

               {/*Email*/}
              <div className="bg-[#6B7FD6] rounded-2xl p-4 gap-4 w-80 h-10 flex items-center ">
              <MdEmail color={"white"} />
              <h1 className="text-white">{user?.email}</h1>
              </div>

              {/*GENDER*/}
              <div className="bg-[#6B7FD6] rounded-2xl p-4 gap-4 w-80 h-10 flex items-center ">
              <FaTransgenderAlt color="white"/>
              <h1 className="text-white">{profile?.gender}</h1>
              </div>
              </div>
        </div>


        <div className="flex flex-col w-96 border-2 h-96 rounded-xl p-16 shadow-2xl ">
          <h1 className="text-[#6B7FD6] text-xl font-semibold mb-10">Practicing Information</h1>
          
              {/* Resume Button */}
              <div className="flex gap-4 items-center mb-8">
                <IoDocumentTextOutline size={25} />
                <button onClick={() => resumeURL && openPDF(resumeURL)}>
                 Resume
                 </button>
              </div>

              {/* Certificate Button */}
              <div className="flex gap-4 items-center mb-8">
                <IoDocumentTextOutline size={25} />
                <button onClick={() => certificationURL && openPDF(certificationURL)}>
                  Certificate
                  </button>
              </div>

          <h1 className="text-lg text-[#5F5F5F] mt-10">Expiry Date: 12/12/25 </h1>
        </div>
        </div>
      

        {/* RATINGS PORTION */}
        <div className="flex gap-2 flex-col mt-20  w-full  ">
          <div className="flex flex-row items-center justify-between">
          <h1 className="text-[#8797DA] text-3xl">Overall Ratings</h1>
          </div>

          {
            reviews.length>0?
            <>
            <div className="flex flex-row gap-4 mt-6 items-center mb-8">
              <h2 className="text-2xl">{averageScore}</h2>
              <FaStar color="#00ACAC" size={25} />
              <h3 className="text-lg">Ratings ({reviews.length})</h3>
            </div>
              {/* SINGLE RATING */}
            {reviews.map((review)=>(
            <ReviewCard {...review}/>
              ))}
      

            </>:
            <div className="my-6">
              <h1 className="text-2xl">No reviews for now...</h1>
            </div>
            
          }
 
        
    
        </div>


      </div>
 









  
  


    
      }

      </>
  )
}
