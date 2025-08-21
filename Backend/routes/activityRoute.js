const express = require("express");
const { getActivities, addActivity } = require("../controllers/activityControllers");

const router = express.Router();

router.get("/:petId", getActivities);
router.post("/:petId", addActivity);

module.exports = router;
