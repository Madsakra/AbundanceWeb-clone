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
    const [openingTime, setOpeningTime] = useState<string>("");
    const [closingTime, setClosingTime] = useState<string>("");
    const [phone,setPhone] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);

    const handleOpeningTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOpeningTime = e.target.value;
        setOpeningTime(newOpeningTime);
      
        // Ensure closing time is not earlier than the new opening time
        if (closingTime && newOpeningTime >= closingTime) {
          setErrorMessage(true);
        } 
        else{
            setErrorMessage(false);
        }
      };
      
      const handleClosingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newClosingTime = e.target.value;
        setClosingTime(newClosingTime);
      
        // Ensure closing time is not earlier than the opening time
        if (openingTime && newClosingTime <= openingTime) {
          setErrorMessage(true);
        } 
        else{
            setErrorMessage(false);
        }
      };








    const formatTime = (time: string): string => {
        const [hour] = time.split(":").map(Number);
        const period = hour >= 12 ? "pm" : "am";
        const formattedHour = hour % 12 || 12; // Convert 0 to 12
        return `${formattedHour}${period}`;
      };

      // to be displayed when form appears
      const convertTo24HourFormat = (time: string): string => {
        const match = time.match(/(\d{1,2})(am|pm)/i);
        if (!match) {
          throw new Error("Invalid time format");
        }
      
        let [_, hourStr, period] = match; // Extract hour and period (am/pm)
        let hour = parseInt(hourStr, 10);
      
        // Adjust hours for 24-hour format
        if (period.toLowerCase() === "pm" && hour !== 12) {
          hour += 12;
        }
        if (period.toLowerCase() === "am" && hour === 12) {
          hour = 0;
        }
      
        // Format to "HH:mm"
        return `${hour.toString().padStart(2, "0")}:00`;
      };



    const handleSave = async () => {

        const formattedOpening = formatTime(openingTime);
        const formattedClosing = formatTime(closingTime);

        if (formattedOpening && formattedClosing) {
            
            try{

                const docRef = doc(db, "company_info", "contact_details"); 
                await updateDoc(docRef,{
                    address:addressName,
                    openingTime:formattedOpening,
                    closingTime:formattedClosing,
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
        else {
          alert("Please set both opening and closing times.");
        }
      };


      useEffect(()=>{

        if (companyAddress)
        {
            setAddressName(companyAddress.address);
            setEmbeddedLink(companyAddress.embeddedLink);
            setOpeningTime(convertTo24HourFormat(companyAddress.openingTime));
            setClosingTime(convertTo24HourFormat(companyAddress.closingTime));
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
           
           <AlertDialogDescription>
                Set Company Opening hours    
            </AlertDialogDescription>
               
            <div className="my-4">
            <label>
                Opening Time:
                <input
                className="input input-md input-bordered mx-4"
                type="time"
                value={openingTime}
                onChange={handleOpeningTimeChange}
                />
            </label>
            </div>
            <div className="my-2">
            <label>
                Closing Time:
                <input
                className="input input-md input-bordered mx-4"
                type="time"
                value={closingTime}
                onChange={handleClosingTimeChange}
                />
            </label>
            </div>

            {errorMessage && (
            <div className="text-red-500 text-sm mt-2">"Please Enter a valid opening hours"</div>
            )}
 
    
    
     
    
    
   
            </div>
    
    
    
          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Edit Address</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      )
}
