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
      
      // Using weatherapi.com (free, no key needed for basic)
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=demo&q=${encodeURIComponent(city.trim())}&aqi=no`
      );
      
      const data = response.data;
      
      setWeather({
        name: data.location.name,
        sys: { country: data.location.country },
        main: {
          temp: Math.round(data.current.temp_c),
          humidity: data.current.humidity
        },
        weather: [{
          description: data.current.condition.text
        }],
        wind: {
          speed: (data.current.wind_kph / 3.6).toFixed(1)
        }
      });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      
      // Try alternative free API
      try {
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
          0: "Clear", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
          45: "Foggy", 51: "Drizzle", 61: "Rain", 71: "Snow", 95: "Thunderstorm"
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
      } catch (err2) {
        console.error("Backup API Error:", err2);
        setError("City not found 😢");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🌤 React Weather App</h1>

      <form onSubmit={getWeather}>
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
        <div className="card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <h3>{weather.main.temp}°C</h3>
          <p>{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;