import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const condition = searchParams.get("condition") || "unknown"
  const city = searchParams.get("city") || "London"

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `You are an expert travel advisor specializing in adventure and experiential travel. Based on the current weather condition "${condition}" in ${city}, provide comprehensive, actionable travel suggestions with a focus on adventurous activities with a twist of humour.

Structure the response with clear sections and proper formatting:

🏔️ **ADVENTURE ACTIVITIES** (Priority Section)
- List 3-4 specific adventurous activities with difficulty levels (🟢 Easy, 🟡 Moderate, 🔴 Challenging)
- Include outdoor sports, hiking trails, water activities, extreme sports, or unique local adventures
- Mention specific locations, equipment needed, and best times to do them
- Add risk level and experience requirements

🌟 **UNIQUE LOCAL EXPERIENCES**
- 2-3 authentic local experiences (food tours, cultural immersion, hidden gems)
- Include local festivals, markets, or community events happening now
- Mention interaction opportunities with locals

☕ **RELAXATION & CULTURE**
- 2-3 chill activities (scenic cafés, art galleries, museums, viewpoints)
- Include Instagram-worthy spots and photo opportunities
- Mention opening hours and booking requirements

🎯 **WEATHER-SPECIFIC ADVANTAGES**
- Explain exactly why this weather is perfect for these activities
- Include timing recommendations (morning vs evening activities)

🎒 **ADVENTURE GEAR & PREP**
- Essential equipment for adventure activities
- Local rental options and costs
- Safety tips and emergency contacts

🚗 **EPIC DAY TRIPS & NEARBY ADVENTURES**
- 1-2 adventure-focused day trips within 1-3 hours
- Include transportation options and estimated costs
- Mention overnight camping or accommodation options

📱 **PRACTICAL ADVENTURE INFO**
- Best apps for navigation/booking
- Local adventure tour companies
- Emergency services and safety contacts

Format with emojis, bullet points, and clear sections. Make it scannable and exciting. Focus on adventure while balancing with cultural experiences. Include specific names, locations, and practical details.`,
    })

    return NextResponse.json({
      suggestion: text,
      type: "gemini-powered",
      condition: condition,
      city: city,
    })
  } catch (error) {
    console.warn("Gemini API failed, using fallback suggestions:", error)

    const locationAwareSuggestions = {
      sunny: [
        `Perfect weather for exploring ${city}'s outdoor attractions! Visit local parks, outdoor markets, or take a walking tour of the historic district. 🌞`,
        `Great time to explore nearby coastal areas or countryside from ${city}. Clear skies make for stunning photography and outdoor dining. 🏖️`,
        `Ideal conditions for visiting ${city}'s rooftop bars, outdoor cafes, or botanical gardens with comfortable temperatures. ☕`,
        `Consider day trips from ${city} to nearby scenic spots, vineyards, or hiking trails while the weather is perfect. 🚗`,
      ],
      cloudy: [
        `Excellent weather for exploring ${city}'s museums, galleries, and indoor attractions without harsh sunlight. 🏨`,
        `Perfect for city walking tours around ${city} with comfortable temperatures and no glare for photos. 🌆`,
        `Great conditions for visiting ${city}'s covered markets, shopping districts, or historic indoor sites. 🛍️`,
        `Ideal for cozy cafe hopping and exploring ${city}'s neighborhoods with mild outdoor conditions. ☕`,
      ],
      rainy: [
        `Perfect time to visit ${city}'s indoor attractions like museums, libraries, or shopping centers. 🏨`,
        `Great weather for exploring ${city}'s covered markets, underground passages, or cozy restaurants. 🛍️`,
        `Ideal for visiting spas, wellness centers, or taking cooking classes in ${city}. 🥘`,
        `Consider indoor activities like art galleries, theaters, or bookshops around ${city}. 🎨`,
      ],
      snowy: [
        `Perfect conditions for winter activities near ${city} like ice skating, winter markets, or cozy indoor venues. ❄️`,
        `Great time to visit ${city}'s winter attractions, hot chocolate spots, or indoor entertainment venues. 🍫`,
        `Ideal for exploring ${city}'s museums and galleries while staying warm, or visiting nearby winter sports areas. 🏨`,
        `Consider visiting hot springs, saunas, or warm indoor attractions near ${city} for a cozy contrast. 🌋`,
      ],
    }

    const suggestions = locationAwareSuggestions[condition.toLowerCase()] || [
      `Consider visiting ${city}'s indoor attractions or climate-controlled environments for optimal comfort. 🏨`,
    ]

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]

    return NextResponse.json({
      suggestion: randomSuggestion,
      type: "enhanced-helpful",
      condition: condition,
      city: city,
    })
  }
}
