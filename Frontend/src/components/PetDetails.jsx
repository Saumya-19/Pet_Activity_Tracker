import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PetActivityTracker() {
  const [pet, setPet] = useState({
    name: "",
    age: "",
    type: "Dog",
    breed: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet({ ...pet, [name]: value });
  };

  const handleSave = () => {
  if (!pet.name || !pet.age) {
    alert("Please fill in required fields (Pet Name & Age).");
    return;
  }

  console.log("✅ Pet Saved:", pet);

  
  const existingPets = JSON.parse(localStorage.getItem("pets")) || [];
  existingPets.push(pet);
  localStorage.setItem("pets", JSON.stringify(existingPets));

  localStorage.setItem("currentPet", JSON.stringify(pet));
  localStorage.setItem("petName", pet.name);

  // Navigate to homepage
  navigate("/home");

  // Reset form
  setPet({ name: "", age: "", type: "Dog", breed: "" });
};

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <PawPrint className="w-10 h-10 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Pet Activity Tracker
          </h1>
        </motion.div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.input
            name="name"
            type="text"
            value={pet.name}
            onChange={handleChange}
            placeholder="Pet Name"
            whileFocus={{ scale: 1.02 }}
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 w-full"
          />

          <motion.input
            name="age"
            type="number"
            value={pet.age}
            onChange={handleChange}
            placeholder="Age"
            whileFocus={{ scale: 1.02 }}
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 w-full"
          />

          <motion.select
            name="type"
            value={pet.type}
            onChange={handleChange}
            whileFocus={{ scale: 1.02 }}
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 w-full"
          >
            <option>Dog</option>
            <option>Cat</option>
            <option>Other</option>
          </motion.select>

          <motion.input
            name="breed"
            type="text"
            value={pet.breed}
            onChange={handleChange}
            placeholder="Breed (optional)"
            whileFocus={{ scale: 1.02 }}
            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 w-full"
          />
        </div>

        {/* Button */}
        <motion.button
          onClick={handleSave}
          whileHover={{
            scale: 1.08,
            boxShadow: "0px 0px 12px rgba(168, 85, 247, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg transition"
        >
          Save Pet
        </motion.button>
      </motion.div>
    </div>
  );
}
