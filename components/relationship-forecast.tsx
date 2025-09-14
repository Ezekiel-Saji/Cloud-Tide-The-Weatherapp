"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, HeartCrack, RefreshCw } from "lucide-react"

interface RelationshipForecastProps {
  condition: string
  temperature: number
}

export function RelationshipForecast({ condition, temperature }: RelationshipForecastProps) {
  const [forecast, setForecast] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/relationship?condition=${condition}&temperature=${temperature}`)
        const data = await response.json()
        setForecast(data.forecast)
      } catch (error) {
        console.error("Failed to fetch relationship forecast:", error)
        setForecast("Your love life is as unpredictable as the weather. Good luck!")
      } finally {
        setLoading(false)
      }
    }

    if (condition) {
      fetchForecast()
    }
  }, [condition, temperature])

  const refreshForecast = () => {
    const fetchForecast = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/relationship?condition=${condition}&temperature=${temperature}`)
        const data = await response.json()
        setForecast(data.forecast)
      } catch (error) {
        console.error("Failed to fetch relationship forecast:", error)
        setForecast("Your love life is as unpredictable as the weather. Good luck!")
      } finally {
        setLoading(false)
      }
    }
    fetchForecast()
  }

  if (loading) {
    return (
      <Card className="glass-effect shadow-lg border-border/50 bg-card/50 dark:bg-card/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
            <HeartCrack className="w-5 h-5 text-pink-500" />
            Relationship Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-pulse text-muted-foreground">Predicting romantic disasters...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-effect shadow-lg border-border/50 bg-card/50 dark:bg-card/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <HeartCrack className="w-5 h-5 text-pink-500" />
          Relationship Forecast
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Predicts how the weather will ruin your love life</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-accent/20 dark:bg-accent/10 rounded-lg p-4 border border-border/30">
          <p className="text-card-foreground text-sm leading-relaxed italic">"{forecast}"</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Heart className="w-3 h-3 mr-1 text-pink-400" />
            Weather-based relationship advice since never
          </div>
          <Button
            onClick={refreshForecast}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-border bg-transparent hover:bg-accent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Forecast
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
