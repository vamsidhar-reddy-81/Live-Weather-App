const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");
const message = document.getElementById("message");

let currentCity = "Hyderabad";

// Convert weather codes into descriptions and icons
function getWeatherInfo(code) {

    if (code === 0) {
        return { text: "Clear sky", icon: "☀️" };
    }

    if (code === 1 || code === 2) {
        return { text: "Partly cloudy", icon: "🌤️" };
    }

    if (code === 3) {
        return { text: "Overcast", icon: "☁️" };
    }

    if (code === 45 || code === 48) {
        return { text: "Foggy", icon: "🌫️" };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return { text: "Drizzle", icon: "🌦️" };
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return { text: "Rainy", icon: "🌧️" };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return { text: "Snowy", icon: "❄️" };
    }

    if ([95, 96, 99].includes(code)) {
        return { text: "Thunderstorm", icon: "⛈️" };
    }

    return { text: "Unknown conditions", icon: "🌍" };
}


// Fetch city coordinates and then weather data
async function getWeather(city) {

    if (!city.trim()) {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Loading weather...";
    searchBtn.disabled = true;

    try {

        // Step 1: Find the city
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try another name.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Fetch current weather
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        const info = getWeatherInfo(current.weather_code);

        // Step 3: Display the weather
        currentCity = location.name;

        cityName.textContent = location.admin1
            ? `${location.name}, ${location.admin1}`
            : `${location.name}, ${location.country}`;

        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        description.textContent = info.text;

        weatherIcon.textContent = info.icon;

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        message.textContent = "";

    } catch (error) {

        message.textContent = error.message;

    } finally {

        searchBtn.disabled = false;

    }
}


// Search button
searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value);
});


// Search by pressing Enter
cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        getWeather(cityInput.value);
    }

});


// Refresh current city's weather
refreshBtn.addEventListener("click", () => {
    getWeather(currentCity);
});


// Load default city when the page opens
getWeather(currentCity);