import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const condition = searchParams.get("condition") || "unknown"

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
              content: `Generate a sarcastic, witty remark about ${condition} weather. Keep it under 100 characters and make it funny but not offensive.`,
            },
          ],
          max_tokens: 50,
          temperature: 0.9,
        }),
      })

      if (aiResponse.ok) {
        const aiData = await aiResponse.json()
        const aiRemark = aiData.choices[0]?.message?.content?.trim()

        if (aiRemark) {
          return NextResponse.json({
            remark: aiRemark,
            condition: condition,
            source: "ai",
          })
        }
      }
    }
  } catch (error) {
    console.warn("AI API failed, using fallback remarks:", error)
  }

  const sarcasticRemarks = {
    sunny: [
      "Oh great, another perfect day to make everyone else feel bad about staying indoors.",
      "Wonderful! Time for everyone to pretend they love outdoor activities.",
      "Perfect weather for realizing you have no plans and nowhere to go.",
      "Ah yes, the sun is out. Time for your vitamin D deficiency to judge you.",
    ],
    cloudy: [
      "Gray skies to match your mood. How poetic.",
      "The weather is as indecisive as you are about your life choices.",
      "Cloudy with a chance of existential dread.",
      "Even the sky can't be bothered to make an effort today.",
    ],
    rainy: [
      "Perfect weather for staying inside and questioning your life decisions.",
      "Mother Nature decided to cry today. Join the club.",
      "Great! Now you have an excuse for not going to the gym.",
      "Rain: Nature's way of telling you to stay home and binge-watch shows.",
    ],
    snowy: [
      "Snow day! Time to act surprised like you didn't see the forecast.",
      "Winter wonderland or frozen wasteland? You decide.",
      "Perfect weather for realizing you don't own proper winter clothes.",
      "Snow: Because regular cold wasn't miserable enough.",
    ],
  }

  const remarks = sarcasticRemarks[condition.toLowerCase()] || [
    "I can't even come up with a sarcastic comment for whatever this weather is supposed to be.",
  ]

  const randomRemark = remarks[Math.floor(Math.random() * remarks.length)]

  return NextResponse.json({
    remark: randomRemark,
    condition: condition,
    source: "fallback",
  })
}
