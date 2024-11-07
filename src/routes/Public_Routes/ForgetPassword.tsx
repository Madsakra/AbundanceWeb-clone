
import miniLogo from '../../assets/Images/mini-logo.svg'

export default function ForgetPassword() {
  return (
    <div className='w-full h-[80vh] flex items-center justify-center my-10'>

        {/*OUTER CONTAINER*/}
      <div className="w-80 h-[35rem] md:w-[26rem] bg-[#009797] -rotate-6 
      flex items-center justify-center rounded-lg">
      </div>


        {/*INNER CONTAINER*/}
      <div className="w-80 h-[35rem] md:w-[26rem]  
      bg-white absolute rotate-0 shadow-lg 
      rounded-lg flex flex-col gap-4">

            <div className="flex flex-row gap-6 items-center p-10 mt-10 pb-6 md:pb-10 ">
                   <img src={miniLogo} alt="logo" className='object-fill w-14 h-14 md:w-20 md:h-20' />
                    <h1 className='text-2xl md:text-3xl font-bold'>Forget Password</h1>
            </div>


            <div className='my-2 mb-5 mx-10'>
                <h1 className=''>Enter your Email Address below, we will send a link to you to reset your password</h1>
            </div>


            {/* INPUT FORMS */}
            <div className='border-b-2 w-[80%] ml-10 '>
                <input className='w-full p-3' type="email" placeholder='Email Address'/>
            </div>


            

            {/* SIGN IN BUTTON, FORGET PASSWORD */}
            <div className='mt-5 w-[80%] ml-10 gap-4 md:gap-0
            justify-between flex flex-col md:flex-row items-center'>
                
            <button className='w-full  p-3 rounded-md text-white bg-[#009797]
            hover:bg-white hover:text-[#009797] hover:border-[#009797] border-2'>

            <h1 className='text-lg font-bold'>Reset Password</h1>
            </button>
            

            </div>
  



        </div>



    </div>
  )
}
