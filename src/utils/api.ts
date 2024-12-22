const OPENWEATHERMAP_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const OPENCAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;


export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    date: string;
    temperature: number;
    description: string;
    icon: string;
  }[];
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
  );
  const data = await response.json();

  return {
    city: data.city.name,
    country: data.city.country,
    temperature: Math.round(data.list[0].main.temp),
    description: data.list[0].weather[0].description,
    icon: data.list[0].weather[0].icon,
    humidity: data.list[0].main.humidity,
    windSpeed: Math.round(data.list[0].wind.speed),
    forecast: data.list.filter((_: any, index: number) => index % 8 === 0 || index === 39).slice(1, 6).map((item: any) => ({
      date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    })),
  };
}

export async function searchLocation(query: string): Promise<{ lat: number; lon: number; display_name: string }[]> {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_API_KEY}&limit=5`
  );
  const data = await response.json();

  return data.results.map((result: any) => ({
    lat: result.geometry.lat,
    lon: result.geometry.lng,
    display_name: result.formatted,
  }));
}

