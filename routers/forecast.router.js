const express = require("express");
const router = express.Router();
const { postForecast, getForecast, getWeatherAPI } = require("../controllers/forecast.controller");

// Main forecast route - handles both GET and POST
router.route("/")
    .get(getForecast)
    .post(postForecast);

// API endpoint for programmatic access
router.route("/api/:location")
    .get(getWeatherAPI);

module.exports = router;