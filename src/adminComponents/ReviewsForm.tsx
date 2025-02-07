
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
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase-config";
import { ReviewType } from "@/types/adminTypes";
import { IoIosRemoveCircleOutline } from "react-icons/io";


type ReviewsFormProps = {
    collectionName:string,
    openForm:boolean,
    setOpenForm:(open:boolean)=>void,
    selectedReview?:ReviewType,
    fetchData:(time:"start")=>void;
    variation:string,
}


export default function ReviewsForm({collectionName,openForm,setOpenForm,selectedReview,fetchData,variation}:ReviewsFormProps) {
 
  const [reviewName, setReviewName] = useState("");
  const [value, setValue] = useState<number>(0);
  const [reasons, setReasons] = useState<string[]>([]);
  const [newReason, setNewReason] = useState(""); // State for adding new reasons
  
   // Handle adding a new reason
   const handleAddReason = () => {
    if (newReason.trim()==="")
    {
      alert("Please enter a specific reason before adding!")
    }

    if (newReason.trim() !== "") {
      setReasons([...reasons, newReason.trim()]);
      setNewReason(""); // Clear the input after adding
    }
  };

  // Handle form submission
  const handleAddOrEditTier = async () => {
    // Validation
    if (!reviewName.trim()) {
      alert("Review name cannot be empty.");
      return;
    }
    if (value <= 0 || value >5) {
      alert("Score must be greater than 0 and less than or equal 5");
      return;
    }

    

    if (reasons.length === 0) {
      alert("Please add at least one reason.");
      return;
    }

    try {
      if (selectedReview?.id) {
        // Edit Review
        const docRef = doc(db, collectionName, selectedReview.id);
        await updateDoc(docRef, {
          name: reviewName,
          score: value,
          reasons: reasons,
        });
        alert("Review edited successfully");
      } else {
        // Add Review
        const collectionRef = collection(db, collectionName);
        await addDoc(collectionRef, {
          name: reviewName,
          score: value,
          reasons: reasons,
        });
        alert("Review added successfully");
      }

      fetchData("start");
      setOpenForm(false); // Close the form after submission
    } catch (error) {
      console.error("Error adding/updating review: ", error);
      alert("Failed to process request. Please try again.");
    }
  };

  // Populate form with selected review data
      useEffect(() => {
        if (selectedReview) {
          setReviewName(selectedReview.name);
          setValue(selectedReview.score);
          setReasons(selectedReview.reasons);
        } else {
          // Reset form if no review is selected
          setReviewName("");
          setValue(0);
          setReasons([]);
        }
      }, [selectedReview]);
    
 
      return (
<AlertDialog onOpenChange={setOpenForm} open={openForm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {selectedReview ? (
              <h2>Edit Review - {variation}</h2>
            ) : (
              <h1>Add Review - {variation}</h1>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {selectedReview ? (
              <h2>Edit Review for {variation}</h2>
            ) : (
              <h1>Add Review for {variation}</h1>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          {/* Review Name Input */}
          <input
            placeholder="Review Name"
            type="text"
            value={reviewName}
            className="input input-bordered w-full"
            onChange={(e) => setReviewName(e.target.value)}
          />

          {/* Score Input */}
          <input
            placeholder="Score"
            type="number"
            value={value}
            className="input input-bordered w-full"
            onChange={(e) => setValue(Number(e.target.value))}
          />

          {/* Existing Reasons */}
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Reasons:</h3>
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{reason}</span>
                <button
                  onClick={() =>
                    setReasons(reasons.filter((_, i) => i !== index))
                  }
                  className="text-red-500"
                >
                 <IoIosRemoveCircleOutline color="red" size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Reason */}
          <div className="flex gap-2">
            <input
              placeholder="Add a new reason"
              type="text"
              value={newReason}
              className="input input-bordered w-full"
              onChange={(e) => setNewReason(e.target.value)}
            />
            <button
              onClick={handleAddReason}
              className="btn btn-primary"
            >
              Add Reason
            </button>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddOrEditTier}>
            {selectedReview ? "Edit Review" : "Add Review"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      )
}
