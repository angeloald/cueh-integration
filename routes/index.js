const express = require("express");
const router = express.Router();

const {
  getHome,
  deleteTask,
  updateEstimate,
  updateDueDate
} = require("../controllers");

router.get("/", getHome);
router.post("/deleteTask", deleteTask);
router.post("/updateEstimate", updateEstimate);
router.post("/updateDueDate", updateDueDate);

module.exports = router;
