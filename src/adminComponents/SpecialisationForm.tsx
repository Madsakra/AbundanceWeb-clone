import  { useState, useEffect } from "react";
import { doc, updateDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase-config";// Adjust the import path
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // Adjust the import path

export interface ProfileSpecialisation {
  id: string;
  name: string;
  variation: string[];
}

type SpecialisationFormProps = {
  collectionName: string;
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
  selectedSpecialisation?: ProfileSpecialisation;
  fetchData: (time: "start") => void;
  naming:string,
};

export default function SpecialisationForm({
  collectionName,
  openForm,
  setOpenForm,
  selectedSpecialisation,
  fetchData,
  naming
}: SpecialisationFormProps) {
  const [name, setName] = useState("");
  const [variations, setVariations] = useState<string[]>([]);
  const [newVariation, setNewVariation] = useState(""); // State for adding new variations

  // deep check
  const normalizeString = (str: string) => str.replace(/\s+/g, "").toLowerCase();

  
  const handleAddVariation = () => {
    const normalizedNewVariation = normalizeString(newVariation);
  
    const isDuplicate = variations.some(
      (variation) => normalizeString(variation) === normalizedNewVariation
    );
  
    if (newVariation.trim() !== "" && !isDuplicate) {
      setVariations([...variations, newVariation.trim()]);
      setNewVariation(""); // Clear the input after adding
    } else {
      alert("This variation already exists!"); // Optional feedback for the user
    }
  };

  const isDuplicateName = async (name: string) => {
    // Convert the first letter to uppercase and the rest to lowercase
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  
    const specialisationsRef = collection(db, collectionName);
    const q = query(specialisationsRef, where("name", "==", formattedName));
    const querySnapshot = await getDocs(q);
  
    return !querySnapshot.empty;
  };

  // Handle form submission
  const handleAddOrEditSpecialisation = async () => {
    // Validation
    if (!name.trim()) {
      alert("Specialisation name cannot be empty.");
      return;
    }
    if (variations.length === 0) {
      alert("Please add at least one variation.");
      return;
    }

    // Check for duplicate name (only for new specialisations)
    if (!selectedSpecialisation) {
      const isDuplicate = await isDuplicateName(name);
      if (isDuplicate) {
        alert("A specialisation with this name already exists.");
        return;
      }
    }

    try {
      if (selectedSpecialisation?.id) {
        // Edit Specialisation
        const docRef = doc(db, collectionName, selectedSpecialisation.id);
        await updateDoc(docRef, {
          name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
          variation: variations,
        });
        alert("Specialisation edited successfully");
      } else {
        // Add Specialisation
        const collectionRef = collection(db, collectionName);
        await addDoc(collectionRef, {
          name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
          variation: variations,
        });
        alert("Specialisation added successfully");
      }

      fetchData("start");
      setOpenForm(false); // Close the form after submission
    } catch (error) {
      console.error("Error adding/updating specialisation: ", error);
      alert("Failed to process request. Please try again.");
    }
  };


  // Populate form with selected specialisation data
  useEffect(() => {
    if (selectedSpecialisation) {
      setName(selectedSpecialisation.name);
      setVariations(selectedSpecialisation.variation);
    } else {
      // Reset form if no specialisation is selected
      setName("");
      setVariations([]);
    }
  }, [selectedSpecialisation]);

  return (
    <AlertDialog onOpenChange={setOpenForm} open={openForm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {selectedSpecialisation ? (
              <h2>Edit {naming}</h2>
            ) : (
              <h1>Add {naming}</h1>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {selectedSpecialisation ? (
              <h2>Edit {naming}</h2>
            ) : (
              <h1>Add New {naming}</h1>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          {/* Specialisation Name Input */}
          <input
            placeholder="Specialisation Name"
            type="text"
            value={name}
            className="input input-bordered w-full"
            onChange={(e) => setName(e.target.value)}
          />

          {/* Existing Variations */}
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Variations:</h3>
            {variations.map((variation, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{variation}</span>
                <button
                  onClick={() =>
                    setVariations(variations.filter((_, i) => i !== index))
                  }
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add New Variation */}
          <div className="flex gap-2">
            <input
              placeholder="Add a new variation"
              type="text"
              value={newVariation}
              className="input input-bordered w-full"
              onChange={(e) => setNewVariation(e.target.value)}
            />
            <button
              onClick={handleAddVariation}
              className="btn btn-primary"
            >
              Add Variation
            </button>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAddOrEditSpecialisation}>
            {selectedSpecialisation ? `Edit ${naming}` : `Add ${naming}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}