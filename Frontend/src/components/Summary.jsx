import { useState, useEffect } from "react";

export default function Summary() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const currentPet = JSON.parse(localStorage.getItem("currentPet")) || {};
        const petId = currentPet.name || "default";

        const res = await fetch(`http://localhost:5000/api/activities/${petId}`);
        if (!res.ok) throw new Error("Failed to fetch activities");

        const data = await res.json();
        setActivities(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivities();

    // Re-fetch whenever activities are updated
    window.addEventListener("activitiesUpdated", fetchActivities);
    return () => window.removeEventListener("activitiesUpdated", fetchActivities);
  }, []);

  // Helper function to decide what to display
  const getValue = (act) => {
    if (act.type === "feeding" && act.amount) return `${act.amount}`;
    if (["walk", "exercise", "play"].includes(act.type) && act.duration)
      return `${act.duration} min`;
    if (act.type === "medication") return "💊 Given";
    if (act.type === "vet visit") return "🏥 Done";
    if (act.notes) return act.notes;
    return "—";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-purple-600">Summary 📊</h3>
      {activities.length === 0 ? (
        <p className="text-gray-500">No activities yet.</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((act, i) => (
            <li
              key={i}
              className="flex justify-between p-2 bg-purple-50 rounded-md"
            >
              <span className="capitalize font-medium">{act.type}</span>
              <span className="text-gray-700">{getValue(act)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

