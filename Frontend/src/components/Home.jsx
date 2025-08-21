import { useEffect, useState } from "react";
import ActivityForm from "./ActivityForm";
import Summary from "./Summary";
import Chatbot from "./Chatbot";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

export default function Home() {
  const [petName, setPetName] = useState("");

  useEffect(() => {
    const savedPetName = localStorage.getItem("petName");
    if (savedPetName) {
      setPetName(savedPetName);
    }
  }, []);
  
  useEffect(() => {
  const handleStorageChange = () => {
    const savedPetName = localStorage.getItem("petName");
    if (savedPetName) {
      setPetName(savedPetName);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);

  return (
    <div className="p-6 min-h-screen  bg-gradient-to-br from-pink-100 via-white to-blue-100">
      <h2 className="text-3xl font-bold mb-6">
        Hii {petName ? petName : "Friend"} 👋
      </h2>
      
      {/* Activity Form */}
      <div className="mb-8">
        <ActivityForm />
      </div>

      <Link 
  to="/dashboard" 
  className="inline-flex items-center gap-2 bg-purple-600  px-4 py-2 rounded-lg hover:bg-purple-700 transition mb-6"
   style={{ color: "white" }}
>
  <BarChart3 size={18} />
  View Activity Dashboard
</Link>

      {/* Summary Section */}
      <div className="mb-8">
        <Summary />
      </div>

      {/* Chatbot Section */}
      <div className="mb-8">
        <Chatbot />
      </div>
    </div>
  );
}
