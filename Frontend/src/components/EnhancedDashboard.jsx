import { useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import { 
  Activity, 
  BarChart3, 
  Home, 
  PieChart, 
  Calendar,
  Award,
  Clock,
  TrendingUp
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function EnhancedDashboard() {
  const [activities, setActivities] = useState([]);
  const [petName, setPetName] = useState("");

  useEffect(() => {
    const currentPet = JSON.parse(localStorage.getItem("currentPet")) || {};
    const petId = currentPet.name || "default";
    setPetName(currentPet.name || "Your Pet");

    const loadActivities = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/activities/${petId}`);
        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    };

    loadActivities();
    const refreshHandler = () => loadActivities();
    window.addEventListener("activitiesUpdated", refreshHandler);

    return () => window.removeEventListener("activitiesUpdated", refreshHandler);
  }, []);

  // Process activities
  const processActivityData = () => {
    const activityCount = {};
    const dailyTotals = {};
    let totalDuration = 0;
    let durationActivities = 0;

    activities.forEach((activity) => {
      const type = activity.type;
      
      // Count occurrences for all activity types (for doughnut chart)
      activityCount[type] = (activityCount[type] || 0) + 1;

      // Handle numeric values for specific activity types
      if (["walk", "exercise", "play"].includes(type) && activity.duration) {
        const durationValue = parseFloat(activity.duration) || 0;
        totalDuration += durationValue;
        durationActivities++;
        
        // Add to daily totals for bar chart
        const date = new Date(activity.date).toLocaleDateString();
        dailyTotals[date] = (dailyTotals[date] || 0) + durationValue;
      }
      else if (type === "feeding" && activity.amount) {
        const amountValue = parseFloat(activity.amount) || 0;
        
        // Add to daily totals for bar chart
        const date = new Date(activity.date).toLocaleDateString();
        dailyTotals[date] = (dailyTotals[date] || 0) + amountValue;
      }
    });

    return { activityCount, dailyTotals, totalDuration, durationActivities };
  };

  const { activityCount, dailyTotals, totalDuration, durationActivities } =
    processActivityData();

  const doughnutData = {
    labels: Object.keys(activityCount).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
    datasets: [
      {
        data: Object.values(activityCount),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", 
          "#9966FF", "#FF9F40", "#8ac6d1", "#ff6b6b"
        ],
        hoverBackgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", 
          "#9966FF", "#FF9F40", "#8ac6d1", "#ff6b6b"
        ],
        borderWidth: 2,
        borderColor: "#fff"
      }
    ]
  };

  const barData = {
    labels: Object.keys(dailyTotals).slice(-7),
    datasets: [
      {
        label: 'Activity Value per Day',
        data: Object.values(dailyTotals).slice(-7),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: 'bottom',
        labels: {
          padding: 20
        }
      } 
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { 
      y: { 
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Value'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  // Helper function to get display value for activities
  const getDisplayValue = (activity) => {
    if (activity.duration) return `${activity.duration} min`;
    if (activity.amount) return `${activity.amount} g/cups`;
    if (activity.notes) return activity.notes;
    if (activity.status) return activity.status;
    return "—";
  };

  // Helper function to format date safely
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Stats
  const totalActivities = activities.length;
  const averageDuration =
    durationActivities > 0 ? Math.round(totalDuration / durationActivities) : 0;
  const mostCommonActivity =
    Object.keys(activityCount).length > 0
      ? Object.keys(activityCount).reduce((a, b) =>
          activityCount[a] > activityCount[b] ? a : b
        )
      : "None";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              {petName}'s Activity Dashboard
            </h1>
            <p className="text-purple-600">Track and analyze your pet's activities</p>
          </div>
          <Link 
            to="/home" 
            className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition text-white"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="text-purple-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{totalActivities}</div>
              <div className="text-gray-600">Total Activities</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalDuration} min</div>
              <div className="text-gray-600">Total Exercise</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{averageDuration} min</div>
              <div className="text-gray-600">Avg Duration</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Award className="text-orange-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 capitalize">{mostCommonActivity}</div>
              <div className="text-gray-600">Most Common</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-purple-700">Activity Distribution</h3>
            {Object.keys(activityCount).length > 0 ? (
              <div className="h-64">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            ) : (
              <p className="text-center text-gray-500">No data available for chart</p>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-purple-700">Daily Activity Trends</h3>
            {Object.keys(dailyTotals).length > 0 ? (
              <div className="h-64">
                <Bar data={barData} options={barOptions} />
              </div>
            ) : (
              <p className="text-center text-gray-500">No data available for chart</p>
            )}
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4 text-purple-700">
            <Calendar size={20} />
            <h3 className="text-lg font-semibold">Recent Activities</h3>
          </div>
          {activities.length === 0 ? (
            <p className="text-center text-gray-500">No activities recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.slice().reverse().map((act, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(act.date)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">{act.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {getDisplayValue(act)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}