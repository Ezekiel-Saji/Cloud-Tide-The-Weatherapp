import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      console.warn("OpenWeatherMap API key not found, using fallback data")
      return getFallbackWeatherData(city)
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
    )

    if (!response.ok) {
      console.warn("OpenWeatherMap API request failed, using fallback data")
      return getFallbackWeatherData(city)
    }

    const data = await response.json()

    const weatherData = {
      temp: Math.round(data.main.temp),
      condition: mapWeatherCondition(data.weather[0].main.toLowerCase()),
      city: data.name,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return getFallbackWeatherData(city)
  }
}

function mapWeatherCondition(condition: string): string {
  const conditionMap: { [key: string]: string } = {
    clear: "sunny",
    clouds: "cloudy",
    rain: "rainy",
    drizzle: "rainy",
    thunderstorm: "rainy",
    snow: "snowy",
    mist: "cloudy",
    fog: "cloudy",
    haze: "cloudy",
  }

  return conditionMap[condition] || "cloudy"
}

function getFallbackWeatherData(city: string) {
  const weatherConditions = ["sunny", "cloudy", "rainy", "snowy"]
  const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

  const weatherData = {
    temp: Math.floor(Math.random() * 30) + 5,
    condition: randomCondition,
    city: city,
    description: `${randomCondition} weather`,
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.floor(Math.random() * 10) + 2,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(weatherData)
}
