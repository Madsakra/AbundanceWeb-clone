import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons'; // Import the specific brand icon
import abundance_dashboard from '../../assets/Images/abundance_dashboard.png'
import CustomAccordion from '@/customizedComponents/CustomAccordion';
import loginImg from '../../assets/Images/login.png'
import registerImg from '../../assets/Images/register.png'
import placeholder1 from '../../assets/Images/placeholder-1.png'
import placeholder2 from '../../assets/Images/placeholder-2.png'
import { useState } from 'react';
import Membershipbox from '@/customizedComponents/Membershipbox';





const appFeatures = [
  {trigger:'Personalized Logging Screen',content:'Organize the app the way it suits you best. Remove or add fields to suit your therapy needs.'},
  {trigger:'RealTime Reading Of Glucose',content:'Get instant access to your glucose levels, ensuring that you are always in control of your health.'},
  {trigger:'Chart Your Glucose Levels',content:'Visualize your glucose data through easy-to-understand charts, helping you identify patterns and trends.'},
  {trigger:'Predict Glucose Levels',content:'Utilize advanced algorithms to anticipate future glucose levels, allowing you to proactively manage your health.'},
  {trigger:'Secure and Encrypted Data',content:'Rest assured that your personal health data is protected with robust encryption, ensuring your privacy and security.'}
];

const featuresImages = [
  loginImg,abundance_dashboard,registerImg,placeholder1,placeholder2
]


// DYNAMIC, TO PULL FROM DB
const membershipTier = [
  {title:'Free', price:0, recurring:"Month",currency:"SGD",features:["Free Manual Logging"], notAvailable:["No AI Features","No Caregivers","No Nutritionist"],joinNow:false},
  {title:"Calories Premium",price:19, recurring:"Month",currency:"SGD",features:["AI Calories tracking", "Caregivers Available", "Nutritionist Available"], notAvailable:["Premium Glucose Features"],joinNow:true},
  {title:"Glucose Premium", price:19, recurring:"Month",currency:"SGD", features:["AI glucose tracking",  "Caregivers Available", "Nutritionist Available"],notAvailable:["Premium Calories Features"],joinNow:true},
  {title:"Full Premium", price:29, recurring:"Month",currency:"SGD", features:["AI glucose tracking",  "Caregivers Available", "Nutritionist Available","Glucose and Calories analysis"],joinNow:true},

]


export default function Home() {
  
  const [featureImgIndex,setFeatureImgIndex] = useState(0);


  const handleFeatureChange = (index:number)=>{
    setFeatureImgIndex(index)
  }
  
  return (
    <div className='flex flex-col'>
        <div className='min-h-screen xl:h-[85vh] w-full  md:flex md:flex-col gap-3 relative
        xl:flex-row justify-center items-center mt-8 p-2 mb-20'>
            <div className="w-full md:w-[600px] md:h-[300px]   p-4 md:p-0   flex flex-col gap-1 md:gap-4 text-center xl:text-start ">
                <h1 className='text-4xl md:text-6xl font-bold  '>BE THE <span className='text-[#009797]'>CHANGE</span></h1>
                <h2 className='text-4xl md:text-6xl font-bold'>YOU WANT <span className='text-[#009797]'>TO SEE</span></h2>
                <p className='text-lg font-light tracking-wide leading-relaxed xl:w-[90%]'>Welcom to Abundance, the calories and glucose management app made for people who want to take control of their health</p>
                <p className='text-lg font-light '>Let us work together towards a brighter future!</p>

                <div className='flex flex-col md:flex-row  mt-[4%] gap-2 md:gap-10 md:justify-center xl:justify-start'>
                <Button className='py-6 px-8 text-[#009797] bg-white shadow-lg border-2 rounded-lg md:max-w-52'>
                  <div className='flex items-end gap-2'>
                   <h1>Download on IOS</h1>     
                  <FontAwesomeIcon icon={faApple} className='size-6' /> 
                  </div>
               
                  </Button>

                <Button className='py-6 px-8 bg-[#009797] text-white shadow-lg border-2 rounded-lg md:max-w-52'>
                  <div className='flex items-center gap-3'>
                   <h1>Download on Playstore</h1>     
                   <FontAwesomeIcon icon={faGooglePlay} className='size-4' />
                  </div>
                  
                   </Button>
                </div>
            </div>

            <div className='h-[90%]  flex md:items-center justify-center md:mt-14'>
            <img src={abundance_dashboard} className='object-fit h-[70%] md:h-[85%] lg:h-[90%] xl:h-[95%] mt-[5%] p-2 lg:mt-5'></img>
            </div>
      
        </div>



      <div className='min-h-screen justify-center relative bg-[#EEEEEE] flex flex-col items-center  pb-10 '>

          <h1 className='text-center text-5xl font-bold text-[#5D5D5D]  p-5  m-2 xl:p-14'>Explore <span className='text-[#009797]'>Abundance </span> App <span className='text-[#009797]'>Features</span></h1>
          

          {/* FOR MEDIUM SCREENS ABOVE */}
          <div className=' md:flex items-center justify-center '>
          <div className='h-[90%]  flex flex-col md:flex-row md:items-center md:justify-center w-full gap-10 '>
            <img src={featuresImages[featureImgIndex]} className='object-fit h-[70%] md:h-[85%] lg:h-[90%] xl:h-[95%] mt-[5%] p-2 lg:mt-5 '></img>
            <CustomAccordion appFeatures={appFeatures} handleFeatureChange={handleFeatureChange}/>
          </div>
          </div>
      </div>



      <div className='min-h-[70vh] relative flex-grow bg-white w-full flex items-center flex-col p-4 md:p-10 gap-10 mb-20'>
        <h1 className='text-7xl font-bold text-center my-5 text-[#5D5D5D]'>Join Our <span className='text-[#009797]'>Membership</span></h1>

        <div className='mt-5 w-full h-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-center'>
          {membershipTier.map((tier,index)=>(
            <Membershipbox {...tier} key={index}/>
          ))}
        </div>



      </div>

    </div>
  )
}
