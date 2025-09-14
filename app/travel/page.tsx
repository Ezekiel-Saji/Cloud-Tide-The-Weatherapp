"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TravelSuggestions } from "@/components/travel-suggestions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TravelPage() {
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
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3 text-balance">✈️ Travel Suggestions</h1>
            <p className="text-secondary-foreground text-base sm:text-lg max-w-2xl mx-auto text-pretty">
              🌍 Weather-based travel recommendations for {city} (with a side of sarcasm) 😏
            </p>
          </div>
        </div>

        {loading ? (
          <Card className="glass-effect">
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">Loading weather data for {city}...</div>
            </CardContent>
          </Card>
        ) : weatherData ? (
          <TravelSuggestions condition={weatherData.condition} city={weatherData.city || city} />
        ) : (
          <Card className="glass-effect">
            <CardContent className="p-8 text-center text-muted-foreground">
              Unable to load weather data for travel suggestions
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
