"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface SarcasticRemarkProps {
  condition: string
}

export function SarcasticRemark({ condition }: SarcasticRemarkProps) {
  const [remark, setRemark] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSarcasticRemark()
  }, [condition])

  const fetchSarcasticRemark = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sarcasm?condition=${condition}`)
      const data = await response.json()
      setRemark(data.remark)
    } catch (error) {
      console.error("Failed to fetch sarcastic remark:", error)
      setRemark("Even I can't come up with a sarcastic comment for this weather.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="glass-effect shadow-lg border-border/50 bg-card/50 dark:bg-card/30">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-effect shadow-lg border-border/50 bg-card/50 dark:bg-card/30 border-l-4 border-l-orange-500">
      <CardContent className="p-4">
        <p className="text-card-foreground italic font-medium">"{remark}"</p>
        <p className="text-xs text-muted-foreground mt-2">- Your Brutally Honest Weather Assistant</p>
      </CardContent>
    </Card>
  )
}
