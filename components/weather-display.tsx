import { Cloud, Sun, CloudRain, CloudSnow, Droplets, Wind } from "lucide-react"

interface WeatherData {
  temp: number
  condition: string
  description?: string
  humidity?: number
  windSpeed?: number
}

interface WeatherDisplayProps {
  data: WeatherData | null
  loading: boolean
}

export function WeatherDisplay({ data, loading }: WeatherDisplayProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading weather data...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load weather data</p>
      </div>
    )
  }

  const getMoodIcon = (condition: string) => {
    const iconClass = "w-16 h-16 mx-auto mb-4"

    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className={`${iconClass} text-yellow-500`} />
      case "cloudy":
        return <Cloud className={`${iconClass} text-gray-400`} />
      case "rainy":
        return <CloudRain className={`${iconClass} text-blue-500`} />
      case "snowy":
        return <CloudSnow className={`${iconClass} text-blue-200`} />
      default:
        return <Cloud className={`${iconClass} text-gray-400`} />
    }
  }

  return (
    <div className="text-center">
      {getMoodIcon(data.condition)}

      <div className="space-y-4">
        <div className="text-5xl font-bold text-primary">{data.temp}°C</div>

        <div className="text-xl text-secondary-foreground capitalize">{data.condition}</div>

        {data.description && <div className="text-sm text-muted-foreground capitalize">{data.description}</div>}

        {(data.humidity || data.windSpeed) && (
          <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
            {data.humidity && (
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4" />
                <span>{data.humidity}%</span>
              </div>
            )}
            {data.windSpeed && (
              <div className="flex items-center gap-1">
                <Wind className="w-4 h-4" />
                <span>{data.windSpeed} m/s</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
