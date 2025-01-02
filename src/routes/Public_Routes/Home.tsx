import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons'; // Import the specific brand icon
import abundance_dashboard from '../../assets/Images/DISPLAY_ART.png'
import Membershipbox from '@/customizedComponents/Membershipbox';
import { motion } from "motion/react"
import feature2 from '../../assets/Images/feature2.jpg'
import feature1 from '../../assets/Images/feature-1.jpg'
import feature3 from '../../assets/Images/feature3.jpg'
import feature4 from '../../assets/Images/feature4.png'
import feature5 from '../../assets/Images/feature5.jpg'
import MotionFeature from '@/customizedComponents/MotionFeature';
import reviewAvatar1 from "../../assets/Images/peter.png";
import reviewAvatar2 from "../../assets/Images/carrie.png";
import reviewAvatar3 from '../../assets/Images/emma.png';
import AppReviewCard from '@/customizedComponents/AppReviewCard';
import ContactInfo from '@/customizedComponents/ContactInfo';


const featuresImages = [
  feature1,feature2,feature3,feature4,feature5
]


const appFeatures = [
  {title:'Personalized Logging Screen',content:'Organize the app the way it suits you best. Remove or add fields to suit your therapy needs.',image:featuresImages[0]},
  {title:'RealTime Reading Of Glucose',content:'Get instant access to your glucose levels, ensuring that you are always in control of your health.',image:featuresImages[1]},
  {title:'Chart Your Glucose Levels',content:'Visualize your glucose data through easy-to-understand charts, helping you identify patterns and trends.',image:featuresImages[2]},
  {title:'Predict Glucose Levels',content:'Utilize advanced algorithms to anticipate future glucose levels, allowing you to proactively manage your health.',image:featuresImages[3]},
  {title:'Secure and Encrypted Data',content:'Rest assured that your personal health data is protected with robust encryption, ensuring your privacy and security.',image:featuresImages[4]}
];




// DYNAMIC, TO PULL FROM DB
const membershipTier = [
  {title:'Free', price:0, recurring:"Month",currency:"SGD",features:["Free Manual Logging"], notAvailable:["No AI Features","No Nutritionist"],joinNow:false},
  {title:"Calories Premium",price:19, recurring:"Month",currency:"SGD",features:["AI Calories tracking",  "Nutritionist Available"], notAvailable:["Premium Glucose Features"],joinNow:true},
  {title:"Glucose Premium", price:19, recurring:"Month",currency:"SGD", features:["AI glucose tracking", "Nutritionist Available"],notAvailable:["Premium Calories Features"],joinNow:true},
  {title:"Full Premium", price:29, recurring:"Month",currency:"SGD", features:["AI glucose tracking", "Nutritionist Available","Glucose and Calories analysis"],joinNow:true},
]


// APP REVIEWS
// DYNAMIC, PULL FROM DB LATER
const appReviews = [
  {name:"Bobbins Drow",score:3.7,reviews:["Helps me loose calories!","Beautiful UI designs","Glucose Levels dropped significantly!"],avatar:reviewAvatar1},
  {name:"Carrie Ann",score:4.0,reviews:["Helps me loose calories!","Beautiful UI designs","Glucose Levels dropped significantly!","Slimmed down after cutting calories"],avatar:reviewAvatar2},
  {name:"Emma Joe",score:3.2,reviews:["Helps me loose calories!","Beautiful UI designs"],avatar:reviewAvatar3}
]

// CONTACT
// DYNAMIC, PULL FROM DB
const contactInfo = {
  mapSrc:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7444038584135!2d103.7761745!3d1.3294012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1080893304bd%3A0xc889e76f4e447e42!2sSIM%20Global%20Education!5e0!3m2!1sen!2ssg!4v1735703701653!5m2!1sen!2ssg",
  address:"461 Clementi Rd, Singapore 599491",
  openingHours:"9-7pm",
  phone:"62489746",
  email:"abundance24@gmail.com"
}


export default function Home() {
  
  
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


            <Button className='p-8 text-white bg-black shadow-lg font-bold rounded-3xl my-4 lg:my-2  '>
                  <div className='flex items-end gap-2'>
                   <h1>Download on IOS</h1>     
                  <FontAwesomeIcon icon={faApple} className='size-6' /> 
                  </div>
                  </Button>

 

                  <Button className='p-8 text-[#00ACAC] bg-black shadow-lg font-bold rounded-3xl '>
                  <div className='flex items-end gap-2'>
                   <h1>Download on Playstore</h1>     
                    <FontAwesomeIcon icon={faGooglePlay} className='size-6' /> 
                    </div>
                  </Button>


        </div>

 



        </motion.div>



  
          <motion.h1 
          initial={{opacity:0, y: 80}}
          whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
          viewport={{once:false,amount:0.4}}
          className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14 h-[20vh]'>  
            Explore <span className='text-[#009797]'>Abundance </span> App <span className='text-[#009797]'>Features</span></motion.h1>
          


          {appFeatures.map((item,index)=>(
            <MotionFeature imgSrc={item.image} title={item.title} content={item.content} key={index}/>
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
          {appReviews.map((review,index)=>(
            <AppReviewCard
              avatar={review.avatar}
              score={review.score}
              name={review.name}
              reviews={review.reviews}
              key={index}
            />
          ))}
          </motion.div>




          <motion.h1 
          initial={{opacity:0, y: 80}}
          whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
          viewport={{once:false,amount:0.4}}
          className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14 h-[20vh] mt-32'>
           Join Our <span className='text-[#009797]'>Membership</span></motion.h1>





        <motion.div 
                  initial={{opacity:0, y: 80}}
                  whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
                  viewport={{once:false,amount:0.2}}
        className='mt-5 w-full h-auto grid grid-cols-1 lg:grid-cols-2 p-10 xl:grid-cols-4 gap-4 justify-items-center mb-32'>
          {membershipTier.map((tier,index)=>(
            <Membershipbox {...tier} key={index}/>
          ))}
        </motion.div>

        <motion.h1 
          initial={{opacity:0, y: 80}}
          whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.4}}}
          viewport={{once:false,amount:0.4}}
          className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14 h-[20vh] mt-32'>
           Our <span className='text-[#009797]'>Location</span></motion.h1>


        <ContactInfo
        mapSrc={contactInfo.mapSrc}
        email={contactInfo.email}
        address={contactInfo.address}
        phone={contactInfo.phone}
        openingHours={contactInfo.openingHours}
        />

  

    </div>
  )
}
