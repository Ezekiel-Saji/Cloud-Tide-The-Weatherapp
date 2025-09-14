import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const condition = searchParams.get("condition") || "unknown"
//fallback stack if the api calling doesnt work.
 const fashionAdvice = {
    sunny: [
      "Wear sunglasses so people can't see you judging their summer fashion choices.",
      "Light colors are recommended, but let's be honest, you'll still sweat through everything.",
      "Shorts and a t-shirt. Revolutionary fashion advice, I know.",
      "SPF 50+ because your skin is probably as unprepared as your wardrobe.",
      "Flip-flops: Because nothing says 'I've given up on life' like wearing them outside the beach.",
    ],
    cloudy: [
      "Layers! Because the weather is as indecisive as your outfit choices.",
      "Gray clothes to match the sky and your mood.",
      "Bring a jacket you'll probably forget to wear when it actually gets cold.",
      "Perfect weather for that 'I just rolled out of bed' aesthetic.",
      "Wear whatever. The lighting is terrible anyway.",
    ],
    rainy: [
      "Waterproof everything, because regular clothes are for optimists.",
      "Embrace the wet dog look. It's very 'authentic'.",
      "Rain boots: Because soggy socks are nobody's friend.",
      "Dark colors to hide the inevitable stains and regret.",
      "An umbrella you'll definitely lose or break within the week.",
    ],
    snowy: [
      "Layer like an onion, cry like one too when you realize how bulky you look.",
      "Waterproof boots, because slipping on ice isn't as graceful as it looks in movies.",
      "Thermal underwear: Sexy? No. Necessary? Unfortunately, yes.",
      "A hat that will give you hat hair for the rest of the day.",
      "Gloves you'll lose one of by the end of the week.",
    ],
  } 
  
//real api calling
  try {
    const aiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (aiApiKey) {
      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${aiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-1.5-flash",
          messages: [
            {
              role: "user",
              content: `Generate sarcastic but helpful fashion advice for ${condition} weather. Keep it witty, under 120 characters, and include practical tips with humor.`,
            },
          ],
          max_tokens: 60,
          temperature: 0.8,
        }),
      })

      if (aiResponse.ok) {
        const aiData = await aiResponse.json()
        const aiAdvice = aiData.choices[0]?.message?.content?.trim()

        if (aiAdvice) {
          return NextResponse.json({
            advice: aiAdvice,
            condition: condition,
            source: "ai",
          })
        }
      }
    }
  } catch (error) {
    console.warn("AI API failed for fashion advice, using fallback:", error)
  }

  const advice = fashionAdvice[condition.toLowerCase()] || ["Wear clothes. Or don't. I'm not your fashion police."]

  const randomAdvice = advice[Math.floor(Math.random() * advice.length)]

  return NextResponse.json({
    advice: randomAdvice,
    condition: condition,
    source: "fallback",
  })
}
