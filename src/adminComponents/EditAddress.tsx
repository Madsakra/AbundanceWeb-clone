import { CompanyContactDetails } from "@/routes/Authenticated/Admin/ContentManagement/WebsiteContent"
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
import { useEffect, useState } from "react"
import {  doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase-config";

type EditAddressProps = {
    companyAddress:CompanyContactDetails | null;
    fetchData:(action:"start")=>void;
    editAddress:boolean;
    setEditAddress:(edit:boolean)=>void;
}



export default function EditAddress({companyAddress,fetchData,editAddress,setEditAddress}:EditAddressProps) {
    
    const [addressName,setAddressName] = useState("");
    const [embeddedLink,setEmbeddedLink] = useState("");
    const [phone,setPhone] = useState("");








    const handleSave = async () => {
 
    
            if (addressName.trim() === "" || embeddedLink.trim() === "" || phone.trim()==="")
            {
              alert("Please do not leave out some of the information for address!")
            }

  
           else{

            try{
              const docRef = doc(db, "company_info", "contact_details"); 
              await updateDoc(docRef,{
                  address:addressName,
                  embeddedLink:embeddedLink,
                  phone:phone
              });
              alert("Company Information Updated !")
              fetchData("start");
          }

          catch(err)
          {
              alert("Error updating"+err);
          }

          } 


     

      };


      useEffect(()=>{

        if (companyAddress)
        {
            setAddressName(companyAddress.address);
            setEmbeddedLink(companyAddress.embeddedLink);
            setPhone(companyAddress.phone)
        }

      },[])

      const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
    
        // Allow only numeric input
        if (/^\d*$/.test(value)) {
          setPhone(value);
        }
      };

    return (
        <AlertDialog onOpenChange={setEditAddress} open={editAddress}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Company's Addres</AlertDialogTitle>
            <AlertDialogDescription>
                Edit your company's address to facilitate any changes     
            </AlertDialogDescription>
          </AlertDialogHeader>
    
            <div className="flex flex-col">
                <input placeholder="Address Name" type="text" 
                value={addressName}
                className="input input-bordered w-full my-5 mt-2"
                onChange={(e)=>setAddressName(e.target.value)}
                />

                <input placeholder="Embedded Link (Google Maps)" type="text" 
                value={embeddedLink}
                className="input input-bordered w-full my-5 mt-2"
                onChange={(e)=>setEmbeddedLink(e.target.value)}
                />

            <input
            placeholder="Phone"
            type="tel"
            value={phone}
            className="input input-bordered w-full my-5 mt-2"
            onChange={handlePhoneChange} // Ensure numeric input
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
