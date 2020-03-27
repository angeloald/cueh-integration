const express = require("express");
const router = express.Router();

const { getHome, deleteTask } = require("../controllers");

router.get("/", getHome);
router.post("/deleteTask", deleteTask);

module.exports = router;
