"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shirt, RefreshCw, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react"

interface FashionAdviceProps {
  condition: string
}

interface FashionTip {
  advice: string
  rating: number
  timestamp: number
}

export function FashionAdvice({ condition }: FashionAdviceProps) {
  const [advice, setAdvice] = useState("")
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState<number | null>(null)
  const [adviceHistory, setAdviceHistory] = useState<FashionTip[]>([])
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    fetchFashionAdvice()
  }, [condition])

  const fetchFashionAdvice = async () => {
    setLoading(true)
    setRating(null)
    try {
      const response = await fetch(`/api/fashion?condition=${condition}`)
      const data = await response.json()
      setAdvice(data.advice)
    } catch (error) {
      console.error("Failed to fetch fashion advice:", error)
      setAdvice("Wear clothes. Or don't. I'm not your fashion police.")
    } finally {
      setLoading(false)
    }
  }

  const refreshAdvice = () => {
    setRefreshCount((prev) => prev + 1)
    fetchFashionAdvice()
  }

  const rateAdvice = (newRating: number) => {
    setRating(newRating)

    // Save to history
    const tip: FashionTip = {
      advice,
      rating: newRating,
      timestamp: Date.now(),
    }

    setAdviceHistory((prev) => [tip, ...prev.slice(0, 4)])
  }

  const getAdviceQuality = () => {
    if (refreshCount === 0) return "Fresh advice"
    if (refreshCount < 3) return "Getting warmer..."
    if (refreshCount < 5) return "Trying harder..."
    return "Desperately searching..."
  }

  if (loading) {
    return (
      <Card className="glass-effect shadow-lg border-border/50 bg-card/50 dark:bg-card/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Shirt className="w-5 h-5" />
            Dress Code Recommendation
            <Badge variant="secondary" className="ml-auto">
              {condition}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-8 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-effect shadow-lg border-border/50 bg-card/50 dark:bg-card/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Shirt className="w-5 h-5" />
          Dress Code Recommendation
          <Badge variant="secondary" className="ml-auto">
            {condition}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <p className="text-card-foreground italic text-lg leading-relaxed">{advice}</p>
          <p className="text-sm text-muted-foreground mt-2 animate-fade-in">Wanna look cute?... nah u wont 😌</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">{getAdviceQuality()}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAdvice}
              className="text-muted-foreground hover:text-card-foreground hover:bg-accent"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rating System */}
        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">How helpful was this advice?</p>
          <div className="flex gap-2">
            <Button
              variant={rating === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => rateAdvice(1)}
              className="flex items-center gap-1"
            >
              <ThumbsDown className="w-4 h-4" />
              Terrible
            </Button>
            <Button
              variant={rating === 2 ? "default" : "outline"}
              size="sm"
              onClick={() => rateAdvice(2)}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="w-4 h-4" />
              Sarcastic Gold
            </Button>
          </div>

          {rating && (
            <p className="text-xs text-muted-foreground mt-2">
              {rating === 1
                ? "Thanks for the feedback! I'll try to be more unhelpful next time."
                : "Glad you appreciate quality sarcasm!"}
            </p>
          )}
        </div>

        {/* Advice History */}
        {adviceHistory.length > 0 && (
          <div className="border-t border-border pt-4 space-y-2">
            <h4 className="text-sm font-medium text-card-foreground">Previous Fashion Disasters</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {adviceHistory.map((tip, index) => (
                <div
                  key={index}
                  className="text-xs p-2 bg-accent/20 dark:bg-accent/10 rounded border-l-2 border-purple-300 dark:border-purple-600"
                >
                  <p className="text-muted-foreground line-clamp-2">{tip.advice}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {tip.rating === 1 ? "👎 Terrible" : "👍 Sarcastic Gold"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center border-t border-border pt-2">
          Fashion advice with a side of sass • Not responsible for fashion emergencies
        </p>
      </CardContent>
    </Card>
  )
}
