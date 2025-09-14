"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WeatherDisplay } from "@/components/weather-display"
import { SarcasticRemark } from "@/components/sarcastic-remark"
import { FashionAdvice } from "@/components/fashion-advice"
import { ApocalypseAlerts } from "@/components/apocalypse-alerts"
import { ModeToggle } from "@/components/mode-toggle"
import { MapPin, Search, Plane, Bell, HeartCrack, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState("Enter your city, or Ill just make up the weather 💨😂")
  const [inputCity, setInputCity] = useState("")

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

  const handleCityChange = () => {
    if (inputCity.trim()) {
      setCity(inputCity.trim())
      setInputCity("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCityChange()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-4xl">
        <div className="flex justify-end mb-4">
          <ModeToggle />
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4 text-balance">
            Weather, Obviously 😏
          </h1>
          <p className="text-secondary-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto text-pretty">
            "The only app that laughs when you forget your umbrella 😂"
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4">
            <Link href={`/travel?city=${encodeURIComponent(city)}`}>
              <Button variant="outline" className="glass-effect bg-transparent">
                <Plane className="w-4 h-4 mr-2" />
                Travel Suggestions
              </Button>
            </Link>
            <Link href={`/relationship?city=${encodeURIComponent(city)}`}>
              <Button variant="outline" className="glass-effect bg-transparent">
                <HeartCrack className="w-4 h-4 mr-2" />
                Relationship Forecast
              </Button>
            </Link>
            <Link href="/comparison">
              <Button variant="outline" className="glass-effect bg-transparent">
                <BarChart3 className="w-4 h-4 mr-2" />
                Weather Comparison
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="outline" className="glass-effect bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                Notification Center
              </Button>
            </Link>
          </div>

          <div className="mt-6 sm:mt-8 max-w-md mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Enter city name..."
                  value={inputCity}
                  onChange={(e) => setInputCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-card border-border placeholder:text-muted-foreground"
                />
              </div>
              <Button
                onClick={handleCityChange}
                disabled={!inputCity.trim()}
                className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 modern-glow"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-8">
          <Card className="glass-effect shadow-2xl border-border/50 bg-card/50 dark:bg-card/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-card-foreground text-lg sm:text-xl">
                Current Weather - {city}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              {weatherData && (
                <ApocalypseAlerts condition={weatherData.condition} temperature={weatherData.temperature} />
              )}
              <WeatherDisplay data={weatherData} loading={loading} />
              {weatherData && <SarcasticRemark condition={weatherData.condition} />}
            </CardContent>
          </Card>

          {weatherData && (
            <div className="grid gap-6 lg:grid-cols-1 max-w-4xl mx-auto">
              <FashionAdvice condition={weatherData.condition} />
            </div>
          )}
        </div>

        <footer className="mt-12 sm:mt-16 text-center">
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-2">
              Built with sarcasm and questionable weather predictions
            </p>
            <p className="text-xs text-muted-foreground/70">
              Not responsible for weather-related life decisions or fashion emergencies
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
