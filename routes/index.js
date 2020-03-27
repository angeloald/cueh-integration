const express = require("express");
const router = express.Router();

const { getHome } = require("../controllers");

router.get("/", getHome);

module.exports = router;
