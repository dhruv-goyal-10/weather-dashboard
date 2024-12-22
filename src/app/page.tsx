"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getWeatherData, WeatherData } from "@/utils/api";
import { SearchComponent } from "@/components/Search";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { Loader2 } from "lucide-react";

// London Coordinates as default
const DEFAULT_LAT = 51.5074;
const DEFAULT_LON = -0.1278;

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { latitude, longitude, error } = useGeolocation();

  const fetchWeather = async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const data = await getWeatherData(lat, lon);
      console.log("weather data", data);
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    } else if (error) {
      fetchWeather(DEFAULT_LAT, DEFAULT_LON);
    }
  }, [latitude, longitude, error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Weather Dashboard
        </h1>
        <div className="relative">
          <SearchComponent onLocationSelect={fetchWeather} />
          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : weatherData ? (
              <WeatherDisplay weatherData={weatherData} />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
