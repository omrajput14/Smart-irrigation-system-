import React from "react"
import { motion } from "framer-motion"
import { Lightbulb, CheckCircle, AlertTriangle, XCircle, Thermometer, CloudRain, Sprout, Zap, Shield, Waves, Battery } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFarm } from "@/context/FarmContext"
import { cn } from "@/lib/utils"

const cV = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } } 
}

const iV = { 
  hidden: { opacity: 0, y: 20 }, 
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } } 
}

export function InsightsPage() {
  const { zones, tankStatus, solarStatus, weatherForecast, loading } = useFarm()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Lightbulb className="h-10 w-10 text-emerald-500 animate-pulse mb-3" />
        <p className="text-sm text-muted-foreground">Gathering farm intelligence...</p>
      </div>
    )
  }

  // Generate dynamic insights
  const insights = []

  // 1. Zone Specific Moisture Insights
  zones.forEach(zone => {
    const isDry = zone.moisture < zone.moisture_threshold
    const isWet = zone.moisture > zone.moisture_threshold + 20
    
    if (isDry) {
      insights.push({
        type: "critical",
        icon: Sprout,
        title: `${zone.name} is Dry`,
        message: `Current moisture is ${zone.moisture}%, which is below the threshold of ${zone.moisture_threshold}%. Crop requires watering.`,
        action: zone.auto_mode ? "Auto irrigation will trigger shortly." : "Activate pump manual override on Control Console."
      })
    } else if (isWet) {
      insights.push({
        type: "warning",
        icon: Sprout,
        title: `${zone.name} Saturated`,
        message: `Moisture is high at ${zone.moisture}% (threshold: ${zone.moisture_threshold}%). Risk of soil over-saturation and root rot.`,
        action: "Avoid extra watering. Ensure crop drainage is clear."
      })
    } else {
      insights.push({
        type: "good",
        icon: Sprout,
        title: `${zone.name} Moisture Healthy`,
        message: `Moisture level is optimal at ${zone.moisture}% (target: ${zone.moisture_threshold}%).`,
        action: "No intervention needed."
      })
    }
  })

  // 2. Weather Temperature Insights
  if (weatherForecast.current_temp > 38) {
    insights.push({
      type: "critical",
      icon: Thermometer,
      title: "Extreme Thermal Stress",
      message: `Extreme high temperature detected at ${weatherForecast.current_temp}°C. Rapid evaporation occurring.`,
      action: "Monitor moisture levels closely and consider secondary shading systems."
    })
  } else if (weatherForecast.current_temp > 32) {
    insights.push({
      type: "warning",
      icon: Thermometer,
      title: "High Evaporative Loss",
      message: `Warm temperature at ${weatherForecast.current_temp}°C increases crop transpiration rate.`,
      action: "Ensure scheduler has adequate water reserves allocated."
    })
  }

  // 3. Rain Bypass Alerts
  if (weatherForecast.rain_expected_6h || weatherForecast.current_rain_prob > 50) {
    insights.push({
      type: "good",
      icon: CloudRain,
      title: "Precipitation Predicted",
      message: `Rain probability is high (${weatherForecast.current_rain_prob}%). Smart weather-aware automation is active.`,
      action: `Auto-scheduler will delay irrigation cycles for the next ${weatherForecast.recommended_delay_hours || 4} hours to save water.`
    })
  }

  // 4. Reservoir Water Safety Warnings
  if (tankStatus.safety_warning !== "NONE" || tankStatus.storage_level_liters < 1200) {
    insights.push({
      type: "critical",
      icon: Waves,
      title: "Low Water Reserves Warning",
      message: `Water tank is low at ${tankStatus.storage_level_liters} Liters (${Math.round((tankStatus.storage_level_liters / tankStatus.storage_capacity_liters)*100)}% capacity).`,
      action: "High pump dry-run damage risk. Limit manual overrides."
    })
  } else {
    insights.push({
      type: "good",
      icon: Waves,
      title: "Reservoir Levels Healthy",
      message: `Water storage contains ${tankStatus.storage_level_liters} Liters of clean solar-pumped water.`,
      action: "Optimal reserves for planned automation cycles."
    })
  }

  // 5. Battery and Energy Status
  if (solarStatus.battery_pct < 35) {
    insights.push({
      type: "warning",
      icon: Battery,
      title: "Battery Reserves Depleted",
      message: `Solar battery cell charge is low at ${solarStatus.battery_pct}%.`,
      action: "Irrigation cycles restricted to peak sunlight to conserve battery, unless grid backup fires."
    })
  } else if (solarStatus.solar_efficiency < 60) {
    insights.push({
      type: "warning",
      icon: Zap,
      title: "Solar Efficiency Warning",
      message: `Solar conversion efficiency dropped to ${solarStatus.solar_efficiency}%. Cloudy sky or dirty panel surfaces.`,
      action: "Inspect solar arrays for dust blockage or bird droppings."
    })
  }

  // Categories helper
  const critical = insights.filter(i => i.type === "critical")
  const warnings = insights.filter(i => i.type === "warning")
  const good = insights.filter(i => i.type === "good")

  const getStyle = (type) => {
    if (type === "critical") return { badge: "bg-red-500/10 text-red-500 dark:bg-red-500/20 border-red-500/30", border: "border-l-red-500 glow-red", Icon: XCircle, ic: "text-red-500" }
    if (type === "warning") return { badge: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 border-amber-500/30", border: "border-l-amber-500 glow-yellow", Icon: AlertTriangle, ic: "text-amber-500" }
    return { badge: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 border-emerald-500/30", border: "border-l-emerald-500 glow-green", Icon: CheckCircle, ic: "text-emerald-500" }
  }

  return (
    <motion.div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6" initial="hidden" animate="visible" variants={cV}>
      <motion.div variants={iV} className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2.5">
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <Lightbulb className="h-8 w-8 text-emerald-500 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </motion.div>
            Smart Diagnostics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI-compiled agronomic insights from real-time telemetry</p>
        </div>
      </motion.div>

      {/* Stats Summary Tabs */}
      <motion.div className="flex gap-2 flex-wrap" variants={iV}>
        {critical.length > 0 && (
          <Badge className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-full px-3 py-1 text-xs font-semibold animate-pulse-glow neon-glow-rose">
            🔴 {critical.length} Critical Alert{critical.length > 1 ? 's' : ''}
          </Badge>
        )}
        {warnings.length > 0 && (
          <Badge className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 text-xs font-semibold neon-glow-indigo">
            ⚠️ {warnings.length} Attention Warning{warnings.length > 1 ? 's' : ''}
          </Badge>
        )}
        <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-semibold neon-glow-emerald">
          🟢 {good.length} Healthy State{good.length > 1 ? 's' : ''}
        </Badge>
      </motion.div>

      {/* Insights List */}
      <motion.div className="space-y-4" variants={cV}>
        {insights.map((ins, idx) => {
          const s = getStyle(ins.type)
          return (
            <motion.div key={idx} variants={iV} whileHover={{ x: 6 }} className="w-full">
              <Card className={cn(
                "border-none glass-container border-l-4 transition-all duration-300 sensor-card-glow overflow-hidden", 
                s.border
              )}>
                <CardContent className="p-5 flex items-start gap-4">
                  <motion.div 
                    className="mt-0.5 p-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/40 flex-shrink-0"
                    animate={ins.type === "critical" ? { scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 0px rgba(239,68,68,0))", "drop-shadow(0 0 8px rgba(239,68,68,0.5))", "drop-shadow(0 0 0px rgba(239,68,68,0))"] } : {}}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  >
                    <s.Icon className={`h-6 w-6 ${s.ic}`} />
                  </motion.div>
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <ins.icon className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">{ins.title}</h3>
                      <Badge variant="outline" className={cn("text-[9px] font-extrabold uppercase rounded px-1.5 py-0.5", s.badge)}>{ins.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ins.message}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1.5">
                      <span>💡 Advice:</span>
                      <span className="font-semibold">{ins.action}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
