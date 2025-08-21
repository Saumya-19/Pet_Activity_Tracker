const activities = {};

// GET /api/activities/:petId
const getActivities = (req, res) => {
  const { petId } = req.params;
  res.json(activities[petId] || []);
};

// POST /api/activities/:petId
const addActivity = (req, res) => {
  const { petId } = req.params;
  const { type, duration, amount, status, notes } = req.body;

  if (!type) {
    return res.status(400).json({ error: "Activity type is required" });
  }

  // Ensure array exists
  if (!activities[petId]) activities[petId] = [];

  const newEntry = {
    type: String(type).toLowerCase(),
    date: new Date().toISOString().split("T")[0],
  };

  // Accept whichever field is relevant
  if (duration) newEntry.duration = parseInt(duration);
  if (amount) newEntry.amount = parseInt(amount);
  if (status) newEntry.status = status;
  if (notes) newEntry.notes = notes;

  activities[petId].push(newEntry);
  res.status(201).json(newEntry);
};

module.exports = { getActivities, addActivity };

