
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
import { MembersipTier } from "@/routes/Authenticated/Admin/ContentManagement/MembershipPrice"
import { useEffect, useState } from "react"
import axios from 'axios';
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase-config";


type MembershipFormProps = {
    openForm:boolean,
    setOpenForm:(open:boolean)=>void,
    mutation:string,
    membershipTier?:MembersipTier,
    fetchData:()=>void;
    setLoading:(load:boolean)=>void
}

interface Currency {
    code: string;
    name: string;
    symbol?: string;
  }

export default function MembershipForm({openForm,setOpenForm,mutation,membershipTier,fetchData}:MembershipFormProps) {
 
    // FETCH CURRENCY FROM REST COUNTRIES API
const [currencies, setCurrencies] = useState<Currency[]>([]);

const [selectedCurrency, setSelectedCurrency] = useState<string>('');
 const [tierName,setTierName] = useState("");
 const [value,setValue] = useState<number>()
 const [recurrency,setRecurrency] = useState("");
 
 const handleAddOrEditTier = async () => { 
    try { 
      if (membershipTier?.id) { 
        // Edit Tier 
        const docRef = doc(db, "membership",membershipTier.id); 
        await updateDoc(docRef, { 
          tier_name: tierName, 
          value: value, 
          currency: selectedCurrency, 
          recurring: recurrency, 
        }); 
        alert("Membership tier edited successfully"); 
        
      } else { 
        // Add Tier 
        const collectionRef = collection(db, "membership"); 
        await addDoc(collectionRef, { 
          tier_name: tierName, 
          value: value, 
          currency: selectedCurrency, 
          recurring: recurrency, 
        }); 
        alert("Membership tier added successfully"); 
      } 
      
     fetchData();

    } catch (error) { 
      console.error("Error adding/updating tier: ", error); 
      alert("Failed to process request. Please try again."); 
    } 
  }; 
 

 

 useEffect(() => {


    if (membershipTier)
        {
            setTierName(membershipTier.tier_name);
            setValue(membershipTier.value);
            setSelectedCurrency(membershipTier.currency)
            setRecurrency(membershipTier.recurring);
        }


    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const uniqueCurrencies = new Map();

        response.data.forEach((country: any) => {
          if (country.currencies) {
            Object.entries(country.currencies).forEach(([code, details]: [string, any]) => {
              if (!uniqueCurrencies.has(code)) {
                uniqueCurrencies.set(code, {
                  code,
                  name: details.name,
                  symbol: details.symbol,
                });
              }
            });
          }
        });

        setCurrencies(Array.from(uniqueCurrencies.values()));
      } catch (error) {
        console.error('Error fetching currencies:', error);
      } 
    };

    fetchCurrencies();
  }, []);


  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(event.target.value);
  };


  const handleRecurring = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRecurrency(event.target.value);
  };

  return (
    <AlertDialog onOpenChange={setOpenForm} open={openForm}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{mutation==="add"? <h1>Add Membership</h1>: <h2>Edit Membership</h2>}</AlertDialogTitle>
        <AlertDialogDescription>
        {mutation==="add"? <h1>Add Membership Tier for your users to view</h1>: <h2>Edit Membership Tier for your users to view</h2> } 
        
        </AlertDialogDescription>
      </AlertDialogHeader>

        <div className="flex flex-col">
            <input placeholder="Tier Name" type="text" 
            value={tierName}
            className="input input-bordered w-full my-5 mt-2"
            onChange={(e)=>setTierName(e.target.value)}
            />

            <input placeholder="Value" type="number" className="input input-bordered w-full " 
            value={value}
            onChange={(e)=>setValue(Number(e.target.value))}/>



            <select value={selectedCurrency} 
            className="select select-bordered w-full my-5" 
            onChange={handleCurrencyChange}>
                    <option value="" disabled>
                    Select a currency
                    </option>
                    {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name} {currency.symbol && `(${currency.symbol})`}
                    </option>
                    ))}
                </select>


       


            <select className="select select-bordered w-full"
            value={recurrency}
            onChange={handleRecurring}
            >
            <option disabled selected>Membership Tier</option>
            <option value="-">-</option>
            <option value="Annually">Annually</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
         
            </select>

        </div>



      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleAddOrEditTier}>{mutation} Membership</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}
