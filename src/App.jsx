import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError("");
      setWeather(null);
      
      // Using Open-Meteo API (free, no key needed)
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1`
      );
      
      if (!geoResponse.data.results?.[0]) {
        setError("City not found 😢");
        return;
      }
      
      const location = geoResponse.data.results[0];
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
      );
      
      const current = weatherResponse.data.current;
      const weatherCodes = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Foggy", 48: "Foggy", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
        61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow", 
        75: "Heavy snow", 80: "Light showers", 81: "Showers", 82: "Heavy showers", 
        95: "Thunderstorm"
      };
      
      setWeather({
        name: location.name,
        sys: { country: location.country || "" },
        main: {
          temp: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m
        },
        weather: [{
          description: weatherCodes[current.weather_code] || "Unknown"
        }],
        wind: {
          speed: current.wind_speed_10m
        }
      });
    } catch (err) {
      console.error("Error:", err);
      setError("City not found 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>🌤 React Weather App</h1>

      <form onSubmit={getWeather} className="search-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <div className="cloud-container">
            <div className="cloud front">
              <span className="left-front"></span>
              <span className="right-front"></span>
            </div>
            <span className="sun sunshine"></span>
            <span className="sun"></span>
            <div className="cloud back">
              <span className="left-back"></span>
              <span className="right-back"></span>
            </div>
          </div>
          
          <div className="card-header">
            <span>{weather.name}, {weather.sys.country}</span>
            <span>{weather.weather[0].description}</span>
          </div>
          
          <div className="weather-details">
            <span>💧 {weather.main.humidity}%</span>
            <span>💨 {weather.wind.speed} m/s</span>
          </div>
          
          <span className="temp">{weather.main.temp}°</span>
          
          <div className="temp-scale">
            <span>Celsius</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
