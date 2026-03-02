# Weather App Setup Guide

## API Key Setup Karein (Zaroori!)

1. **OpenWeatherMap Account Banao:**
   - https://openweathermap.org/api par jao
   - "Sign Up" par click karke free account banao
   - Email verify karo

2. **API Key Lo:**
   - Login karne ke baad "API Keys" section mein jao
   - Apni default API key copy karo

3. **Project Mein API Key Add Karo:**
   - `.env` file kholo (project root mein)
   - `your_openweathermap_api_key_here` ki jagah apni API key paste karo:
   ```
   VITE_WEATHER_API_KEY=apki_actual_api_key_yahan
   ```

4. **Server Restart Karo:**
   - Development server ko stop karo (Ctrl+C)
   - Phir se start karo: `npm run dev`

## Ab App Chalao

```bash
npm run dev
```

Browser mein kholo aur kisi bhi city ka naam search karo!

## Common Issues

- **"API key setup nahi hui"** - .env file mein key add karo aur server restart karo
- **"Invalid API key"** - API key check karo, sahi copy hui hai?
- **"City not found"** - City name ki spelling check karo

Enjoy! 🌤️
