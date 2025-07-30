const express = require("express");
const router = express.Router();
const { getHome, getAbout } = require("../controllers/home.controller");

// Home routes
router.route("/").get(getHome);
router.route("/about").get(getAbout);

module.exports = router;