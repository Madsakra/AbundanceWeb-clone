import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArticlesType } from "@/routes/Authenticated/Nutritionist/ViewArticles";
import { db, storage } from "@/firebase-config"; // Ensure Firebase config is imported
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; // Firestore imports
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Firebase storage imports
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { useAuth } from "@/contextProvider";
import { Button } from "@/components/ui/button"

type ArticlesPopupFormProps = {
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
  selectedData?: ArticlesType;
  fetchData:(time:"start")=>void;
  setLoading:(load:boolean)=>void
};

export default function ArticlesPopupForm({
  openForm,
  setOpenForm,
  selectedData,
  fetchData,
  setLoading
}: ArticlesPopupFormProps) {

  const {user,profile} = useAuth();
  const [imagePreview, setImagePreview] = useState<string>(selectedData?.image || "");

  const [formData, setFormData] = useState({
    title: selectedData?.title || "",
    description: selectedData?.description || "",
    image: null as File | string | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

// Handle Image Selection
const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];

    setFormData((prev) => ({
      ...prev,
      image: file, // Store as File
    }));

    setImagePreview(URL.createObjectURL(file)); // Update preview
  }
};

const handleSubmit = async () => {
  if (!formData.title || !formData.description) {
    alert("Please make sure the form is filled");
    return;
  }

  setLoading(true);
  try {
    let imageUrl = selectedData?.image || ""; // Default to existing image if not changed

    if (formData.image && typeof formData.image !== "string") {
      // Delete old image first if a new one is uploaded
      if (selectedData?.image) {
        const existingImageRef = ref(storage, selectedData.image);
        await deleteObject(existingImageRef);
      }

      // Upload new image
      const imageRef = ref(storage, `articles/${uuidv4()}-${formData.image.name}`);
      await uploadBytes(imageRef, formData.image);
      imageUrl = await getDownloadURL(imageRef);
    }

    // Prepare data for Firestore
    const articleData = {
      title: formData.title,
      description: formData.description,
      image: imageUrl,
      writtenBy: {
        name: profile?.title,
        avatar: profile?.avatar,
        email: user?.email,
        uid: user?.uid,
      },
    };

    if (selectedData) {
      await setDoc(doc(db, "articles", user!.uid, "written_articles", selectedData.id), articleData);
    } else {
      await addDoc(collection(db, "articles", user!.uid, "written_articles"), articleData);
    }

    alert("Article saved successfully!");
    setOpenForm(false);
    fetchData("start");
  } catch (error) {
    console.error("Error saving article:", error);
    alert("Failed to save the article.");
  } finally {
    setLoading(false);
  }
};

  return (
    <AlertDialog open={openForm} onOpenChange={setOpenForm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {selectedData ? (
            <AlertDialogTitle>Edit Article</AlertDialogTitle>
          ) : (
            <AlertDialogTitle>Add Article</AlertDialogTitle>
          )}
          <AlertDialogDescription>
            Please fill in the details below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Form Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "1px" }}>
          {/* Image Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label
              htmlFor="imageUpload"
              className="font-bold"
              >
              Upload Image
            </label>
            {imagePreview && (
            <div style={{ textAlign: "center" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100px",
                  borderRadius: "5px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
                </div>
              )}



            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input w-full max-w-xs"
            />

          </div>

          {/* Title Input */}
          <label htmlFor="" className="font-bold mt-5">Title</label>
          <input
            type="text"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
            }}
          />

          {/* Description Input */}
          <label htmlFor="" className="font-bold mt-5">Description</label>
          <textarea
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
              minHeight: "100px",
            }}
          />
        </div>

        <AlertDialogFooter style={{ marginTop: "1rem" }}>
          <AlertDialogCancel onClick={() => setOpenForm(false)}>Cancel</AlertDialogCancel>
          <Button onClick={handleSubmit}>Submit</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
