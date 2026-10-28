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

// Paste your Weatherstack API key here
const API_KEY = "531ab8f93ac3e9826d5985c18c633da7";

let currentCity = "Hyderabad";

// Fetch weather information
async function getWeather(city) {

    if (!city.trim()) {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Loading weather...";
    searchBtn.disabled = true;

    try {

        const url =
            `https://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(city)}&units=m`;

        const response = await fetch(url);

        const data = await response.json();

        // Check API errors
        if (data.error) {
            throw new Error(data.error.info);
        }

        // Get weather details
        const current = data.current;
        const location = data.location;

        currentCity = location.name;

        // Display city
        cityName.textContent =
            `${location.name}, ${location.country}`;

        // Display temperature in Celsius
        temperature.textContent =
            `${current.temperature}°C`;

        // Display weather description
        description.textContent =
            current.weather_descriptions[0];

        // Display weather icon
        weatherIcon.innerHTML = "";

        const icon = document.createElement("img");

        icon.src = current.weather_icons[0];
        icon.alt = current.weather_descriptions[0];
        icon.style.width = "80px";
        icon.style.height = "80px";

        weatherIcon.appendChild(icon);

        // Display humidity
        humidity.textContent =
            `${current.humidity}%`;

        // Display wind speed
        windSpeed.textContent =
            `${current.wind_speed} km/h`;

        message.textContent = "";

    } catch (error) {

        message.textContent =
            `Unable to get weather: ${error.message}`;

    } finally {

        searchBtn.disabled = false;

    }
}

// Search button
searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value);
});

// Search when Enter is pressed
cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        getWeather(cityInput.value);
    }

});

// Refresh weather
refreshBtn.addEventListener("click", () => {
    getWeather(currentCity);
});

// Load default city
getWeather(currentCity);

