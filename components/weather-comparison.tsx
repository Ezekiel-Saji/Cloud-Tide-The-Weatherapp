"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, X, Thermometer, Droplets, Wind, Star, Award } from "lucide-react"

interface WeatherData {
  temp: number
  condition: string
  city: string
  description: string
  humidity: number
  windSpeed: number
  timestamp: string
}

interface ComparisonCity {
  id: string
  name: string
  data: WeatherData | null
  loading: boolean
}

export function WeatherComparison() {
  const [cities, setCities] = useState<ComparisonCity[]>([])
  const [newCityInput, setNewCityInput] = useState("")

  const addCity = async () => {
    if (!newCityInput.trim() || cities.length >= 4) return

    const cityId = Date.now().toString()
    const newCity: ComparisonCity = {
      id: cityId,
      name: newCityInput.trim(),
      data: null,
      loading: true,
    }

    setCities((prev) => [...prev, newCity])
    setNewCityInput("")

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(newCity.name)}`)
      const data = await response.json()

      setCities((prev) => prev.map((city) => (city.id === cityId ? { ...city, data, loading: false } : city)))
    } catch (error) {
      console.error("Failed to fetch weather:", error)
      setCities((prev) => prev.map((city) => (city.id === cityId ? { ...city, loading: false } : city)))
    }
  }

  const removeCity = (cityId: string) => {
    setCities((prev) => prev.filter((city) => city.id !== cityId))
  }

  const getConditionColor = (condition: string) => {
    const colors = {
      sunny: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
      cloudy: "bg-gray-500/20 text-gray-700 dark:text-gray-300",
      rainy: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      snowy: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
    }
    return colors[condition as keyof typeof colors] || colors.cloudy
  }

  const getTemperatureColor = (temp: number) => {
    if (temp >= 25) return "text-red-500"
    if (temp >= 15) return "text-orange-500"
    if (temp >= 5) return "text-blue-500"
    return "text-cyan-500"
  }

  const getBestDestination = () => {
    const validCities = cities.filter((city) => city.data && !city.loading)
    if (validCities.length < 2) return null

    let bestCity = validCities[0]
    let bestScore = 0
    let reasons: string[] = []

    validCities.forEach((city) => {
      if (!city.data) return

      let score = 0
      const cityReasons: string[] = []

      // Temperature scoring (ideal range 18-26°C)
      const temp = city.data.temp
      if (temp >= 18 && temp <= 26) {
        score += 30
        cityReasons.push("Perfect temperature")
      } else if (temp >= 15 && temp <= 30) {
        score += 20
        cityReasons.push("Good temperature")
      } else if (temp >= 10 && temp <= 35) {
        score += 10
      }

      // Weather condition scoring
      const condition = city.data.condition.toLowerCase()
      if (condition.includes("sunny") || condition.includes("clear")) {
        score += 25
        cityReasons.push("Clear skies")
      } else if (condition.includes("partly") || condition.includes("few")) {
        score += 15
        cityReasons.push("Pleasant weather")
      } else if (condition.includes("cloudy")) {
        score += 10
      } else if (condition.includes("rain") || condition.includes("storm")) {
        score -= 10
      }

      // Humidity scoring (ideal 40-60%)
      const humidity = city.data.humidity
      if (humidity >= 40 && humidity <= 60) {
        score += 15
        cityReasons.push("Comfortable humidity")
      } else if (humidity >= 30 && humidity <= 70) {
        score += 10
      } else if (humidity > 80) {
        score -= 5
      }

      // Wind scoring (gentle breeze is good)
      const wind = city.data.windSpeed
      if (wind >= 2 && wind <= 8) {
        score += 10
        cityReasons.push("Pleasant breeze")
      } else if (wind > 15) {
        score -= 5
      }

      if (score > bestScore) {
        bestScore = score
        bestCity = city
        reasons = cityReasons
      }
    })

    return { city: bestCity, score: bestScore, reasons }
  }

  const recommendation = getBestDestination()

  return (
    <Card className="glass-effect shadow-2xl border-border/50 bg-card/50 dark:bg-card/30">
      <CardHeader>
        <CardTitle className="text-center text-card-foreground text-lg sm:text-xl flex items-center justify-center gap-2">
          <MapPin className="w-5 h-5" />
          Weather Comparison Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add City Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent w-4 h-4" />
            <Input
              type="text"
              placeholder="Add city to compare..."
              value={newCityInput}
              onChange={(e) => setNewCityInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCity()}
              className="pl-10 bg-card border-border placeholder:text-muted-foreground"
              disabled={cities.length >= 4}
            />
          </div>
          <Button
            onClick={addCity}
            disabled={!newCityInput.trim() || cities.length >= 4}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-4"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {cities.length > 0 && (
          <div className="text-xs text-muted-foreground text-center">
            Compare up to 4 cities • {cities.length}/4 cities added
          </div>
        )}

        {recommendation && (
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-primary">Best Destination Recommendation</h3>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Top Pick
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-card-foreground">
                      📍 <span className="text-primary font-semibold">{recommendation.city.name}</span> is your best
                      choice for visiting!
                    </p>
                    {recommendation.city.data && (
                      <p className="text-xs text-muted-foreground">
                        {recommendation.city.data.temp}°C • {recommendation.city.data.condition} •{" "}
                        {recommendation.city.data.humidity}% humidity
                      </p>
                    )}
                  </div>
                  {recommendation.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recommendation.reasons.map((reason, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Grid */}
        {cities.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {cities.map((city) => (
              <div
                key={city.id}
                className={`relative p-4 rounded-lg border backdrop-blur-sm ${
                  recommendation?.city.id === city.id
                    ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/50 bg-card/30"
                }`}
              >
                {recommendation?.city.id === city.id && (
                  <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                    <Award className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCity(city.id)}
                  className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/20"
                >
                  <X className="w-3 h-3" />
                </Button>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <h3 className="font-semibold text-card-foreground truncate">{city.name}</h3>
                  </div>

                  {city.loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : city.data ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-accent" />
                          <span className={`text-2xl font-bold ${getTemperatureColor(city.data.temp)}`}>
                            {city.data.temp}°C
                          </span>
                        </div>
                        <Badge className={getConditionColor(city.data.condition)}>{city.data.condition}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          <span className="text-muted-foreground">{city.data.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="w-3 h-3 text-gray-500" />
                          <span className="text-muted-foreground">{city.data.windSpeed} m/s</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground capitalize">{city.data.description}</p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">Failed to load weather data</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {cities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Add cities above to start comparing weather conditions</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
