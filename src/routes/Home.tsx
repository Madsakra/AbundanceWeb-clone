import { Button } from '@/components/ui/button'
import homeApp from '../assets/Images/home-app-promo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons'; // Import the specific brand icon
import abundance_dashboard from '../assets/Images/abundance_dashboard.png'
import CustomAccordion from '@/customizedComponents/CustomAccordion';

const appFeatures = [
  {trigger:'Personalized Logging Screen',content:'Organize the app the way it suits you best. Remove or add fields to suit your therapy needs. The order of the fields can be rearranged.'},
  {trigger:'RealTime Reading Of Glucose',content:'Get instant access to your glucose levels, ensuring that you are always in control of your health.'},
  {trigger:'Chart Your Glucose Levels',content:'Visualize your glucose data through easy-to-understand charts, helping you identify patterns and trends.'},
  {trigger:'Predict Glucose Levels',content:'Utilize advanced algorithms to anticipate future glucose levels, allowing you to proactively manage your health.'},
  {trigger:'Secure and Encrypted Data',content:'Rest assured that your personal health data is protected with robust encryption, ensuring your privacy and security.'}
];





export default function Home() {
  return (
    <>
        <div className='h-screen xl:h-[85vh] w-full  md:flex md:flex-col gap-3 relative
        xl:flex-row justify-center items-center mt-8 p-2 top-[50px] md:top-[100px] xl:top-[20px]'>
            <div className="w-full md:w-[600px] md:h-[300px]   p-4 md:p-0   flex flex-col gap-1 md:gap-4 text-center xl:text-start ">
                <h1 className='text-4xl md:text-6xl font-bold  '>BE THE <span className='text-[#009797]'>CHANGE</span></h1>
                <h2 className='text-4xl md:text-6xl font-bold'>YOU WANT <span className='text-[#009797]'>TO SEE</span></h2>
                <p className='text-lg font-light '>Eat Healthier and take control of your life today!</p>

                <div className='flex flex-col md:flex-row  mt-[4%] gap-2 md:gap-10 md:justify-center xl:justify-start'>
                <Button className='py-6 px-8 text-[#009797] bg-white shadow-lg border-2 rounded-lg md:max-w-52'>
                  <div className='flex items-end gap-2'>
                   <h1>Available on IOS</h1>     
                  <FontAwesomeIcon icon={faApple} className='size-6' /> 
                  </div>
               
                  </Button>

                <Button className='py-6 px-8 bg-[#009797] text-white shadow-lg border-2 rounded-lg md:max-w-52'>
                  <div className='flex items-center gap-3'>
                   <h1>Available on Playstore</h1>     
                   <FontAwesomeIcon icon={faGooglePlay} className='size-4' />
                  </div>
                  
                   </Button>
                </div>
            </div>

            <div className='h-[90%]  flex md:items-center justify-center'>
            <img src={homeApp} className='object-fit h-[70%] md:h-[85%] lg:h-[90%] xl:h-[95%] mt-[5%] p-2 lg:mt-5'></img>
            </div>
      
        </div>



      <div className='h-screen relative bg-[#EEEEEE] top-[200px] md:top-[200px] xl:top-[100px] flex flex-col '>

          <h1 className='text-center text-5xl font-bold text-[#5D5D5D] border-2 p-5 xl:p-14'>Explore <span className='text-[#009797]'>Abundance </span> App <span className='text-[#009797]'>Features</span></h1>
          
          <div className='hidden md:flex items-center justify-center  my-20 xl:my-0'>

          <div className='h-[90%]  flex md:items-center md:justify-center w-full gap-10 '>
            <img src={abundance_dashboard} className='object-fit h-[70%] md:h-[85%] lg:h-[90%] xl:h-[95%] mt-[5%] p-2 lg:mt-5 '></img>
            <CustomAccordion appFeatures={appFeatures}/>
          </div>


      

          </div>




      </div>



    </>
  )
}
