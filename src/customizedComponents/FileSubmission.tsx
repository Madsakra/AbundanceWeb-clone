import { CiFileOn } from "react-icons/ci";

type FileSubmissionProps = {

    submissionTitle:string;
    selectedFile: File | null;
    setSelectedFile: (file:File)=>void;
    
}





export default function FileSubmission({submissionTitle,selectedFile,setSelectedFile}:FileSubmissionProps) {
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setSelectedFile(file);
        }
      };  
  
      const handleDownload = () => {
        if (selectedFile) {
          const url = URL.createObjectURL(selectedFile);
          const a = document.createElement('a');
          a.href = url;
          a.download = selectedFile.name;
          a.click();
          URL.revokeObjectURL(url); // Clean up the URL object
        }
      };



        return (
                    
            <div className='flex flex-col gap-2 my-4'>
                        <h2 className='font-bold text-md'>{submissionTitle}</h2>
                       
                        {selectedFile? 
                        <div className='h-auto w-full lg:w-1/2 p-5 border-2 rounded flex flex-row gap-4 items-center'>
                            <CiFileOn size={40}/>
                            <button onClick={handleDownload} 
                            className='max-w-24 text-sm'
                            style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer',textAlign:'start' }}>
                                {selectedFile.name}
                            </button>
                        </div>:
                       <div className='h-auto w-full lg:w-1/2 p-5 border-2 rounded flex flex-row gap-4'>
                            <CiFileOn size={40}/>
                            <h1 className="text-sm">Your Submitted File Will Appear Here</h1>
                        </div>
                        
                        }

                        
                     
                        <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className='mt-4 file-input'
                        />
                        
                    </div>
  )
}
