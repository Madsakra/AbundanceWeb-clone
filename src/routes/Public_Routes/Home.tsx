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
import MotionFeature from '@/customizedComponents/motionFeature';

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
  {title:'Free', price:0, recurring:"Month",currency:"SGD",features:["Free Manual Logging"], notAvailable:["No AI Features","No Caregivers","No Nutritionist"],joinNow:false},
  {title:"Calories Premium",price:19, recurring:"Month",currency:"SGD",features:["AI Calories tracking", "Caregivers Available", "Nutritionist Available"], notAvailable:["Premium Glucose Features"],joinNow:true},
  {title:"Glucose Premium", price:19, recurring:"Month",currency:"SGD", features:["AI glucose tracking",  "Caregivers Available", "Nutritionist Available"],notAvailable:["Premium Calories Features"],joinNow:true},
  {title:"Full Premium", price:29, recurring:"Month",currency:"SGD", features:["AI glucose tracking",  "Caregivers Available", "Nutritionist Available","Glucose and Calories analysis"],joinNow:true},

]


export default function Home() {
  
  
  return (
    <div className='flex flex-col'>
    
        <motion.div className='min-h-screen xl:h-[85vh] w-full  
          md:flex flex-col gap-3
         items-center pt-24 xl:pt-0 p-2 mb-20'

         initial={{opacity:0, y: 50}}
         whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.5}}}
         viewport={{once:false,amount:0.5}}
         >

        <img         
        src={abundance_dashboard} className='w-full md:w-[70%] lg:w-1/2 xl:w-[35%] rounded-lg'></img>

        <div className="w-full 
                      md:w-[70%] lg:w-1/2 xl:w-[35%] p-4 md:p-0  my-8
                        flex flex-col gap-1 md:gap-4 ">

            <h1 className='text-4xl md:text-6xl font-bold  tracking-wide leading-relaxed'>BE THE <span className='text-[#00ACAC]'>CHANGE</span> YOU WANT TO <span className='text-[#00ACAC]'>SEE</span></h1>
      
            <p className='text-2xl  tracking-wide my-4 xl:w-[90%]'>Use Our App, eat healthy, and take control of your insulin levels</p>


            <Button className='p-8 text-white bg-black shadow-lg font-bold rounded-lg '>
                  <div className='flex items-end gap-2'>
                   <h1>Download on IOS</h1>     
                  <FontAwesomeIcon icon={faApple} className='size-6' /> 
                  </div>
                  </Button>

 

                  <Button className='p-8 text-[#00ACAC] bg-black shadow-lg font-bold rounded-lg '>
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
          


        {/* <motion.div className='h-[50vh]  w-full flex flex-col lg:flex-row items-center justify-center gap-10'
             initial={{opacity:0, y: 80}}
             whileInView={{opacity:1, y:0, transition:{delay: 0.2 ,duration: 0.5}}}
             viewport={{once:false,amount:1}}>
        <img src={feature1} className='w-96 rounded-xl h-96 '></img>

        <div className='flex flex-col leading-loose tracking-wide gap-5 px-10 md:w-1/2'>
        <h1 className="text-5xl">Personalized Logging Screen</h1>
        <h2 className='font-light'>Organize the app the way it suits you best. Remove or add fields to suit your therapy needs. The order of the fields can be rearranged.</h2>
        </div>

        </motion.div> */}

          {appFeatures.map((item,index)=>(
            <MotionFeature imgSrc={item.image} title={item.title} content={item.content} key={index}/>
          ))}






      <div className='min-h-[70vh] relative flex-grow bg-white w-full flex items-center flex-col p-4 md:p-10 gap-10  mb-20'>
        <h1 className='text-5xl xl:text-7xl font-bold text-center my-5 text-[#5D5D5D]'>Join Our <span className='text-[#009797]'>Membership</span></h1>

        <div className='mt-5 w-full h-auto grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-4 gap-4 justify-items-center'>
          {membershipTier.map((tier,index)=>(
            <Membershipbox {...tier} key={index}/>
          ))}
        </div>



      </div>

    </div>
  )
}
