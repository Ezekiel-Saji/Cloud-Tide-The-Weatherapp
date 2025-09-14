"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Skull, RefreshCw } from "lucide-react"

interface ApocalypseAlertsProps {
  condition: string
  temperature: number
}

const getApocalypseAlert = (condition: string, temperature: number): string => {
  const alerts = {
    clear: [
      "☀️ The sun is shining! Clearly, this is the calm before the storm of eternal darkness. Enjoy your last moments of vitamin D!",
      "🌞 Perfect weather detected. The universe is obviously plotting something sinister. Stay suspicious!",
      "✨ Blue skies ahead! Time to panic about how unnaturally perfect everything looks. The end is definitely near!",
    ],
    clouds: [
      "☁️ The sky is a canvas of gray. The world's final mural is being painted.",
      "🌫️ The clouds have absorbed the sun. Hope you've made peace with eternal twilight.",
      "☁️ A blanket of clouds descends. It's not the rapture, it's just the world's final sigh.",
      "☁️ The sky is hiding something. It's probably the end, but feel free to guess!",
      "☁️ Clouds detected. Enjoy this preview of what comes after the sun gives up.",
      "🌫️ The sky is a flat, emotionless gray. The planet is officially bored with us.",
      "☁️ Not a bad day, just a silent, judgmental sky watching us stumble to the end.",
      "☁️ The sun has ghosted us. Again.",
      "☁️ The world is buffering. Do not refresh.",
      "☁️ The sky's hiding secrets. Probably your mistakes.",
    ],
    rain: [
      "🌧️ Light drizzle detected. Better build an ark 🚢. Noah's got nothing on this weather!",
      "☔ Rain drops falling! The sky is literally crying because it knows what's coming. Grab your umbrellas and your prayers!",
      "🌦️ Precipitation alert! Mother Nature is having a meltdown. Time to invest in waterproof everything!",
      "🌧️ It's not just rain, it's the sky's last tears. We're all drowning in a cosmic sadness.",
      "☔ The great flood has begun. This is not a drill. Get your umbrellas, and maybe a boat.",
      "💧 The world is washing itself clean of humanity. It's a surprisingly gentle cleanse.",
      "🌧️ The heavens are weeping for our sins. This is the soundtrack to our final moments.",
      "💦 The sky is crying. You should be too.",
      "💧 Raindrops on the window are a countdown. Tick-tock.",
      "🌧️ The world is so sad, even the sky is weeping. It's a free trial of eternal sadness.",
      "☔ The final baptism. No salvation, just a really wet goodbye.",
      "💧 The sound of the rain is the earth's final heartbeat.",
      "🌧️ The sky is making a point. A very, very wet point.",
    ],
    snow: [
      "❄️ Snow flakes spotted! The ice age 2.0 is here. Time to befriend some woolly mammoths!",
      "🌨️ Winter wonderland activated! Clearly the world is freezing over. Start hoarding hot chocolate immediately!",
      "⛄ Snowfall detected! The polar bears are taking over. Surrender now or face the fluffy consequences!",
      "❄️ The sun is failing. The great ice age has begun. We're all just waiting for the freeze.",
      "🥶 The world is getting cold shoulders from the universe.",
      "❄️ A freezing wind sweeps across the land. It's the universe's final, icy breath.",
      "⛄ The earth is hibernating, and it's not going to wake up.",
      "🥶 The sun is tired. It's gone to sleep. It's not coming back.",
      "❄️ The final frost is setting in. The world is turning into a tomb.",
      "🥶 Hope you said goodbye to vitamin D.",
      "❄️ The world's final winter. There will be no spring.",
      "🥶 This is the end. Not with a bang, but with a shiver.",
      "❄️ Nature's way of saying 'meh' has just become a little more... permanent.",
    ],
    thunderstorm: [
      "⚡ Thunder and lightning! Zeus is obviously having a tantrum. Hide your metal objects and your pride!",
      "🌩️ Storm clouds brewing! The weather gods are playing bowling with our fate. Strike!",
      "⛈️ Thunderstorm incoming! Time to unplug everything and pray to the electricity gods for mercy!",
      "⚡ The sky is angry. Very angry. This is a divine tantrum, and we're all caught in the crossfire.",
      "⛈️ The heavens are at war. Find a bunker and pray the thunder isn't a cannon shot.",
      "🌪️ The world is spinning out of control, literally. This is the planet's final rage-quit.",
      "⚡ Every flash of lightning is a cosmic snapshot of our doom. Smile for the camera!",
      "⛈️ It's a full-on celestial meltdown. Hope you enjoyed your time on this planet.",
      "🌪️ The sky has a headache. We are the source of the pain.",
      "⚡ The thunder is the sound of the world cracking.",
      "⛈️ This is how horror movies start. Don't split up.",
      "⚡ The storm is a metaphor for our collective mistakes, and it's here for a reckoning.",
      "⛈️ Prepare for the final act. The storm is our curtain call.",
    ],
    hot: [
      "🔥 Temperature rising! The sun is clearly trying to roast us all. Time to become one with your air conditioner!",
      "🌡️ Heat wave detected! The earth is basically a giant oven now. We're all just cookies waiting to be baked!",
      "☀️ Scorching hot! Even the thermometers are sweating. Invest in ice cubes and regret!",
      "☀️ The temperature is rising. It's not global warming, it's the earth's final fever.",
      "🔥 The sun is burning hotter. It's decided to expedite the end. Thanks, sun.",
      "🥵 The asphalt is melting. Your hope should be too.",
      "☀️ The sky is a furnace. Enjoy this free trial of hell.",
      "🌡️ The world is running a fever. The patient is critical.",
      "🔥 The sun is not shining, it's judging. And it's found us wanting.",
      "🥵 This is the Earth's final protest. It's literally too hot to handle.",
      "🔥 The heat is a slow-motion fire, and we are all kindling.",
      "☀️ The end is near. It's not a fire, it's a BBQ.",
      "🔥 The world is a pressure cooker. We're all about to burst.",
    ],
    cold: [
      "🧊 Freezing temperatures! Your breath is now visible proof that winter has declared war on humanity!",
      "❄️ Arctic conditions detected! Penguins are probably laughing at us right now. Embrace the shiver!",
      "🥶 Bone-chilling cold! Time to hibernate until spring. Wake me up when it's warm again!",
      "❄️ The sun is failing. The great ice age has begun. We're all just waiting for the freeze.",
      "🥶 The world is getting cold shoulders from the universe.",
      "❄️ A freezing wind sweeps across the land. It's the universe's final, icy breath.",
      "⛄ The earth is hibernating, and it's not going to wake up.",
      "🥶 The sun is tired. It's gone to sleep. It's not coming back.",
      "❄️ The final frost is setting in. The world is turning into a tomb.",
      "🥶 Hope you said goodbye to vitamin D.",
      "❄️ The world's final winter. There will be no spring.",
      "🥶 This is the end. Not with a bang, but with a shiver.",
      "❄️ Nature's way of saying 'meh' has just become a little more... permanent.",
    ],
  }

  let category = "clear"
  const lowerCondition = condition.toLowerCase()

  if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) category = "rain"
  else if (lowerCondition.includes("snow") || lowerCondition.includes("blizzard")) category = "snow"
  else if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) category = "thunderstorm"
  else if (lowerCondition.includes("cloud") || lowerCondition.includes("overcast")) category = "clouds"
  else if (temperature > 30) category = "hot"
  else if (temperature < 5) category = "cold"

  const categoryAlerts = alerts[category as keyof typeof alerts]
  return categoryAlerts[Math.floor(Math.random() * categoryAlerts.length)]
}

export function ApocalypseAlerts({ condition, temperature }: ApocalypseAlertsProps) {
  const [alert, setAlert] = useState<string>("")

  const generateNewAlert = () => {
    setAlert(getApocalypseAlert(condition, temperature))
  }

  useEffect(() => {
    generateNewAlert()
  }, [condition, temperature])

  return (
    <Card className="glass-effect shadow-xl border-border/50 bg-card/50 dark:bg-card/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-destructive text-lg">
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <Skull className="w-5 h-5" />
          </div>
          End of the World Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 dark:bg-destructive/20 rounded-lg border border-destructive/20 dark:border-destructive/30">
            <p className="text-card-foreground font-medium leading-relaxed">{alert}</p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={generateNewAlert}
              variant="outline"
              size="sm"
              className="border-border bg-transparent hover:bg-accent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Apocalypse Alert
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
