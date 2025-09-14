import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "")

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const condition = searchParams.get("condition")
    const temperature = searchParams.get("temperature")

    if (!condition) {
      return NextResponse.json({ error: "Weather condition is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `You are a sarcastic relationship advisor who predicts how weather affects love life. Based on the weather condition "${condition}" and temperature "${temperature}°C", give a brutally honest, witty, and sarcastic relationship forecast that will roast the user in 2-3 sentences. Be humorous but not mean-spirited. Examples:
    - "Rainy date night? Yeah, nothing says romance like wet socks."
    - "Hot sun = hot arguments. Stay single."
    - "Perfect weather for outdoor dates... if you enjoy sweating through your first impression."
    
    Make it weather-specific and relationship-focused with dark humor.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const forecast = response.text()

    return NextResponse.json({ forecast })
  } catch (error) {
    console.error("Error generating relationship forecast:", error)

    // Fallback sarcastic responses based on weather condition
    const fallbackForecasts = {
      clear:
        "Perfect weather for love... if you can handle the pressure of a 'perfect' date. No weather excuses today!",
      rain: "Rainy weather = cancelled dates = more Netflix alone. Your relationship status: soggy.",
      snow: "Snow means cozy indoor dates... or being trapped with someone you're not sure you like yet.",
      clouds: "Cloudy skies match your relationship prospects: unclear and potentially disappointing.",
      thunderstorm:
        "Stormy weather, stormy relationships. At least the lightning is more exciting than your love life.",
      default: "Weather's unpredictable, just like your dating life. Good luck with both!",
    }

    const condition = request.nextUrl.searchParams.get("condition")?.toLowerCase() || "default"
    const forecast = fallbackForecasts[condition as keyof typeof fallbackForecasts] || fallbackForecasts.default

    return NextResponse.json({ forecast })
  }
}
