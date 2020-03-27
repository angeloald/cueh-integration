const express = require("express");
const router = express.Router();

const { getHome, deleteTask, updateEstimate } = require("../controllers");

router.get("/", getHome);
router.post("/deleteTask", deleteTask);
router.post("/updateEstimate", updateEstimate);

module.exports = router;
