"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RelationshipForecast } from "@/components/relationship-forecast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RelationshipPage() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState("London")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlCity = urlParams.get("city")
    if (urlCity) {
      setCity(urlCity)
    } else {
      const savedCity = localStorage.getItem("weatherAppCity")
      if (savedCity) {
        setCity(savedCity)
      }
    }
  }, [])

  useEffect(() => {
    fetchWeatherData()
  }, [city])

  const fetchWeatherData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/weather?city=${city}`)
      const data = await response.json()
      setWeatherData(data)
    } catch (error) {
      console.error("Failed to fetch weather:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Weather
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3 text-balance">💔 Relationship Forecast</h1>
            <p className="text-secondary-foreground text-base sm:text-lg max-w-2xl mx-auto text-pretty">
              How the weather will ruin your love life in {city} (with brutal honesty)
            </p>
          </div>
        </div>

        {loading ? (
          <Card className="glass-effect bg-card/50">
            <CardContent className="p-8 text-center">
              <div className="animate-pulse text-muted-foreground">Loading weather data for {city}...</div>
            </CardContent>
          </Card>
        ) : weatherData ? (
          <RelationshipForecast condition={weatherData.condition} temperature={weatherData.temperature} />
        ) : (
          <Card className="glass-effect bg-card/50">
            <CardContent className="p-8 text-center text-muted-foreground">
              Unable to load weather data for relationship forecast
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
