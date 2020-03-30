const express = require("express");
const router = express.Router();

const {
  getHome,
  deleteTask,
  updateEstimate,
  updateDueDate,
  updateAssignees,
  createTask
} = require("../controllers");

router.get("/", getHome);
router.post("/deleteTask", deleteTask);
router.post("/updateEstimate", updateEstimate);
router.post("/updateDueDate", updateDueDate);
router.post("/updateAssignees", updateAssignees);
router.post("/createTask", createTask);

module.exports = router;
