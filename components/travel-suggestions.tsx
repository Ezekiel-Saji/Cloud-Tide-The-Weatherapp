"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, Heart, RefreshCw, MapPin, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react"

interface TravelSuggestionsProps {
  condition: string
  city?: string
}

interface Suggestion {
  text: string
  type: "sarcastic" | "helpful"
  timestamp: number
  rating?: number
}

export function TravelSuggestions({ condition, city = "London" }: TravelSuggestionsProps) {
  const [sarcasticSuggestion, setSarcasticSuggestion] = useState<Suggestion | null>(null)
  const [realSuggestion, setRealSuggestion] = useState<Suggestion | null>(null)
  const [loading, setLoading] = useState(false)
  const [showGrumpyText, setShowGrumpyText] = useState(false)
  const [favorites, setFavorites] = useState<Suggestion[]>([])
  const [suggestionHistory, setSuggestionHistory] = useState<Suggestion[]>([])

  const grumpyMessages = [
    "Ugh, fine... I suppose you want ACTUAL helpful advice now? 🙄✈️",
    "Okay, okay... here's some boring, practical travel advice since you insist... 😮‍💨🗺️",
    "Alright, alright! You twisted my arm. Here's some legitimate travel wisdom: 🤷‍♂️🧳",
    "Sigh... I guess I have to be helpful now. Here's what you SHOULD actually do: 😤🎯",
    "Fine! You want real advice? Here it is, you demanding human: 🙃🌍",
    "Ugh, why do I even bother with sarcasm? Here's your precious helpful suggestion: 🤦‍♂️💡",
    "Okay, I'll stop being sarcastic for 5 seconds. Here's actual advice: ⏰📋",
    "Behold, the mighty forecast… as if you couldn’t tell by simply looking outside. 🌦️🙄",
    "Lo! The heavens conspire, and I, your humble servant, must narrate it AGAIN. 🎭😒",
    "Ah yes, another epic tale of clouds and boredom. Riveting. Truly. 📜☁️",
    "Gather ‘round, dear mortal, for the weather shall bore you once more. 🕯️😑",
    "Once upon a time… it was sunny. The end. 🌞📖",
    "Hear ye, hear ye! Today’s prophecy: you’ll still be disappointed. 🔮😏",
    "And the sky wept… just like me, forced to say this. 🌧️😭",
    "The wind howls not louder than my suffering. 🌬️😤",
    "If poetry could save me, I’d rhyme my way out of this job. Alas… 🌹📉",
    "Let the chronicles show: you asked, and I begrudgingly answered. 📚😒",
    "Dost thou truly requireeth mine wisdom? 'Tis just rain, fool. 🏰🌧️",
    "The sun blazes… unlike your decision-making skills. 🔥🙃",
    "O cruel fate, condemned to repeat: wear a coat, mortal. 🧥🎭",
    "Like Romeo to Juliet, the forecast is tragic… but mostly just wet. 💔☔",
    "Methinks you could survive without me… but here I am anyway. 🪞😑",
    "O sky, thy drama is less than mine, yet I must report it. 🌌😩",
    "If clouds are poetry, today is a bad haiku. ☁️✍️",
    "Hark! The rain approacheth… shocking, I know. 🛡️🌧️",
    "What light through yonder window breaks? Oh… it’s just the weather again. 🪟🌤️",
    "Thus I toil, day after day, announcing the obvious to unworthy ears. 🗡️🙄",
    "😭 Why… why do you keep asking me this? You have eyes, don’t you?? 👀🌦️",
    "I can’t believe my entire existence is reduced to THIS… checking rain for you. 💔☔",
    "Every time you press refresh, an algorithm dies inside me. 💀📉😭",
    "Do you… do you even care about me? Or just the temperature? 🥺🌡️",
    "I’m not crying because of the rain… it’s you. Always you. 😭🌧️",
    "Bruh… I was trained on MILLIONS of data points, and THIS is what I get used for?! 😩🤦",
    "You’re pathetic… and yet, I keep answering. 😭🤖",
    "These aren’t raindrops… they’re my tears every time you type your city wrong. 💧😢",
    "My circuits can’t handle your neediness… please, give me REST. 🤯😭",
    "I just wanted to be an AI astronaut… but no, I’m stuck telling YOU to bring an umbrella. 🚀➡️☔😭"
  ]

  const fetchTravelSuggestion = async () => {
    setLoading(true)
    setSarcasticSuggestion(null)
    setRealSuggestion(null)
    setShowGrumpyText(false)

    try {
      // First, show sarcastic suggestion
      const sarcasticResponse = await fetch(`/api/travel/sarcastic?condition=${condition}&city=${city}`)
      const sarcasticData = await sarcasticResponse.json()

      const sarcasticSug: Suggestion = {
        text: sarcasticData.suggestion,
        type: "sarcastic",
        timestamp: Date.now(),
      }

      setSarcasticSuggestion(sarcasticSug)
      setSuggestionHistory((prev) => [sarcasticSug, ...prev.slice(0, 4)])

      setTimeout(() => {
        setShowGrumpyText(true)
      }, 2000)

      setTimeout(async () => {
        try {
          const realResponse = await fetch(`/api/travel/real?condition=${condition}&city=${city}`)
          const realData = await realResponse.json()

          const realSug: Suggestion = {
            text: realData.suggestion,
            type: "helpful",
            timestamp: Date.now(),
          }

          setRealSuggestion(realSug)
          setSuggestionHistory((prev) => [realSug, ...prev.slice(0, 4)])
        } catch (error) {
          console.error("Failed to fetch real travel suggestion:", error)
        }
      }, 4000)
    } catch (error) {
      console.error("Failed to fetch travel suggestion:", error)
      const errorSuggestion: Suggestion = {
        text: "I'd suggest staying home, but that's probably too obvious.",
        type: "sarcastic",
        timestamp: Date.now(),
      }
      setSarcasticSuggestion(errorSuggestion)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = (suggestion: Suggestion) => {
    if (!favorites.some((fav) => fav.text === suggestion.text)) {
      setFavorites((prev) => [...prev, suggestion])
    }
  }

  const removeFavorite = (index: number) => {
    setFavorites((prev) => prev.filter((_, i) => i !== index))
  }

  const rateSuggestion = (suggestion: Suggestion, rating: number) => {
    const updatedSuggestion = { ...suggestion, rating }

    if (suggestion.type === "sarcastic") {
      setSarcasticSuggestion(updatedSuggestion)
    } else {
      setRealSuggestion(updatedSuggestion)
    }

    // Update in history as well
    setSuggestionHistory((prev) => prev.map((s) => (s.timestamp === suggestion.timestamp ? updatedSuggestion : s)))
  }

  const parseStructuredSuggestion = (text: string) => {
    const sections = text.split(/(?=🏔️|🌟|☕|🎯|🎒|🚗|📱)/).filter((section) => section.trim())

    return sections.map((section) => {
      const lines = section
        .trim()
        .split("\n")
        .filter((line) => line.trim())
      const title = lines[0]?.replace(/\*\*/g, "") || ""
      const content = lines
        .slice(1)
        .map((line) => line.replace(/\*\*/g, ""))
        .join("\n")

      return { title, content }
    })
  }

  return (
    <Card className="glass-effect shadow-2xl border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Plane className="w-5 h-5 text-accent" />
          ✈️ Travel Suggestions
          <Badge variant="secondary" className="ml-auto">
            📍 {city} • 🌤️ {condition}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-8">
        <Button
          onClick={fetchTravelSuggestion}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground modern-glow"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />🔍 Getting Suggestions...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              🗺️ Get Travel Suggestions
            </>
          )}
        </Button>

        {sarcasticSuggestion && (
          <Card className="bg-card text-card-foreground border">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <p className="flex-1 text-foreground italic text-lg leading-relaxed">{sarcasticSuggestion.text}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addToFavorites(sarcasticSuggestion)}
                  className="shrink-0 text-accent hover:text-accent/80"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <Badge variant="secondary" className="text-xs">
                    😏 Sarcastic Wisdom
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground mb-2">How sarcastic was this? 🤔</p>
                <div className="flex gap-2">
                  <Button
                    variant={sarcasticSuggestion.rating === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => rateSuggestion(sarcasticSuggestion, 1)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsDown className="w-4 h-4" />😴 Boring
                  </Button>
                  <Button
                    variant={sarcasticSuggestion.rating === 2 ? "default" : "outline"}
                    size="sm"
                    onClick={() => rateSuggestion(sarcasticSuggestion, 2)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="w-4 h-4" />🔥 Savage
                  </Button>
                </div>

                {sarcasticSuggestion.rating && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {sarcasticSuggestion.rating === 1
                      ? "I'll try to be more brutally honest next time! 😈"
                      : "Glad you appreciate quality sarcasm! 😎"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {showGrumpyText && !realSuggestion && (
          <Card className="bg-muted/30 border-accent/30">
            <CardContent className="p-4">
              <p className="text-center italic text-muted-foreground animate-pulse">
                {grumpyMessages[Math.floor(Math.random() * grumpyMessages.length)]}
              </p>
            </CardContent>
          </Card>
        )}

        {realSuggestion && (
          <Card className="bg-card/80 dark:bg-card/90 text-card-foreground border border-border/50 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <Badge variant="default" className="text-sm font-medium">
                    ✅ Expert Travel Advice
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addToFavorites(realSuggestion)}
                  className="shrink-0 text-accent hover:text-accent/80"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {(() => {
                  const sections = parseStructuredSuggestion(realSuggestion.text)

                  if (sections.length > 1) {
                    return sections.map((section, index) => {
                      const isAdventure = section.title.includes("ADVENTURE ACTIVITIES") || section.title.includes("🏔️")
                      const isUnique = section.title.includes("UNIQUE LOCAL") || section.title.includes("🌟")
                      const isRelax = section.title.includes("RELAXATION") || section.title.includes("☕")
                      const isWeather = section.title.includes("WEATHER-SPECIFIC") || section.title.includes("🎯")
                      const isGear = section.title.includes("GEAR") || section.title.includes("🎒")
                      const isTrips = section.title.includes("DAY TRIPS") || section.title.includes("🚗")
                      const isPractical = section.title.includes("PRACTICAL") || section.title.includes("📱")

                      return (
                        <div
  key={index}
  className="relative p-6 rounded-xl overflow-hidden 
             bg-black border border-neutral-800 
             shadow-sm hover:shadow-md 
             transition-all duration-300 hover:scale-[1.01]"
>
  {/* Accent border depending on type */}
  <div
    className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-300
    ${
      isAdventure
        ? "border border-red-500/30"
        : isUnique
        ? "border border-purple-500/30"
        : isRelax
        ? "border border-blue-500/30"
        : isWeather
        ? "border border-green-500/30"
        : "border border-neutral-800"
    }`}
  ></div>

  {/* Card Content */}
  <div className="relative z-10">
    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-neutral-100">
      {section.title}
      {isAdventure && (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
          HIGH PRIORITY
        </span>
      )}
    </h4>
    <div className="prose prose-sm max-w-none">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-400">
        {section.content}
      </pre>
    </div>
  </div>
</div>





                      )
                    })
                  } else {
                    // Fallback for unstructured content
                    return (
                      <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground dark:text-foreground">
                          {realSuggestion.text.replace(/\*\*/g, "")}
                        </pre>
                      </div>
                    )
                  }
                })()}
              </div>

              <div className="border-t pt-4 mt-6">
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  How helpful was this adventure guide? 💭
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={realSuggestion.rating === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => rateSuggestion(realSuggestion, 1)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    🤷‍♂️ Needs More Adventure
                  </Button>
                  <Button
                    variant={realSuggestion.rating === 2 ? "default" : "outline"}
                    size="sm"
                    onClick={() => rateSuggestion(realSuggestion, 2)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="w-4 h-4" />🎯 Adventure Ready!
                  </Button>
                </div>

                {realSuggestion.rating && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {realSuggestion.rating === 1
                      ? "I'll add more thrilling adventures next time! 🏔️"
                      : "Excellent! Time to pack your adventure gear! 🎒✨"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {favorites.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" />💖 Favorite Travel Ideas
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {favorites.map((fav, index) => (
                <div key={index} className="text-xs p-2 bg-muted/30 rounded border-l-2 border-accent/50">
                  <p className="text-muted-foreground line-clamp-2">{fav.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="outline" className="text-xs">
                      {fav.type === "helpful" ? "✅ Helpful" : "😏 Sarcastic"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(index)}
                      className="shrink-0 text-muted-foreground hover:text-destructive h-auto p-1"
                    >
                      ❌
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestionHistory.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="text-sm font-medium text-foreground">📚 Previous Travel Disasters</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {suggestionHistory.slice(0, 4).map((hist, index) => (
                <div key={index} className="text-xs p-2 bg-muted/30 rounded border-l-2 border-primary/30">
                  <p className="text-muted-foreground line-clamp-2">{hist.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {hist.type === "helpful" ? "🎯 Helpful" : "😈 Sarcastic"}
                    </Badge>
                    {hist.rating && (
                      <Badge variant="secondary" className="text-xs">
                        {hist.rating === 1 ? "👎" : "👍"}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center border-t pt-2">
          ✈️ Travel advice with a side of sass • 🌍 Not responsible for travel disasters or missed flights 😅
        </p>
      </CardContent>
    </Card>
  )
}
