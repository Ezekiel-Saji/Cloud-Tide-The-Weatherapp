import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "I Told You So Weather - Brutally Honest Weather App",
  description:
    "The weather app that's brutally honest about your choices. Get sarcastic weather updates, travel suggestions, and fashion advice.",
  generator: "v0.app",
  keywords: ["weather", "sarcastic", "funny", "travel", "fashion", "advice"],
  authors: [{ name: "v0" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            {children}
            <Toaster />
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
