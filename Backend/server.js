const express = require("express");
const cors = require("cors");
const activityRoute = require("./routes/activityRoute");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/activities", activityRoute);


app.get("/", (req, res) => res.send("API is running..."));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(5000, () => console.log(" Backend running on http://localhost:5000"));
