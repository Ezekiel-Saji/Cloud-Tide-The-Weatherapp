"use client"

import { WeatherComparison } from "@/components/weather-comparison"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" className="glass-effect bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Weather
            </Button>
          </Link>
          <ModeToggle />
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4 text-balance">
            Weather Comparison Tool
          </h1>
          <p className="text-secondary-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto text-pretty">
            Compare weather conditions across multiple cities and find your perfect destination
          </p>
        </div>

        <WeatherComparison />

        <footer className="mt-12 sm:mt-16 text-center">
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-2">
              Smart weather comparison with AI-powered recommendations
            </p>
            <p className="text-xs text-muted-foreground/70">Making travel decisions easier, one comparison at a time</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
