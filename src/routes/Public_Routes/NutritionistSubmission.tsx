import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import nutriVerify from '../../assets/Images/login_splashes/nutri_verify.jpg'
import { getDownloadURL, getStorage, ref,uploadBytes } from "firebase/storage"
import FileSubmission from '@/customizedComponents/FileSubmission';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase-config';
import { collection, doc, setDoc } from 'firebase/firestore';

export default function NutritionistSubmission() {
    const [selectedCert, setSelectedCert] = useState<File | null>(null);
    const [selectedResume,setSelectedResume] = useState<File | null>(null);
    const location = useLocation();
    const { email,password } = location.state as { email: string; password: string };
    const [loading,setLoading] = useState(false)


    let navigate = useNavigate();
  
  
  
    const handleSubmit = async ()=>{

      if (!selectedCert || !selectedResume) {
        alert("Please upload both the certification and resume.");
        return;
      }


      else{
      setLoading(true);
      // register the nutritionist
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredentials.user.uid;
      // add his cert and resume to the storage, by apending their id
      const storage = getStorage();

        
       

      // 2. Upload files to Firebase Storage
      const certRef = ref(storage, `certifications/${uid}`);
      const resumeRef = ref(storage, `resumes/${uid}`);

      // Upload certification
      await uploadBytes(certRef, selectedCert);
      const certURL = await getDownloadURL(certRef);

      // Upload resume
      await uploadBytes(resumeRef, selectedResume);
      const resumeURL = await getDownloadURL(resumeRef);

      // 3. Save to Firestore
      const pendingApprovalRef = doc(collection(db, "pending_approval"), uid);

      await setDoc(pendingApprovalRef, {
        email,
        certificationURL: certURL,
        resumeURL: resumeURL,
        role:"nutritionist",
        awaitApproval: true,
        submittedAt: new Date().toISOString(),
      });

      navigate("/"); // Redirect to home or login page
      setLoading(false);
      // Sign out the user
      auth.signOut();
      alert("Please give our admins some time to verify your particulars.")
      
      }
    }
  
  
    if (loading)
    {
      return( 
      <div className='flex items-center justify-center h-screen'>
      <span className="loading loading-infinity loading-lg"></span>      
      </div>)
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
