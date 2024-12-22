import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/utils/api";
import { motion } from "framer-motion";

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

export function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="w-full overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-2xl">
            Current Weather in {weatherData.city}, {weatherData.country}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
              alt={weatherData.description}
              width={100}
              height={100}
            />
            <div className="ml-4">
              <p className="text-4xl font-bold">{weatherData.temperature}°C</p>
              <p className="text-xl capitalize">{weatherData.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg">Humidity: {weatherData.humidity}%</p>
            <p className="text-lg">Wind Speed: {weatherData.windSpeed} m/s</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-2 bg-gray-100 rounded-lg"
              >
                <p className="font-semibold">{day.date}</p>
                <Image
                  src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  width={50}
                  height={50}
                  className="mx-auto"
                />
                <p>{day.temperature}°C</p>
                <p className="text-sm text-gray-600 capitalize">
                  {day.description}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
