"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Settings, Trash2, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react"

interface NotificationToastProps {
  condition?: string
}

interface NotificationLog {
  message: string
  timestamp: number
  condition: string
  rating?: number
}

export function NotificationToast({ condition }: NotificationToastProps) {
  const { toast } = useToast()
  const [lastNotification, setLastNotification] = useState<number>(0)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [notificationLog, setNotificationLog] = useState<NotificationLog[]>([])
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    if (!condition || !notificationsEnabled) return

    const showRandomNotification = async () => {
      try {
        const response = await fetch(`/api/notifications?condition=${condition}`)
        const data = await response.json()

        const notification: NotificationLog = {
          message: data.message,
          timestamp: Date.now(),
          condition: condition,
        }

        // Add to log
        setNotificationLog((prev) => [notification, ...prev.slice(0, 9)])
        setNotificationCount((prev) => prev + 1)

        toast({
          title: "🌤️ Weather Reality Check",
          description: data.message,
          duration: 8000,
        })

        setLastNotification(Date.now())
      } catch (error) {
        console.error("Failed to fetch notification:", error)
        toast({
          title: "❌ Notification Error",
          description: "Failed to fetch weather notification. Check your connection.",
          duration: 5000,
        })
      }
    }

    const initialTimeout = setTimeout(() => {
      showRandomNotification()
    }, 10000)

    const interval = setInterval(() => {
      const timeSinceLastNotification = Date.now() - lastNotification
      const shouldShow = Math.random() > 0.3 && timeSinceLastNotification > 30000

      if (shouldShow) {
        showRandomNotification()
      }
    }, 10000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [condition, toast, lastNotification, notificationsEnabled])

  const toggleNotifications = () => {
    const newState = !notificationsEnabled
    setNotificationsEnabled(newState)

    if (newState && condition) {
      setTimeout(async () => {
        try {
          const response = await fetch(`/api/notifications?condition=${condition}`)
          const data = await response.json()
          toast({
            title: "🎉 Notifications Re-enabled!",
            description: data.message,
            duration: 6000,
          })
        } catch (error) {
          console.error("Failed to fetch welcome notification:", error)
        }
      }, 1000)
    }

    toast({
      title: newState ? "🔔 Notifications Enabled" : "🔕 Notifications Disabled",
      description: newState
        ? "Welcome back to the reality checks! First one coming up... 🎉"
        : "You'll miss out on my brilliant observations. 😢",
      duration: 4000,
    })
  }

  const rateNotification = (index: number, rating: number) => {
    setNotificationLog((prev) => prev.map((notif, i) => (i === index ? { ...notif, rating } : notif)))
  }

  const clearNotificationLog = () => {
    setNotificationLog([])
    setNotificationCount(0)
    toast({
      title: "🗑️ Notification History Cleared",
      description: "Starting fresh with a clean slate of sarcasm. ✨",
      duration: 2000,
    })
  }

  const triggerTestNotification = async () => {
    if (!condition) return

    try {
      const response = await fetch(`/api/notifications?condition=${condition}`)
      const data = await response.json()

      toast({
        title: "🧪 Test Notification",
        description: data.message,
        duration: 5000,
      })

      const testNotification: NotificationLog = {
        message: `[TEST] ${data.message}`,
        timestamp: Date.now(),
        condition: condition,
      }
      setNotificationLog((prev) => [testNotification, ...prev.slice(0, 9)])
      setNotificationCount((prev) => prev + 1)
    } catch (error) {
      toast({
        title: "💥 Test Failed",
        description: "Even the test notifications are broken. How fitting. 🤷‍♂️",
        duration: 3000,
      })
    }
  }

  return (
    <Card className="glass-effect shadow-lg border-border/50 bg-card/50 dark:bg-card/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          {notificationsEnabled ? (
            <Bell className="w-5 h-5 text-accent" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground" />
          )}
          🔔 Notification Center
          {notificationCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              📊 {notificationCount} sent
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-8">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={notificationsEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleNotifications}
            className="flex items-center gap-2 modern-glow"
          >
            {notificationsEnabled ? (
              <>
                <Bell className="w-4 h-4" />🔔 Enabled
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4" />🔔 Disabled
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={triggerTestNotification}
            className="flex items-center gap-2 bg-transparent hover:bg-accent"
          >
            <Settings className="w-4 h-4" />🧪 Test
          </Button>

          {notificationLog.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearNotificationLog}
              className="flex items-center gap-2 bg-transparent hover:bg-accent"
            >
              <Trash2 className="w-4 h-4" />
              🗑️ Clear
            </Button>
          )}
        </div>

        <Card className="bg-accent/20 dark:bg-accent/10 border-accent/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-card-foreground">
                {notificationsEnabled ? "🟢 Status: Active" : "🔴 Status: Disabled"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {notificationsEnabled
                ? "Notifications are active. Expect periodic reality checks about the weather and your life choices. 😏 (First one in ~10 seconds!)"
                : "Notifications are disabled. You're missing out on valuable sarcastic insights. 😢"}
            </p>
          </CardContent>
        </Card>

        {notificationLog.length > 0 && (
          <div className="border-t border-border pt-4 space-y-2">
            <h4 className="text-sm font-medium text-card-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />📋 Recent Reality Checks
            </h4>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {notificationLog.map((notification, index) => (
                <Card key={index} className="bg-accent/10 dark:bg-accent/5 border-border/50">
                  <CardContent className="p-3 space-y-2">
                    <p className="text-sm text-card-foreground leading-relaxed">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        🌤️ {notification.condition}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        🕐 {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="border-t border-border pt-2">
                      <p className="text-xs text-muted-foreground mb-1">How sassy was this? 🤔</p>
                      <div className="flex gap-1">
                        <Button
                          variant={notification.rating === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => rateNotification(index, 1)}
                          className="flex items-center gap-1 text-xs h-6 px-2"
                        >
                          <ThumbsDown className="w-3 h-3" />😴
                        </Button>
                        <Button
                          variant={notification.rating === 2 ? "default" : "outline"}
                          size="sm"
                          onClick={() => rateNotification(index, 2)}
                          className="flex items-center gap-1 text-xs h-6 px-2"
                        >
                          <ThumbsUp className="w-3 h-3" />🔥
                        </Button>
                      </div>

                      {notification.rating && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.rating === 1
                            ? "I'll be more sarcastic next time! 😈"
                            : "Glad you enjoyed the sass! 😎"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center border-t border-border pt-2">
          🔔 Automatic weather reality checks • 😏 Sarcasm included at no extra charge • 🎭 Entertainment guaranteed
        </p>
      </CardContent>
    </Card>
  )
}
