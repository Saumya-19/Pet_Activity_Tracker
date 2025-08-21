import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me about your pet's activities 🐶🐾" },
  ]);
  const [input, setInput] = useState("");

  const fetchActivitiesForCurrentPet = async () => {
    try {
      const currentPet = JSON.parse(localStorage.getItem("currentPet") || "{}");
      const petId = currentPet.name || "default";

      const res = await fetch(
        `http://localhost:5000/api/activities/${encodeURIComponent(petId)}`
      );

      const contentType = res.headers.get("content-type") || "";
      const raw = await res.text();

      if (!res.ok) {
        console.error("Fetch failed:", res.status, raw);
        return [];
      }
      if (contentType.includes("application/json")) {
        return JSON.parse(raw);
      } else {
        console.error("Non-JSON response from server:", raw.slice(0, 200));
        return [];
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      return [];
    }
  };

  const getTodayISO = () => new Date().toISOString().split("T")[0];

  const getBotReply = async (question) => {
    const q = (question || "").toLowerCase();
    const activities = await fetchActivitiesForCurrentPet();

    
    const today = getTodayISO();

    const isToday = (d) => {
      
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d === today;
   
      const parsed = new Date(d);
      if (isNaN(parsed.getTime())) return false;
      return parsed.toISOString().split("T")[0] === today;
    };

    if (q.includes("walk")) {
      const walks = activities.filter(
        (a) => (a.type || "").toLowerCase() === "walk" && isToday(a.date)
      );
      if (walks.length === 0) return "No walks logged today 🐾";
      const total = walks.reduce((s, a) => s + (a.duration || 0), 0);
      return `You logged ${walks.length} walk(s) today, total ${total} minutes 🚶‍♂️`;
    }

    if (q.includes("feed") || q.includes("food")) {
      const feeds = activities.filter(
        (a) => (a.type || "").toLowerCase() === "feeding" && isToday(a.date)
      );
      if (feeds.length === 0) return "No feeding logged today 🍖";
      const total = feeds.reduce((s, a) => s + (a.duration || 0), 0);
      return `You fed your pet ${feeds.length} time(s) today (${total} min total) 🍽️`;
    }

    return "I can tell you about today's walks and feeding. Try: “How many walks today?” 🐕";
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");

    const reply = await getBotReply(text);
    setMessages((m) => [...m, { from: "bot", text: reply }]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-2xl font-bold mb-4 text-purple-700">Chatbot 🤖</h3>

      <div className="h-64 overflow-y-auto border p-3 rounded mb-4 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 p-2 rounded-lg ${
              m.from === "bot"
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-200 text-gray-800 text-right"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about walks or feeding..."
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
