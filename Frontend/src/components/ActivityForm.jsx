import { useState } from "react";

export default function ActivityForm() {
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activity || !duration) {
      alert("Please fill all fields");
      return;
    }

    const currentPet = JSON.parse(localStorage.getItem("currentPet")) || {};
    const petId = currentPet.name || "default";
    const formattedActivity = activity.trim().toLowerCase();

    const newEntry = {
      type: formattedActivity,
      duration, // ✅ always send duration (string or number)
      date: new Date().toISOString(),
      petId,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/activities/${petId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) {
        throw new Error("Failed to save activity");
      }

      const data = await res.json();
      console.log("✅ Saved:", data);

      // Reset form
      setActivity("");
      setDuration("");

      // Notify dashboard to refresh
      window.dispatchEvent(new Event("activitiesUpdated"));
    } catch (error) {
      console.error(error);
      alert("Error saving activity");
    }
  };

  const getLabel = () => {
    switch (activity.toLowerCase()) {
      case "walk":
      case "play":
      case "exercise":
        return "Duration (minutes)";
      case "feeding":
        return "Amount (grams/cups)";
      case "medication":
      case "vet visit":
        return "Notes";
      default:
        return "Details";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-2xl font-bold mb-6 text-purple-700 text-center">
        Add Activity 🐾
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity type */}
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Activity</option>
          <option value="walk">Walk</option>
          <option value="feeding">Feeding</option>
          <option value="play">Play</option>
          <option value="exercise">Exercise</option>
          <option value="medication">Medication</option>
          <option value="vet visit">Vet Visit</option>
        </select>

        {activity && (
          <input
            type={
              ["walk", "play", "exercise"].includes(activity.toLowerCase())
                ? "number"
                : "text"
            }
            placeholder={getLabel()}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        )}

        <button
          type="submit"
          className="w-full py-3 text-black text-lg font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
          style={{ backgroundColor: "#ba8de4" }}
        >
          Save
        </button>
      </form>
    </div>
  );
}

