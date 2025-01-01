import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import nutriVerify from '../../assets/Images/login_splashes/nutri_verify.jpg'

import FileSubmission from '@/customizedComponents/FileSubmission';

export default function NutritionistSubmission() {
    const [selectedCert, setSelectedCert] = useState<File | null>(null);
    const [selectedResume,setSelectedResume] = useState<File | null>(null);





    let navigate = useNavigate();
  
  
  
    const handleSubmit = ()=>{
     
      navigate('/login')
    }
  
  
  
    return (
      <div className='w-full h-full  
       flex flex-col lg:flex-row mt-14 
       items-center justify-evenly my-10'>
  
        <img src={nutriVerify} className='w-96 h-96 '></img>
  
          {/* INPUT FORM */}
          <div className='w-96 xl:w-[30%] h-auto p-8'>
  
              <div className="inline-block text-center">
                <span className="text-2xl font-bold">Verification</span>
                <div className="mt-1 h-[5px] rounded bg-teal-500 w-full"></div>
              </div>
  
              <div className='flex flex-col gap-4'>
  
                    <h2 className='text-md  mt-14 tracking-widest leading-relaxed'>
                    You have selected your role as a nutritionist. Please Upload the relevant documents for verification.
                    </h2>
  
                  
                    <FileSubmission 
                    submissionTitle="Certification"
                    selectedFile={selectedCert}
                    setSelectedFile={setSelectedCert}
                    />

                    
                    <FileSubmission 
                    submissionTitle="Resume"
                    selectedFile={selectedResume}
                    setSelectedFile={setSelectedResume}
                    />
                    

  
  
                {/*Submit BUTTON*/}
                <button className='w-full p-4 bg-[#009797] mt-6 text-white text-lg font-semibold rounded-full'
                onClick={handleSubmit}
                >
                  Submit
                </button>
  
  
          </div>
  
  
  
      </div>
  
      </div>
    )
}
