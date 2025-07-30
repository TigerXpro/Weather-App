const axios = require("axios");

const { postForecast, getForecast, getWeatherAPI } = {
    // POST /forecast
    postForecast: async (req, res) => {
        const { location } = req.body;
        
        if (!location || location.trim() === "") {
            return res.render("forecast", { 
                error: "Please enter a valid location",
                location: "",
                currentWeather: null,
                hourlyData: null,
                coordinates: null,
                timestamp: null
            });
        }

        try {
            const { data: geocodeData } = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params: {
                    q: location,
                    key: process.env.OPENCAGE_API_KEY || 'eaa6f2d566de48b7b8df678844f4f8f3',
                    limit: 1
                }
            });

            const { results } = geocodeData;
            
            if (results.length === 0) {
                return res.render("forecast", { 
                    error: "Location not found. Please try a different search.",
                    location: location,
                    currentWeather: null,
                    hourlyData: null,
                    coordinates: null,
                    timestamp: null
                });
            }

            const [firstResult] = results;
            const { geometry: { lat, lng }, formatted: locationName } = firstResult;

            const { data: weatherData } = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
                params: {
                    latitude: lat,
                    longitude: lng,
                    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
                    current_weather: true,
                    timezone: 'auto'
                }
            });

            const { current_weather: currentWeather, hourly: hourlyData } = weatherData;
            
            res.render("forecast", {
                error: null, // ← ADD THIS
                location: locationName,
                coordinates: { lat, lng },
                currentWeather,
                hourlyData,
                query: location,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            res.render("forecast", { 
                error: "Failed to fetch weather data. Please try again later.",
                location: location || "",
                currentWeather: null,
                hourlyData: null,
                coordinates: null,
                timestamp: null
            });
        }
    },

    getForecast: (req, res) => {
        res.redirect("/");
    },

    getWeatherAPI: async (req, res) => {
        // ... keep this the same
        const { location } = req.params;
        
        try {
            const { data: geocodeData } = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params: {
                    q: location,
                    key: process.env.OPENCAGE_API_KEY || 'eaa6f2d566de48b7b8df678844f4f8f3',
                    limit: 1
                }
            });

            const { results } = geocodeData;
            
            if (results.length === 0) {
                return res.status(404).json({ error: "Location not found" });
            }

            const [firstResult] = results;
            const { geometry: { lat, lng }, formatted: locationName } = firstResult;

            const { data: weatherResponse } = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
                params: {
                    latitude: lat,
                    longitude: lng,
                    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
                    current_weather: true,
                    timezone: 'auto'
                }
            });

            res.json({
                location: locationName,
                coordinates: { lat, lng },
                weather: weatherResponse
            });

        } catch (error) {
            console.error('API Error:', error.message);
            res.status(500).json({ error: "Failed to fetch weather data" });
        }
    }
};

module.exports = { postForecast, getForecast, getWeatherAPI };