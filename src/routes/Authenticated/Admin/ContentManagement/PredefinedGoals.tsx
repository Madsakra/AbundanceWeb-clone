import { db } from "@/firebase-config";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

type Goal = { 
  id: string; 
  goal_name: string; 
  value: number; 
  unit_scale: string;
};


export default function PredefinedGoals() {
  const [showDialog, setShowDialog] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [formData, setFormData] = useState({ goal_name: "", value: "", unit_scale: "" });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showRemoveSuccessDialog, setShowRemoveSuccessDialog] = useState(false);
  const [goalToRemove, setGoalToRemove] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrEditGoal = async () => {
    if (!formData.goal_name || !formData.value || !formData.unit_scale || parseFloat(formData.value) < 0) return alert("Please fill in all fields and value cannot be negative.");
    try {
      const data = { goal_name: formData.goal_name, value: parseFloat(formData.value), unit_scale: formData.unit_scale };
      if (editingGoalId) await updateDoc(doc(db, "goals", editingGoalId), data);
      else await addDoc(collection(db, "goals"), data);
      setSuccessMessage(editingGoalId ? "Goal Edited Successfully!" : "Goal Added Successfully!");
      setShowSuccessDialog(true);
      setShowDialog(false);
      setFormData({ goal_name: "", value: "", unit_scale: "" });
      setEditingGoalId(null);
      fetchGoals();
    } catch (error) { console.error(error); alert("Failed to process request."); }
  };

  const handleRemoveGoal = async () => {
    if (goalToRemove) {
      try {
        await deleteDoc(doc(db, "goals", goalToRemove));
        setSuccessMessage("Goal Removed Successfully");
        setShowRemoveSuccessDialog(true);
        fetchGoals();
      }
      catch (error) { console.error(error); alert("Failed to remove goal."); }
    }
  };

  const fetchGoals = async () => {
    try {
      const snapshot = await getDocs(collection(db, "goals"));
      const goalsData = snapshot.docs.map(doc => ({ id: doc.id, goal_name: doc.data().goal_name, value: doc.data().value, unit_scale: doc.data().unit_scale }));
      setGoals(goalsData);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchGoals(); }, []);

  const filteredGoals = goals.filter(goal => goal.goal_name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col p-10 gap-7">
      <h1 className="font-medium text-lg text-[#656363]">Content Management - Predefine Goals</h1>
      <button className="p-2 bg-[#00ACAC] text-white rounded w-[100px] ml-auto mr-[10px]" onClick={() => { setEditingGoalId(null); setFormData({ goal_name: "", value: "", unit_scale: "" }); setShowDialog(true); }}>Add Goal</button>

      <div className="w-[80vw] h-auto border-2 p-8 rounded-xl">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl">Predefined Goals</h2>
            <h3>Manage predefined goals</h3>
          </div>
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" placeholder="Search by goal name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input w-full max-w-xs" />
            <button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg></button>
          </label>
        </div>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-300 p-2 text-left">Goal Name</th>
              <th className="border-b border-gray-300 p-2 text-left">Value</th>
              <th className="border-b border-gray-300 p-2 text-left">Unit Scale</th>
              <th className="border-b border-gray-300 p-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredGoals.map(goal => (
              <tr key={goal.id}>
                <td className="border-b border-gray-300 p-4">{goal.goal_name}</td>
                <td className="border-b border-gray-300 p-4">{goal.value}</td>
                <td className="border-b border-gray-300 p-4">{goal.unit_scale}</td>
                <td className="border-b border-gray-300 p-4 font-bold relative">
                  <button onClick={() => setShowActions(showActions === goal.id ? null : goal.id)}>. . .</button>
                  {showActions === goal.id && (
                    <div className="absolute right-20 bg-white border shadow-lg p-2 rounded w-[200px]">
                      <button className="block w-full text-left p-2 mb-[10px] border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
                        onClick={() => { setEditingGoalId(goal.id); setFormData({ goal_name: goal.goal_name, value: goal.value.toString(), unit_scale: goal.unit_scale }); setShowDialog(true); setShowActions(null); }}>Edit Goal</button>
                      <button className="block w-full text-left p-2 border border-red-500 text-red-500 rounded hover:bg-red-100"
                        onClick={() => { setGoalToRemove(goal.id); setShowRemoveDialog(true); setShowActions(null); }}>Remove Goal</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DIALOGS */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-100">
            <h2 className="text-xl font-bold mb-4 text-[#00ACAC]">Predefined Goal</h2>
            <div className="mb-4 p-1">
              <label className="block text-sm font-bold mb-1">Goal Name</label>
              <input type="text" name="goal_name" value={formData.goal_name} onChange={handleInputChange} className="w-full p-2 border rounded text-gray-500" placeholder="Enter goal name" />
            </div>
            <div className="mb-4 p-1 flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-bold mb-1">Value</label>
                <input type="number" name="value" value={formData.value} onChange={handleInputChange} className="w-full p-2 border rounded text-gray-500" placeholder="Enter goal value" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold mb-1">Unit Scale</label>
                <select name="unit_scale" value={formData.unit_scale} onChange={handleInputChange} className="w-full p-2 border rounded text-gray-500">
                  <option value="">-</option>
                  <option value="kg/m^2">kg/m^2</option>
                  <option value="kcal">kcal</option>
                  <option value="mmo/L">mmo/L</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <button className="p-2 bg-gray-500 text-white rounded w-1/2" onClick={() => setShowDialog(false)}>Close</button>
              <button className="p-2 bg-[#00ACAC] text-white rounded w-1/2" onClick={handleAddOrEditGoal}>
                {editingGoalId ? "Save Edit" : "Add Goal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRemoveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-100">
            <h2 className="text-xl font-bold mb-4 text-red-600">Remove Goal?</h2>
            <p className="mb-4 text-red-600">Warning: Removal is irreversible. Remove Goal?</p>
            <div className="flex justify-center gap-3">
              <button className="p-2 bg-gray-400 text-white rounded w-1/2" onClick={() => setShowRemoveDialog(false)}>Close</button>
              <button className="p-2 bg-red-600 text-white rounded w-1/2" onClick={() => { handleRemoveGoal(); setShowRemoveDialog(false); }}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {showRemoveSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-100">
            <p className="text-xl font-bold mb-8 text-red-600 mt-8">Goal Removed Successfully.</p>
            <div className="flex justify-center gap-3 mb-8">
              <button className="p-2 bg-red-600 text-white font-bold rounded w-[200px]" onClick={() => setShowRemoveSuccessDialog(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-100">
            <h2 className="text-xl font-bold mb-4 text-[#00ACAC]">Success</h2>
            <p className="mb-4 text-[#00ACAC]">{successMessage}</p>
            <div className="flex justify-center gap-3">
              <button className="p-2 bg-[#00ACAC] text-white rounded w-full" onClick={() => setShowSuccessDialog(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
