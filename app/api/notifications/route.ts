import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const condition = searchParams.get("condition") || "unknown"

  const notifications = {
    sunny: [
      "Reminder: You said you'd go outside more. The weather is calling your bluff.",
      "Perfect day to realize you don't own sunglasses that aren't from a gas station.",
      "Your plants are judging you for keeping them inside on such a nice day.",
      "Time to pretend you enjoy outdoor activities for your social media.",
      "The sun is out! Time to discover you're allergic to everything that blooms.",
      "☀️ Congrats, the sun is auditioning for a role in your personal oven.",
      "😎 Do not forget sunglasses—or just accept permanent squint mode.",
      "🔥 Breaking news: Pavement is now legally a frying pan.",
      "🥵 Hydration check! Unless you enjoy becoming human jerky.",
      "🌞 The sun called—it wants rent for using its rays.",
      "💡 Free vitamin D, but also free sunburn. Pick your fighter.",
      "🏜️ Shade has become premium real estate.",
      "🌋 Feels like Mother Nature is testing her lava simulator.",
      "🍦 Ice creams lifespan today: 4.3 seconds.",
      "😐 Forecast: sweat, regret, and deodorant betrayal."
    ],
    cloudy: [
      "Gray skies ahead. Perfect match for your current life situation.",
      "Cloudy weather: Nature's way of saying 'meh' to your day.",
      "The sky is as confused about the weather as you are about your life.",
      "Overcast conditions detected. Vitamin D deficiency intensifying.",
      "Perfect weather for indoor existential crises.",
       "☁️ Mood: suspiciously gray. Weather’s playing hard to get.",
      "🙄 Clouds: Nature’s version of buffering.",
      "😴 The sky just hit snooze again.",
      "📺 Today’s episode: 50 shades of meh.",
      "🌫️ Don’t worry, the sun is just socially anxious.",
      "🤔 Clouds plotting whether to rain or just ruin your lighting.",
      "😶 Perfect day to look as gloomy as the sky.",
      "☁️ Weather set to 'existential crisis' mode.",
      "🕶️ Sunglasses not needed—your future is dim anyway.",
      "🍵 Ideal weather for tea, blankets, and pretending to be deep."
    ],
    rainy: [
      "Rain detected! Time to find out which of your shoes are actually waterproof.",
      "Precipitation incoming. Your hair products are about to be tested.",
      "Perfect weather for staying inside and avoiding all responsibilities.",
      "Rain alert: Your car windows are probably still down.",
      "Wet weather ahead. Time to practice your 'I meant to look like this' face.",
      "🌧️ Free shower for all… umbrella not included.",
      "💧 Rain: the sky’s way of crying about your life choices.",
      "☂️ Forecast: 90% chance of you forgetting your umbrella.",
      "🚶 Walking outside? Enjoy squelchy shoe ASMR.",
      "📉 Hair volume down 80%. Mood down 100%.",
      "🦆 Ducks are thriving, humans are not.",
      "⛈️ Thunder says hi, and it’s louder than your alarm.",
      "😑 That smell? Wet dog + regret.",
      "🌊 Streets are now unofficial waterparks.",
      "🎶 Bonus: free dramatic soundtrack from raindrops."
    ],
    snowy: [
      "Snow incoming! Time to remember you don't know how to drive in winter.",
      "Winter weather alert: Your heating bill is about to judge you.",
      "Snow detected! Perfect time to realize you don't own proper winter gear.",
      "Frozen precipitation ahead. Your summer tires are not amused.",
      "Snow alert: Time to pretend you enjoy 'winter activities'.",
      "❄️ Breaking news: the freezer has exploded.",
      "☃️ Build a snowman, or just freeze into one yourself.",
      "🥶 Fashion today: 6 jackets, 3 scarves, and still shivering.",
      "🧊 Ice: now available in both cubes and sidewalks.",
      "🚗 Good luck finding your car—it’s in Narnia now.",
      "🍫 Weather demands: hot chocolate tribute, immediately.",
      "😵 Warning: touching metal = instant regret.",
      "🐧 Penguins called; they’re moving in.",
      "📸 Snow looks pretty, until you have to shovel it.",
      "🙃 Your toes are now officially popsicles."
    ],
  }

  const messages = notifications[condition.toLowerCase()] || [
    "Weather update: It's still weather. You're still you. Nothing has fundamentally changed.",
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  return NextResponse.json({
    message: randomMessage,
    condition: condition,
    timestamp: new Date().toISOString(),
  })
}
