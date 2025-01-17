import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import {  useState } from "react"
import {  doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase-config";
import { WebsiteLinks } from "@/routes/Authenticated/Admin/ContentManagement/WebsiteContent";

type EditVideoProps = {
    video: WebsiteLinks | null;
    fetchData:(action:"start")=>void;
    editVidLink:boolean;
    setEditVidLink:(edit:boolean)=>void;
}




export default function EditWebsiteVideo({video,fetchData,editVidLink,setEditVidLink}:EditVideoProps) {
 
 
    const [vidName,setVidName] = useState(video?.name);
    const [vidLink,setVidLink] = useState(video?.link);
 

    const handleSave = async ()=>{

        if (vidName?.trim()===""||vidLink?.trim()==="")
        {
            alert("Please do not leave the inputs blank!")
        }


        else if (video)
        {
            try{

                const docRef = doc(db, "video_links",video.id); 
                await updateDoc(docRef,{
                    name:vidName,
                    link:vidLink
                });

                alert("Video Link Updated !")
                fetchData("start");
            }

            catch(err)
            {
                alert("Error updating"+err);
            }

        }   
        else {
          alert("Please enter your data correctly.");
        }
        
    }


 
    return (
        <AlertDialog onOpenChange={setEditVidLink} open={editVidLink}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Video Link</AlertDialogTitle>
            <AlertDialogDescription>
                Edit your {vidName} link   
            </AlertDialogDescription>
          </AlertDialogHeader>
    
            <div className="flex flex-col">
                <input placeholder="Video Name" type="text" 
                value={vidName}
                className="input input-bordered w-full my-5 mt-2"
                onChange={(e)=>setVidName(e.target.value)}
                />

                <input placeholder="Video Link" type="text" 
                value={vidLink}
                className="input input-bordered w-full my-5 mt-2"
                onChange={(e)=>setVidLink(e.target.value)}
                />

            </div>
           
   
    
          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Edit Address</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
}

