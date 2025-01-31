import { db, storage } from "@/firebase-config";
import { collection, getDocs, limit, query, QueryDocumentSnapshot, startAfter, endBefore, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomizedDropdown from "@/customizedComponents/CustomizedDropdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import emailjs from '@emailjs/browser';
import {CalendarDate} from "@internationalized/date";
import {Calendar} from "@heroui/calendar";
import { deleteAccountAuth, pageLimit } from "@/utils";
import { PendingAccounts } from "@/types/userTypes";
import { deleteObject, ref } from "firebase/storage";



const headers = ["UID","Email", "Name", "Certification", "Resume"];

export default function PendingUserAccounts() {
  const [loading, setLoading] = useState(true);
  const [pendingAccounts, setPendingAccounts] = useState<PendingAccounts[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState<PendingAccounts[] | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [popupForm, setPopupForm] = useState(false);
  const [accountDueDate, setAccountDueDate] = useState<CalendarDate|null>(null);

  const [selectedAccount, setSelectedAccount] = useState<PendingAccounts | null>(null);



  const fetchAccounts = async (action: "start" | "next" | "prev") => {
    
    // to be used later
    setAccountDueDate(null);
    setLoading(true);

    try {
      let q;
      const accountsRef = collection(db, "pending_approval");

      setPendingAccounts(null);
      setFilteredAccounts(null);
      if (action === "start") {
        q = query(accountsRef, limit(pageLimit));
      } else if (action === "next" && lastVisible) {
        q = query(accountsRef, startAfter(lastVisible), limit(pageLimit));
      } else if (action === "prev" && firstVisible) {
        q = query(accountsRef, endBefore(firstVisible), limit(pageLimit));
      } else {
        console.warn("Invalid action or missing cursors.");
        setLoading(false);
        return;
      }

      const querySnapshot = await getDocs(q);
      const temp: PendingAccounts[] = [];

      if (!querySnapshot.empty) {
        setFirstVisible(querySnapshot.docs[0]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          } as PendingAccounts;
          temp.push(data);
        });

        setPendingAccounts(temp);
        setFilteredAccounts(temp);
      } else {
        console.warn("No documents found.");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts("start");


  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (pendingAccounts) {
      const filtered = pendingAccounts.filter((account) =>
        account.id.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredAccounts(filtered);
    }
  };

  const openPDF = (url: string) => {
    if (!url) {
      alert("No document available.");
      return;
    }
    window.open(url, "_blank");
  };

  const handleApprove = async () => {
    if (!selectedAccount || !accountDueDate) {
      alert("Please provide all required information.");
      return;
    }
    console.log(accountDueDate.toString());

    try {
      setLoading(true);
      const accountDoc = doc(db,"accounts",selectedAccount.id);
      await setDoc(accountDoc,{
        name:selectedAccount.name,
        email:selectedAccount.email,
        role:"nutritionist"
      })

      const nutritionistDoc = doc(db, "accounts", selectedAccount.id,"approval_info","practicing_info");
      await setDoc(nutritionistDoc, {
        certificationURL: selectedAccount.certificationURL,
        resumeURL: selectedAccount.resumeURL,
        dueDate: accountDueDate.toString()
      });


          // send email for verification
          const formData = {
            subject:"Abundance (Notice of Acceptance)",
            name:selectedAccount.name,
            toEmail:selectedAccount.email,
            mainHeader:"Notice of Acceptance",
            message:"Thank you for signing up for our service. We are glad to inform you that you can start using our web application and offer your expertise. Visit https://abundance-3f9ab.web.app/login to login now!"
          }
          
          emailjs
            .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, formData, {
              publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            })
            .then(
              () => {
                console.log('SUCCESS!');
              },
              (error) => {
                console.log('FAILED...', error.text);
              },
            );



      // delete pending_approval info, not in use
      await deleteDoc(doc(db, "pending_approval", selectedAccount.id));
      setPopupForm(false);
      alert(`Account ${selectedAccount.email} approved and moved to nutritionists.`);
      fetchAccounts("start");
    } catch (error) {
      console.error("Error approving account:", error);
    }
  };




  const rejectAccount = async (account:PendingAccounts)=>{

    setLoading(true);
  

      try{
     
        const storagePath = `certifications/${account.id}`; 
        const firestorePath = `resumes/${account.id}}`; 
        
        const storageRef = ref(storage, storagePath);
        const firestoreDocRef = doc(db, firestorePath);
        
        // Delete from Storage
        deleteObject(storageRef)
          .then(() => {
            console.log("File deleted from Storage successfully");
        
            // Delete from Firestore
            deleteDoc(firestoreDocRef)
              .then(() => {
                console.log("Document deleted from Firestore successfully");
              })
              .catch((error) => {
                console.error("Error deleting document from Firestore:", error);
              });
          })
          .catch((error) => {
            console.error("Error deleting file from Storage:", error);
          });



        const deleted = await deleteAccountAuth(account,"pending_approval");
        if (deleted)
        {
          
          // send email for verification
          const formData = {
            subject:"Abundance (notice of rejection)",
            name:account.name,
            toEmail:account.email,
            mainHeader:"Notice of rejection",
            message:"Thank you for signing up for our service. However, we are sorry to inform you that your account application has been rejected for safety purposes. Still, We would like to thank you for your interest in joining us as a nutritionist. Please note that for data safety, your account and data that we accquired in the registration process will therefore be removed."
          }
          
          emailjs
            .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, formData, {
              publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            })
            .then(
              () => {
                console.log('SUCCESS!');
              },
              (error) => {
                console.log('FAILED...', error.text);
              },
            );
          alert("Account Rejected and email of notice sent.")
          
          fetchAccounts("start");

        }





      }
      catch(err)
      {
        alert(err);
      }

    setLoading(false);
  }



  const dropDownOptions = (account: PendingAccounts) => [
    {
      actionName: "Approve",
      action: () => {
        setSelectedAccount(account);
        setPopupForm(true);
      },
    },
    {
      actionName: "Reject",
      action: () => {
        rejectAccount(account);
      }
      
    },
  ];

  return (
    <>
      {loading ? (
        <div className="flex h-screen w-screen justify-center items-center">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        <div className="flex flex-col p-10 gap-7">
          <h1 className="font-medium text-lg text-[#656363]">Account Management - Pending Accounts</h1>

          <div className="w-[80vw] h-auto border-2 p-8 rounded-xl">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-4xl">Pending Accounts</h2>
                <h3>Review and manage pending user accounts</h3>
              </div>

              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by ID"
                  className="input w-full max-w-xs"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5.5 0 1 1-7 0 3.5.5 0 0 1 7 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </label>
            </div>

            <Table className="my-10">
              <TableHeader>
                <TableRow>
                  {headers.map((head) => (
                    <TableHead key={head}>{head}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts?.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.id}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.name}</TableCell>

                    <TableCell>
                      <button
                        onClick={() => openPDF(account.certificationURL)}
                        className="text-blue-500 underline"
                      >
                        View Certification
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => openPDF(account.resumeURL)}
                        className="text-blue-500 underline"
                      >
                        View Resume
                      </button>
                    </TableCell>
                    <TableCell>
                      <CustomizedDropdown
                        subjectData={account}
                        dropDowns={dropDownOptions(account)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-white">
                <TableRow>
                  <TableCell colSpan={headers.length} className="pt-8">
                    Showing 1 - {pendingAccounts?.length} Accounts
                  </TableCell>
                  <TableCell className="text-right pt-8">
                    <div>
                      <button
                        onClick={() => fetchAccounts("prev")}
                        className="mx-6"
                        disabled={!firstVisible}
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => fetchAccounts("next")}
                        disabled={!lastVisible}
                      >
                        Next
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      )}

      <AlertDialog onOpenChange={setPopupForm} open={popupForm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Please select the account due date below:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-[240px] justify-start text-left font-normal ${!accountDueDate ? "text-muted-foreground" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {accountDueDate ? accountDueDate.toString(): "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">

               {/*show date selector*/}
 
                    <div className="flex gap-x-4">
                    <Calendar aria-label="Date (Controlled)" 
                    value={accountDueDate}
                    onChange={setAccountDueDate}
                    />
                  </div>


              </PopoverContent>
            </Popover>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
