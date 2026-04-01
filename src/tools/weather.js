const axios = require('axios');

/**
 * Fetch weather data from wttr.in
 * @param {string} location The name of the city/location
 * @returns {Promise<object>} Weather data in JSON format
 */
async function getWeather(location) {
    console.log(`[Tool] Fetching weather for: ${location}`);
    try {
        const response = await axios.get(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
        const data = response.data;
        
        // Return a simplified version for the model to digest
        if (!data.current_condition || data.current_condition.length === 0) {
            return { error: "No weather data found for this location." };
        }
        
        const current = data.current_condition[0];
        const nearestArea = data.nearest_area[0];
        
        return {
            location: `${nearestArea.areaName[0].value}, ${nearestArea.country[0].value}`,
            temperature_c: current.temp_C,
            condition: current.weatherDesc[0].value,
            humidity: current.humidity,
            wind_speed: current.windspeedKmph
        };
    } catch (error) {
        console.error(`[Tool] Error fetching weather: ${error.message}`);
        return { error: "Failed to fetch weather data." };
    }
}

// Gemini Tool Declaration
const getWeatherDeclaration = {
    name: "getWeather",
    description: "Get current weather information for a given city or location.",
    parameters: {
        type: "OBJECT",
        properties: {
            location: {
                type: "STRING",
                description: "The city or location name (e.g., 'Taipei', 'Tokyo', 'New York')."
            }
        },
        required: ["location"]
    }
};

module.exports = {
    getWeather,
    getWeatherDeclaration
};
