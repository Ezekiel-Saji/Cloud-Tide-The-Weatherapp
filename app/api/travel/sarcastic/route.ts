import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const condition = searchParams.get("condition") || "unknown"
  const city = searchParams.get("city") || "London"

  const sarcasticSuggestions = {
    sunny: [
      `Why not visit the Sahara Desert? I hear it's lovely this time of year. Much hotter than ${city}!`,
      `Perfect day to go to Death Valley! Pack some ice cubes and leave ${city} behind.`,
      `How about a nice hike in the Australian Outback? Makes ${city} look like a winter wonderland.`,
      `I suggest visiting Mercury. The weather's similar to ${city} today, just a bit warmer.`,
      `Try the surface of the sun! It's only slightly hotter than ${city} right now.`,
      `Why not fry an egg on the sidewalk? 🍳 Hotter than your stove in ${city}.`,
      "Visit the Sahara Desert 🏜️—at least there you expect this nonsense.",
      `Thinking of Death Valley 🌵? Less sunscreen required than ${city}.`,
      `Head to Mercury ☀️! It's basically ${city} with extra spice.`,
      `Try a day trip to the surface of the sun 🔥—it’s only marginally worse than ${city}.`,
      "Looking for shade? Antarctica ❄️ might be your best bet right now.",
      `Swap ${city} for the Outback 🐨—less sweat, more kangaroos.`,
      `Visit Venus 🌌! ${city} is already halfway there.`,
      `Skip the gym 💪—just walk outside in ${city} and get baked cardio.`,
      `Might as well install solar panels on yourself ☀️🔋 in ${city}.`
    ],
    cloudy: [
      `Visit London! Oh wait, you're probably already experiencing that weather in ${city}.`,
      `How about Seattle? You can get the full gray experience, just like ${city} today.`,
      `Perfect time to visit a cave in ${city}. At least it's consistently dark underground.`,
      `Try visiting your local ${city} basement. Similar ambiance, less travel required.`,
      `Consider moving to a place with actual weather. Unlike ${city} today.`,
       "Why not visit London 🌫️? They’ve mastered the art of gloomy skies.",
      "Perfect day for a Seattle trip ☕—same clouds, but with better coffee.",
      `Go to Gotham City 🦇—it’s basically ${city} but with Batman.`,
      `Thinking of Iceland 🇮🇸? Their clouds have more personality than ${city}.`,
      `Try Portland 🌧️—it rains eventually, unlike ${city}’s lazy clouds.`,
      "Travel to Silent Hill 👻—you’ll feel right at home.",
      "Head to Northern England ☁️—gray skies are practically a tourist attraction.",
      "How about Belgium 🧇? Their clouds come with waffles.",
      `Visit Vancouver 🌲—it’s like ${city}, but wetter.`,
      "Consider a trip to Mordor 🧙—at least their gloom is dramatic."
    ],
    rainy: [
      `Perfect time to visit the Amazon rainforest! More water than ${city}, more fun!`,
      `How about a nice trip to the bottom of the ocean? Drier than ${city} today.`,
      `Visit Noah's Ark. I hear they have experience with this ${city} weather.`,
      `Try going to Atlantis. It's always wet there, just like ${city} right now.`,
      `Consider building an ark in ${city}. You might need it at this rate.`,
      "Why not check out Seattle 🌧️? Their rain is basically a lifestyle.",
      `Try the Amazon rainforest 🐒—at least you’ll see exotic animals instead of puddles in ${city} .`,
      `Go to London ☂️—the umbrellas there have more culture than ${city}.`,
      `Ever thought about Ireland 🍀? Their rain comes with castles.`,
      "Perfect day to visit Kerala 🇮🇳—at least their monsoons are Instagrammable 📸.",
      "Fly to Singapore 🏙️—same rain, better food.",
      "Book a trip to Cherrapunji 🌲—their rain makes ${city} look thirsty.",
      "How about Norway 🇳🇴? Rain there comes with fjords 🛶.",
      "Take a detour to Wales 🐑—rain and sheep, unbeatable combo.",
      "Or just move to Atlantis 🐠—rain is not a problem underwater."
    ],
    snowy: [
      `Perfect time to visit Antarctica! Pack light, it's warmer than ${city}.`,
      `How about Siberia? I hear the hospitality is as warm as ${city}'s weather.`,
      `Try visiting an igloo near ${city}. Embrace the theme you're already living.`,
      `Visit the North Pole. Santa's probably used to visitors from ${city} complaining about the weather.`,
      `Consider hibernation in ${city}. Bears have the right idea about this weather.`,
      `Why not spend a day in Siberia 🐻—colder, but at least it’s authentic.`,
      `Try Antarctica 🐧—at least penguins make better neighbors than ${city}.`,
      "Go to Canada 🍁—same snow, friendlier apologies.",
      "Visit the North Pole 🎅—Santa’s hiring seasonal elves.",
      "Check out Greenland ❄️—colder than your ex’s heart ❤️.",
      "Head to Norway 🇳🇴—snow with a view of fjords 🏔️.",
      "Book a trip to Alaska 🦌—snow, moose, and more snow.",
      "Try Mount Everest 🏔️—bonus altitude sickness included.",
      "Visit Narnia 🦁—they’ve been snowed in for decades.",
      `Or just go to Hoth 🌌—Star Wars snow edition, better than ${city}.`
    ],
  }

  const suggestions = sarcasticSuggestions[condition.toLowerCase()] || [
    `I suggest staying exactly where you are in ${city}. The weather is probably the same everywhere else.`,
  ]

  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]

  return NextResponse.json({
    suggestion: randomSuggestion,
    type: "sarcastic",
    condition: condition,
    city: city,
  })
}
