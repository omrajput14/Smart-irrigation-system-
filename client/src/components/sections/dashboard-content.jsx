import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Thermometer,
  Sprout,
  Sun,
  RefreshCw,
  Power,
  Wifi,
  WifiOff,
  CloudRain,
  Clock,
  Zap,
  CloudOff,
  Battery,
  BatteryCharging,
  Waves,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Cpu,
  TrendingUp,
  Settings,
  ShieldCheck,
  Shield
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
// Using custom inputs for range selection
import { Switch } from "@/components/ui/switch"
import { HistoryChart, EnergyConsumptionChart, WaterUsageBarChart, AnimatedTooltip } from "@/components/sections/history-chart"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from "recharts"
import { DigitalTwin } from "@/components/sections/digital-twin"
import { VoiceAssistant } from "@/components/sections/voice-assistant"
import { useFarm } from "@/context/FarmContext"
import { cn } from "@/lib/utils"

// Framer motion animation configs
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
}

// Helper to render high-fidelity custom SVG vectors for crops
const renderCropVector = (cropType) => {
  const normalized = cropType ? cropType.toLowerCase() : "";
  if (normalized.includes("banana")) {
    return (
      <span className="flex-shrink-0 mr-1.5">
        <svg viewBox="0 0 24 24" className="h-6 w-6 filter drop-shadow-[0_1px_3px_rgba(22,163,74,0.2)] animate-sway">
          <path d="M2 22 Q 10 18 22 2" fill="none" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M2 22 Q 5 11 22 2 Q 14 16 2 22" fill="#22c55e" opacity="0.95" />
          <path d="M2 22 Q 13 19 22 2 Q 9 8 2 22" fill="#15803d" opacity="0.85" />
          <path d="M5 18 L 8 18 M8 14 L 11 13 M11 10 L 14 9" stroke="#bbf7d0" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
          <path d="M9 20 L 11 19 M13 16 L 15 15 M17 12 L 19 11" stroke="#86efac" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
        </svg>
      </span>
    )
  }
  if (normalized.includes("tomato")) {
    return (
      <span className="flex-shrink-0 mr-1.5">
        <svg viewBox="0 0 24 24" className="h-6 w-6 filter drop-shadow-[0_1px_3px_rgba(239,68,68,0.2)] animate-sway-delayed">
          <path d="M12 2 Q 11 8 8 12 Q 14 14 12 22" fill="none" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="14" r="5.5" fill="#ef4444" />
          <circle cx="6.5" cy="12.5" r="1.5" fill="#fca5a5" opacity="0.75" />
          <circle cx="16" cy="11" r="4.5" fill="#ea580c" />
          <circle cx="15" cy="9.8" r="1.2" fill="#ffedd5" opacity="0.8" />
          <path d="M8 8.5 L 6.5 7.5 M8 8.5 L 8 6.5 M8 8.5 L 9.5 7.5" stroke="#166534" strokeWidth="1" />
          <path d="M16 6.5 L 14.8 5.5 M16 6.5 L 16 4.5 M16 6.5 L 17.2 5.5" stroke="#166534" strokeWidth="1" />
        </svg>
      </span>
    )
  }
  if (normalized.includes("sugarcane")) {
    return (
      <span className="flex-shrink-0 mr-1.5">
        <svg viewBox="0 0 24 24" className="h-6 w-6 filter drop-shadow-[0_1px_3px_rgba(34,197,94,0.2)] animate-sway">
          <rect x="5" y="6" width="2.5" height="16" fill="#15803d" rx="0.5" stroke="#14532d" strokeWidth="0.5" />
          <line x1="5" y1="11" x2="7.5" y2="11" stroke="#166534" strokeWidth="0.8" />
          <line x1="5" y1="16" x2="7.5" y2="16" stroke="#166534" strokeWidth="0.8" />
          <rect x="11" y="2" width="3" height="20" fill="#16a34a" rx="0.5" stroke="#14532d" strokeWidth="0.5" />
          <line x1="11" y1="7" x2="14" y2="7" stroke="#15803d" strokeWidth="0.8" />
          <line x1="11" y1="12" x2="14" y2="12" stroke="#15803d" strokeWidth="0.8" />
          <line x1="11" y1="17" x2="14" y2="17" stroke="#15803d" strokeWidth="0.8" />
          <rect x="17" y="8" width="2" height="14" fill="#22c55e" rx="0.5" stroke="#14532d" strokeWidth="0.5" />
          <line x1="17" y1="13" x2="19" y2="13" stroke="#16a34a" strokeWidth="0.8" />
          <line x1="17" y1="17" x2="19" y2="17" stroke="#16a34a" strokeWidth="0.8" />
          <path d="M12.5 2 Q 8 0 4 3 M12.5 2 Q 17 0 21 3" fill="none" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6.2 6 Q 3 4 1 6 M18 8 Q 21 7 23 9" fill="none" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
    )
  }
  return (
    <span className="flex-shrink-0 mr-1.5">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-500 animate-sway">
        <path d="M12 22 V 10 M12 10 Q 7 7 3 12 Q 9 12 12 10 M12 10 Q 17 7 21 12 Q 15 12 12 10" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

// Generate 6 moisture history values leading to current value for sparkline
const getSparklineData = (currentVal, zoneId) => {
  const base = parseInt(String(zoneId).replace(/\D/g, "")) || 3;
  const seed = (currentVal * base) % 9;
  return [
    { val: Math.max(10, Math.min(95, currentVal - 14 + seed)) },
    { val: Math.max(10, Math.min(95, currentVal - 7 - seed)) },
    { val: Math.max(10, Math.min(95, currentVal + 6 - seed)) },
    { val: Math.max(10, Math.min(95, currentVal - 3 + seed)) },
    { val: Math.max(10, Math.min(95, currentVal - 9 + seed)) },
    { val: currentVal }
  ];
}


export function DashboardContent() {
  const {
    zones,
    tankStatus,
    solarStatus,
    weatherForecast,
    waterSavings,
    history,
    aiRecommendations,
    aiLoading,
    moistureForecast,
    loading,
    triggerZoneIrrigation,
    updateZoneConfig,
    fetchAICropRecommendations,
    refreshData
  } = useFarm()

  const [activeTab, setActiveTab] = useState("live")
  
  // Crop Recommender input states
  const [soilType, setSoilType] = useState("Loam")
  const [targetTemp, setTargetTemp] = useState(28)
  const [targetMoist, setTargetMoist] = useState(42)
  const [targetRain, setTargetRain] = useState(650)

  // Smart battery rules toggles
  const [rulesEnabled, setRulesEnabled] = useState(true)

  const handleRecommendationSubmit = (e) => {
    e.preventDefault()
    fetchAICropRecommendations(soilType, targetMoist, targetTemp, targetRain)
  }

  // Visual Helper for battery icon
  const getBatteryIcon = (pct) => {
    if (pct < 20) return <Battery className="h-5 w-5 text-red-500" />
    if (pct < 60) return <Battery className="h-5 w-5 text-amber-500" />
    return <Battery className="h-5 w-5 text-green-500" />
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-150 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-header font-black tracking-tight bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-700 dark:from-emerald-400 dark:via-emerald-500 dark:to-amber-500 bg-clip-text text-transparent">
            Farm Intelligence Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Smart Irrigation & Renewable Solar Energy Management (v2)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className={cn(
            "flex items-center gap-1.5 px-3 py-1 border-0 shadow-sm font-header text-[10px] uppercase tracking-wider",
            !loading 
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" 
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
          )}>
            {!loading ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5 animate-pulse" />}
            {!loading ? "System Online" : "Syncing Blynk..."}
          </Badge>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 font-telemetry">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {new Date().toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
            className="h-9 transition-all hover:bg-gray-100 dark:hover:bg-gray-850 font-header text-xs uppercase tracking-wider"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2 text-primary", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── TAB SELECTOR ── */}
      <Tabs defaultValue="live" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex justify-start">
          <TabsList className="bg-gray-105 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800 p-1 rounded-xl">
            <TabsTrigger value="live" className="font-header rounded-lg text-[10px] uppercase tracking-wider px-3 sm:px-4 py-2">Live Operations ⚙️</TabsTrigger>
            <TabsTrigger value="control" className="font-header rounded-lg text-[10px] uppercase tracking-wider px-3 sm:px-4 py-2">Control Console 🎛️</TabsTrigger>
            <TabsTrigger value="analytics" className="font-header rounded-lg text-[10px] uppercase tracking-wider px-3 sm:px-4 py-2">Analytics 📊</TabsTrigger>
            <TabsTrigger value="intelligence" className="font-header rounded-lg text-[10px] uppercase tracking-wider px-3 sm:px-4 py-2">Farm AI 🧠</TabsTrigger>
            <TabsTrigger value="digital-twin" className="font-header rounded-lg text-[10px] uppercase tracking-wider px-3 sm:px-4 py-2">Digital Twin 🗺️</TabsTrigger>
            <TabsTrigger value="voice" className="font-header rounded-lg text-[10px] uppercase tracking-wider px-3 sm:px-4 py-2">Voice Assistant 🎙️</TabsTrigger>
          </TabsList>
        </div>

        {/* ── TAB 1: LIVE OPERATIONS ── */}
        <TabsContent value="live" className="space-y-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* 3D Water Reservoirs Level Card */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="border-none glass-container soil-texture-glow h-full flex flex-col justify-between overflow-hidden relative">
                <CardHeader className="pb-2 z-10">
                  <CardTitle className="font-header flex items-center gap-2 text-base font-bold text-foreground">
                    <Waves className="h-5 w-5 text-primary animate-pulse" />
                    Water Reservoirs
                  </CardTitle>
                  <CardDescription>Visual storage tank & aquifer state</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-6 flex-1 justify-center z-10">
                  {/* Detailed SVG Fluid Tank Graphic */}
                  <div className="relative w-36 h-48 flex items-center justify-center mb-5">
                    <svg className="w-full h-full" viewBox="0 0 160 200">
                      <rect x="30" y="20" width="100" height="160" rx="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" className="dark:stroke-white/10 stroke-slate-900/10" />
                      <rect x="33" y="23" width="94" height="154" rx="17" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" className="dark:stroke-white/5 stroke-slate-900/5" />
                      
                      <line x1="30" y1="36" x2="38" y2="36" stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="2" />
                      <text x="10" y="40" className="fill-slate-400 dark:fill-slate-500 text-[9px] font-bold font-telemetry">5.0k L</text>
                      <line x1="30" y1="68" x2="35" y2="68" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="1.5" />
                      <line x1="30" y1="100" x2="38" y2="100" stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="2" />
                      <text x="10" y="104" className="fill-slate-400 dark:fill-slate-500 text-[9px] font-bold font-telemetry">2.5k L</text>
                      <line x1="30" y1="132" x2="35" y2="132" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="1.5" />
                      <line x1="30" y1="164" x2="38" y2="164" stroke="currentColor" className="text-slate-400 dark:text-slate-600" strokeWidth="2" />
                      <text x="16" y="168" className="fill-slate-400 dark:fill-slate-500 text-[9px] font-bold font-telemetry">0 L</text>
                      
                      <defs>
                        <clipPath id="tank-clip">
                          <rect x="32" y="22" width="96" height="156" rx="18" />
                        </clipPath>
                        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="60%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#0369a1" />
                        </linearGradient>
                      </defs>
                      
                      <g clipPath="url(#tank-clip)">
                        <path 
                          d={`M 30,${180 - (tankStatus.storage_level_liters / tankStatus.storage_capacity_liters) * 150} 
                              Q 55,${180 - (tankStatus.storage_level_liters / tankStatus.storage_capacity_liters) * 150 - 4} 80,${180 - (tankStatus.storage_level_liters / tankStatus.storage_capacity_liters) * 150}
                              T 130,${180 - (tankStatus.storage_level_liters / tankStatus.storage_capacity_liters) * 150} 
                              L 130,200 L 30,200 Z`} 
                          fill="url(#waterGrad)"
                          className="animate-water-wave"
                        />
                        {tankStatus.borewell_status === "ACTIVE" && (
                          <>
                            <circle cx="50" cy="150" r="2.5" fill="rgba(255,255,255,0.4)" className="animate-bubble-rise-slow" />
                            <circle cx="70" cy="130" r="1.5" fill="rgba(255,255,255,0.5)" className="animate-bubble-rise-fast" />
                            <circle cx="95" cy="160" r="2.5" fill="rgba(255,255,255,0.3)" className="animate-bubble-rise-medium" />
                            <circle cx="80" cy="110" r="1" fill="rgba(255,255,255,0.6)" className="animate-bubble-rise-fast" />
                          </>
                        )}
                      </g>
                      
                      <path d="M 80,5 L 80,20" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="5" strokeLinecap="round" />
                      <path d="M 80,5 L 80,20" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" className={cn("transition-opacity duration-300", tankStatus.borewell_status === "ACTIVE" ? "opacity-100" : "opacity-0")} />
                      
                      {tankStatus.borewell_status === "ACTIVE" && (
                        <circle cx="80" cy="26" r="2" fill="#38bdf8" className="animate-drip" />
                      )}
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                      <span className="text-2xl font-bold font-telemetry text-slate-800 dark:text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                        {Math.round((tankStatus.storage_level_liters / tankStatus.storage_capacity_liters) * 100)}%
                      </span>
                      <span className="text-[10px] text-slate-700/80 dark:text-white/80 font-telemetry font-bold mt-0.5">
                        {tankStatus.storage_level_liters} L
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-3 px-2">
                    <div className="flex justify-between text-xs p-2 rounded-lg bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-white/5">
                      <span className="text-muted-foreground flex items-center gap-1.5">Borewell Pump:</span>
                      <Badge className={cn(
                        "rounded-full text-[10px]",
                        tankStatus.borewell_status === "ACTIVE" 
                          ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400" 
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      )}>
                        {tankStatus.borewell_status}
                      </Badge>
                    </div>
                    {tankStatus.safety_warning !== "NONE" && (
                      <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>Low reservoir level. High pump dry-run damage risk!</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Solar Power & Energy Optimizations Card */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="border-none glass-container h-full flex flex-col justify-between overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Sun className="h-5 w-5 text-yellow-500 animate-sun-spin" />
                    Solar Energy System
                  </CardTitle>
                  <CardDescription>Power distribution & efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-between py-4 flex-1">
                  {/* Premium Power Flow Diagram */}
                  <div className="relative w-full h-40 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 280 140">
                      <defs>
                        <linearGradient id="solarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                        <linearGradient id="batteryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="pumpGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                        </filter>
                      </defs>

                      {/* --- FLOW PATHS --- */}
                      
                      {/* Solar Panel -> Battery Path */}
                      <path 
                        d="M 58 80 L 112 80" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.1)" 
                        className="dark:stroke-white/10 stroke-slate-900/10"
                        strokeWidth="3.5" 
                      />
                      {(solarStatus.solar_output_watts > 10 || solarStatus.charging) && (
                        <>
                          <path 
                            d="M 58 80 L 112 80" 
                            fill="none" 
                            stroke="url(#solarGlow)" 
                            strokeWidth="2" 
                          />
                          <g style={{ transformOrigin: "58px 80px" }}>
                            <circle cx="58" cy="80" r="3" fill="#fbbf24" className="animate-solar-flow-1 filter drop-shadow-[0_0_2px_#f59e0b]" />
                            <circle cx="58" cy="80" r="2.5" fill="#fbbf24" className="animate-solar-flow-2 filter drop-shadow-[0_0_2px_#f59e0b]" />
                            <circle cx="58" cy="80" r="2" fill="#fbbf24" className="animate-solar-flow-3 filter drop-shadow-[0_0_2px_#f59e0b]" />
                          </g>
                        </>
                      )}

                      {/* Grid -> Battery Path (Top to Center) */}
                      {solarStatus.grid_backup_active && (
                        <>
                          <path 
                            d="M 140 40 L 140 52" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.1)" 
                            className="dark:stroke-white/10 stroke-slate-900/10"
                            strokeWidth="3.5" 
                          />
                          <path 
                            d="M 140 40 L 140 52" 
                            fill="none" 
                            stroke="#c084fc" 
                            strokeWidth="2.5" 
                            className="animate-flow-forward" 
                          />
                        </>
                      )}

                      {/* Battery -> Pump Load Path */}
                      <path 
                        d="M 168 80 L 222 80" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.1)" 
                        className="dark:stroke-white/10 stroke-slate-900/10"
                        strokeWidth="3.5" 
                      />
                      {(zones.some(z => z.pump_status === "ON") || tankStatus.borewell_status === "ACTIVE") && (
                        <path 
                          d="M 168 80 L 222 80" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="2.5" 
                          className="animate-flow-forward" 
                        />
                      )}

                      {/* --- NODES --- */}

                      {/* Solar Panel Node */}
                      <g>
                        <circle cx="40" cy="80" r="18" fill="url(#solarGlow)" filter="url(#shadow)" className="transition-all duration-300" />
                        <g stroke="white" strokeWidth="1.5" fill="none" transform="translate(32, 72)">
                          <rect x="0" y="0" width="16" height="16" rx="1.5" />
                          <line x1="8" y1="0" x2="8" y2="16" />
                          <line x1="0" y1="8" x2="16" y2="8" />
                          <line x1="0" y1="3" x2="16" y2="13" />
                        </g>
                        <text x="40" y="112" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[10px] font-black">SOLAR</text>
                      </g>

                      {/* Grid Node (Top Center) */}
                      {solarStatus.grid_backup_active && (
                        <g>
                          <circle cx="140" cy="22" r="14" fill="#a855f7" filter="url(#shadow)" />
                          <path d="M140 12 L135 22 L139 22 L137 31 L146 20 L141 20 Z" fill="white" />
                          <text x="140" y="4" textAnchor="middle" className="fill-purple-500 dark:fill-purple-400 text-[8px] font-black">GRID BACKUP</text>
                        </g>
                      )}

                      {/* Battery Node (Center) */}
                      <g>
                        <circle cx="140" cy="80" r="27" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 8" className="animate-spin-slow opacity-60" />
                        <circle cx="140" cy="80" r="23" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 6" className="animate-spin-reverse-slow opacity-60" />
                        
                        <circle cx="140" cy="80" r="18" fill="url(#batteryGlow)" filter="url(#shadow)" />
                        <text x="140" y="84" textAnchor="middle" className="fill-white text-[10px] font-extrabold">{solarStatus.battery_pct}%</text>
                        <text x="140" y="120" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[10px] font-black">BATTERY</text>
                      </g>

                      {/* Pump Load Node */}
                      <g>
                        <circle cx="240" cy="80" r="18" fill="url(#pumpGlow)" filter="url(#shadow)" />
                        <g 
                          transform="translate(240, 80)"
                          className={cn(
                            (zones.some(z => z.pump_status === "ON") || tankStatus.borewell_status === "ACTIVE") && "animate-pump-spin"
                          )}
                          style={{ transformOrigin: "0px 0px" }}
                        >
                          <circle cx="0" cy="0" r="3" fill="white" />
                          <path d="M 0,-3 C 4,-10 10,-10 6,-3 Z" fill="white" opacity="0.9" />
                          <path d="M 3,0 C 10,4 10,10 3,6 Z" fill="white" opacity="0.9" />
                          <path d="M 0,3 C -4,10 -10,10 -6,3 Z" fill="white" opacity="0.9" />
                          <path d="M -3,0 C -10,-4 -10,-10 -3,-6 Z" fill="white" opacity="0.9" />
                        </g>
                        <text x="240" y="112" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[10px] font-black">LOAD</text>
                      </g>
                    </svg>
                  </div>

                  <div className="w-full space-y-3 px-2 mt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Current Solar Generation:</span>
                      <span className="font-bold text-gray-800 dark:text-white">{solarStatus.solar_output_watts} Watts</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Solar Efficiency Ratio:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{solarStatus.solar_efficiency}%</span>
                    </div>
                    {solarStatus.grid_backup_active && (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 w-full justify-center">
                        ⚡ Grid Backup Power Active
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Meteorological Weather-Aware Engine Card */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="border-none glass-container h-full flex flex-col justify-between overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <CloudRain className="h-5 w-5 text-indigo-500" />
                    Weather-Aware Engine
                  </CardTitle>
                  <CardDescription>Meteorological forecast triggers</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-between py-4 flex-1">
                  {/* Detailed SVG Farm Landscape Panel */}
                  <div className="w-full h-36 relative overflow-hidden rounded-xl border border-white/20 dark:border-white/5 shadow-inner">
                    <svg className="w-full h-full" viewBox="0 0 280 140" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="skySunny" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#bae6fd" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                        <linearGradient id="skyRainy" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#475569" />
                          <stop offset="100%" stopColor="#1e293b" />
                        </linearGradient>
                        <linearGradient id="hillBack" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#166534" />
                          <stop offset="100%" stopColor="#14532d" />
                        </linearGradient>
                        <linearGradient id="hillFront" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#166534" />
                        </linearGradient>
                        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.2" />
                        </filter>
                      </defs>

                      {/* Sky Background */}
                      <rect 
                        x="0" 
                        y="0" 
                        width="280" 
                        height="140" 
                        fill={(weatherForecast.rain_expected_6h || weatherForecast.current_rain_prob > 40) ? "url(#skyRainy)" : "url(#skySunny)"} 
                        className="transition-all duration-500" 
                      />

                      {/* Sun (Sunny State) */}
                      {!(weatherForecast.rain_expected_6h || weatherForecast.current_rain_prob > 40) && (
                        <g transform="translate(45, 35)">
                          <circle cx="0" cy="0" r="16" fill="#fbbf24" className="animate-sun-spin" />
                          <circle cx="0" cy="0" r="22" fill="rgba(251, 191, 36, 0.25)" className="animate-pulse" />
                        </g>
                      )}

                      {/* Rain Drops (Rainy State) */}
                      {(weatherForecast.rain_expected_6h || weatherForecast.current_rain_prob > 40) && (
                        <g className="text-blue-300/60 dark:text-blue-400/40">
                          <line x1="30" y1="-10" x2="15" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 12" className="animate-rain-fall" style={{ animationDelay: '0s' }} />
                          <line x1="80" y1="-10" x2="65" y2="150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 12" className="animate-rain-fall" style={{ animationDelay: '0.2s' }} />
                          <line x1="130" y1="-10" x2="115" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 12" className="animate-rain-fall" style={{ animationDelay: '0.4s' }} />
                          <line x1="180" y1="-10" x2="165" y2="150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 12" className="animate-rain-fall" style={{ animationDelay: '0.1s' }} />
                          <line x1="230" y1="-10" x2="215" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 12" className="animate-rain-fall" style={{ animationDelay: '0.3s' }} />
                          <line x1="270" y1="-10" x2="255" y2="150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 12" className="animate-rain-fall" style={{ animationDelay: '0.5s' }} />
                        </g>
                      )}

                      {/* Back Hill */}
                      <path d="M -10,140 L -10,105 Q 60,75 140,100 T 290,95 L 290,140 Z" fill="url(#hillBack)" />

                      {/* Front Hill */}
                      <path d="M -10,140 L -10,120 Q 80,95 180,115 T 290,110 L 290,140 Z" fill="url(#hillFront)" />

                      {/* Sprinkler Setup */}
                      <g transform="translate(180, 115)">
                        <rect x="-2" y="0" width="4" height="15" fill="#475569" />
                        <rect x="-4" y="-3" width="8" height="4" fill="#334155" />
                        {/* Sprinkler Active Spraying water drops */}
                        {(zones.some(z => z.pump_status === "ON") || tankStatus.borewell_status === "ACTIVE") && (
                          <g stroke="#7dd3fc" strokeWidth="1" fill="none" opacity="0.8">
                            <path d="M -4,-3 Q -15,-18 -30,-10" strokeDasharray="3 3" className="animate-flow-reverse" />
                            <path d="M 4,-3 Q 15,-18 30,-10" strokeDasharray="3 3" className="animate-flow-forward" />
                            <path d="M -2,-3 Q -8,-25 -20,-22" strokeDasharray="3 3" className="animate-flow-reverse" />
                            <path d="M 2,-3 Q 8,-25 20,-22" strokeDasharray="3 3" className="animate-flow-forward" />
                          </g>
                        )}
                      </g>

                      {/* Clouds */}
                      <g className="animate-cloud-drift">
                        <path d="M 90,30 C 85,30 80,34 80,39 C 80,39.5 80.2,40 80.3,40.5 C 78,41.5 76.5,43.5 76.5,46 C 76.5,49.5 79.5,52 83,52 L 105,52 C 108.5,52 111,49.5 111,46 C 111,43 109,41 106.5,40.5 C 106.3,35 102,30 96.5,30 C 94,30 91.5,31 90,30 Z" fill="rgba(255,255,255,0.85)" filter="url(#shadow)" />
                        {(weatherForecast.rain_expected_6h || weatherForecast.current_rain_prob > 40) && (
                          <path d="M 160,20 C 155,20 151,24 151,29 C 151,29.5 151.2,30 151.3,30.5 C 149,31.5 147.5,33.5 147.5,36 C 147.5,39.5 150.5,42 154,42 L 180,42 C 183.5,42 186,39.5 186,36 C 186,33 184,31 181.5,30.5 C 181.3,25 177,20 171.5,20 C 169,20 166.5,21 165,20 Z" fill="rgba(203,213,225,0.85)" />
                        )}
                      </g>
                    </svg>
                    
                    {/* Temperature overlay tag */}
                    <div className="absolute bottom-2 left-2 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-white/10 flex items-center gap-1.5 shadow-md">
                      <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                      <span>{weatherForecast.current_temp}°C • {weatherForecast.forecast_description}</span>
                    </div>
                  </div>

                  <div className="w-full space-y-3 px-2 mt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Rain Probability:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{weatherForecast.current_rain_prob}%</span>
                    </div>
                    {weatherForecast.recommended_delay_hours > 0 && (
                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                        <Lightbulb className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Rain delay trigger active: postpone irrigation by {weatherForecast.recommended_delay_hours} hrs.</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Smart Energy Scheduler Settings */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-6"
          >
            <Card className="border-none glass-container">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                      <Calendar className="h-5 w-5 text-emerald-500" />
                      Smart Solar-Powered Scheduler
                    </CardTitle>
                    <CardDescription>
                      Automate irrigation events when clean solar reserves are high
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl">
                    <span className="text-xs font-semibold text-muted-foreground">Enable Automation Rule:</span>
                    <Switch checked={rulesEnabled} onCheckedChange={setRulesEnabled} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-muted-foreground">
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
                    <span className="font-bold text-gray-800 dark:text-white block mb-1">Battery Storage Constraint</span>
                    <span>Starts irrigation cycles only if battery &gt; 70% to preserve reserve cells. Current: <strong className="text-emerald-500">{solarStatus.battery_pct}%</strong></span>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
                    <span className="font-bold text-gray-800 dark:text-white block mb-1">Solar Output Constraint</span>
                    <span>Limits high consumption pump extraction to peak daylight intervals. Current: <strong className="text-emerald-500">{solarStatus.solar_output_watts}W</strong></span>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
                    <span className="font-bold text-gray-800 dark:text-white block mb-1">Moisture Depletion Trigger</span>
                    <span>Fires automatically when moisture falls below target zone threshold.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Crop-Specific Irrigation Zones */}
          <div className="mt-8">
            <h2 className="text-lg font-header font-bold text-foreground mb-4">Crop-Specific Irrigation Zones</h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {zones.map((zone) => {
                const isZoneOn = zone.pump_status === "ON"
                return (
                  <motion.div variants={itemVariants} key={zone.id}>
                    <Card className={cn(
                      "border-none glass-container transition-all overflow-hidden",
                      isZoneOn && "ring-2 ring-primary/50 shadow-lg shadow-primary/10"
                    )}>
                      {/* Animated indicator bar */}
                      <div className="h-1.5 w-full bg-muted">
                        {isZoneOn && (
                          <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse w-full" />
                        )}
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm font-header font-bold flex items-center text-foreground">
                              {renderCropVector(zone.crop_type)}
                              {zone.name}
                            </CardTitle>
                            <CardDescription className="text-[10px] mt-0.5 font-body">Crop: <strong>{zone.crop_type}</strong></CardDescription>
                          </div>
                          <Badge variant="outline" className={cn(
                            "text-[10px] uppercase font-header font-bold",
                            isZoneOn 
                              ? "bg-primary/10 text-primary border-primary/20" 
                              : "bg-muted text-muted-foreground border-border"
                          )}>
                            {isZoneOn ? "Flowing" : "Closed"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Moisture Gauge & Sparkline Row */}
                        <div className="flex items-center justify-between gap-4 pt-1">
                          {/* Circular Moisture Progress Gauge */}
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" className="text-muted/40 dark:text-muted/20" strokeWidth="2.5" stroke="currentColor" fill="none" />
                                <circle cx="18" cy="18" r="16" className="text-primary" strokeWidth="2.5" strokeDasharray={`${zone.moisture}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" />
                              </svg>
                              <span className="absolute text-[11px] font-bold font-telemetry text-foreground">{zone.moisture}%</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-muted-foreground block leading-none font-header">Moisture</span>
                              <span className="text-[11px] font-bold font-header text-foreground mt-1 block leading-none">{zone.moisture}% Status</span>
                            </div>
                          </div>
                          
                          {/* Mini Historical Sparkline */}
                          <div className="flex flex-col items-end flex-1 max-w-[100px]">
                            <div className="w-full h-10">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={getSparklineData(zone.moisture, zone.id)}>
                                  <defs>
                                    <linearGradient id={`moistGrad-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35}/>
                                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.01}/>
                                    </linearGradient>
                                  </defs>
                                  <Area 
                                    type="monotone" 
                                    dataKey="val" 
                                    stroke="#10b981" 
                                    strokeWidth={1.5} 
                                    fill={`url(#moistGrad-${zone.id})`} 
                                    dot={false}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                            <span className="text-[8px] text-slate-500 dark:text-slate-400 mt-1 font-mono uppercase tracking-wider text-right">Telemetry Trend</span>
                          </div>
                        </div>

                        {/* Threshold Info */}
                        <div className="flex justify-between items-center text-[10px] bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
                          <span className="text-muted-foreground">Threshold Trigger Limit:</span>
                          <span className="font-bold text-gray-850 dark:text-gray-100">{zone.moisture_threshold}% Moisture</span>
                        </div>

                        {/* Config Slider */}
                        <div className="space-y-2 pt-2 border-t border-gray-50 dark:border-gray-800">
                          <div className="flex justify-between text-[10px]">
                            <span>Adjust Trigger Level</span>
                            <span className="font-bold text-indigo-500">{zone.moisture_threshold}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={zone.moisture_threshold}
                            onChange={(e) => updateZoneConfig(zone.id, { moisture_threshold: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 accent-emerald-500"
                          />
                        </div>

                        {/* Auto/Manual Mode Toggles */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-muted-foreground flex items-center gap-1.5"><Settings className="h-3.5 w-3.5" /> Auto watering:</span>
                          <Switch
                            checked={zone.auto_mode}
                            onCheckedChange={(checked) => updateZoneConfig(zone.id, { auto_mode: checked })}
                          />
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-3 pb-4 px-4 bg-gray-50/50 dark:bg-gray-800/10 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/60">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <Power className={cn("h-4 w-4 transition-colors", isZoneOn ? "text-emerald-500 animate-pulse animate-pulse-glow" : "text-gray-400")} />
                          Manual Pump Override
                        </span>
                        <Switch
                          checked={isZoneOn}
                          onCheckedChange={(checked) => triggerZoneIrrigation(zone.id, checked ? "ON" : "OFF")}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </TabsContent>

        {/* ── TAB: CONTROL CONSOLE (SKEUOMORPHIC SWITCHBOARD) ── */}
        <TabsContent value="control" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Master Bypass & Mode Panel */}
            <motion.div variants={itemVariants}>
              <Card className="border-none glass-container overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 gradient-bar-animated" />
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
                      <Settings className="h-5 w-5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                      Master Automation Switchboard
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Override AI scheduler rules to manually force zone valves open or closed
                    </p>
                  </div>
                  
                  {/* Auto/Manual Selector */}
                  <div className="flex items-center gap-4 bg-gray-100/60 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
                    <div className="text-xs font-bold text-gray-750 dark:text-gray-300 flex flex-col">
                      <span>System Mode</span>
                      <span className={cn(
                        "text-[10px] uppercase tracking-wider font-extrabold mt-0.5",
                        zones.some(z => !z.auto_mode) ? "text-amber-500" : "text-emerald-500"
                      )}>
                        {zones.some(z => !z.auto_mode) ? "Manual Override Active" : "Smart Scheduler Active"}
                      </span>
                    </div>

                    {/* Master Auto/Manual Slider */}
                    <button
                      onClick={async () => {
                        const anyManual = zones.some(z => !z.auto_mode)
                        for (const z of zones) {
                          await updateZoneConfig(z.id, { auto_mode: anyManual })
                        }
                      }}
                      className={cn(
                        "relative w-24 h-10 rounded-full transition-all duration-300 p-1 flex items-center shadow-inner select-none cursor-pointer",
                        zones.some(z => !z.auto_mode) ? "bg-amber-500 shadow-amber-500/20" : "bg-emerald-500 shadow-emerald-500/20"
                      )}
                    >
                      <motion.div
                        layout
                        className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-[9px] font-black uppercase text-slate-800"
                        animate={{ x: zones.some(z => !z.auto_mode) ? 52 : 0 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      >
                        {zones.some(z => !z.auto_mode) ? "MAN" : "AUTO"}
                      </motion.div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Zone Switches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {zones.map((zone) => {
                const isZoneOn = zone.pump_status === "ON"
                const isAuto = zone.auto_mode

                return (
                  <motion.div variants={itemVariants} key={zone.id}>
                    <div className="relative group">
                      <Card className={cn(
                        "border-none glass-container transition-all duration-500 overflow-hidden relative",
                        isZoneOn && "ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/5"
                      )}>
                        {/* active background flow bar */}
                        <div className="h-1.5 w-full bg-gray-150 dark:bg-gray-855">
                          {isZoneOn && (
                            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse w-full" />
                          )}
                        </div>

                        <CardHeader className="pb-3 pt-5">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <CardTitle className="text-sm font-black flex items-center gap-1.5 text-gray-800 dark:text-white">
                                <Sprout className="h-4 w-4 text-emerald-500" />
                                {zone.name}
                              </CardTitle>
                              <div className="text-[10px] text-muted-foreground">
                                Crop: <strong className="text-gray-700 dark:text-gray-300">{zone.crop_type}</strong>
                              </div>
                            </div>
                            
                            {/* LED Light */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase font-black text-muted-foreground text-[8px]">Relay</span>
                              <span className="relative flex h-3 w-3">
                                {isZoneOn ? (
                                  <>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 animate-led-glow text-emerald-500"></span>
                                  </>
                                ) : (
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500/85 animate-led-glow text-red-500"></span>
                                )}
                              </span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-5 pt-1">
                          {/* Pump Fan */}
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-150 dark:border-gray-855">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-gray-150/40 dark:bg-gray-750/40 text-gray-650 dark:text-gray-350">
                                <RefreshCw className={cn(
                                  "h-5 w-5",
                                  isZoneOn ? "animate-pump-spin text-emerald-500" : "text-gray-400"
                                )} />
                              </div>
                              <div className="text-xs font-semibold">
                                <span className="text-muted-foreground block text-[9px]">Actuator Relay</span>
                                <span className="font-bold">{isZoneOn ? "Water Flowing" : "Solenoid Closed"}</span>
                              </div>
                            </div>
                            
                            {/* Moisture level */}
                            <div className="text-right">
                              <span className="text-muted-foreground block text-[9px] uppercase tracking-wider font-extrabold">Moisture</span>
                              <span className="text-sm font-black text-gray-855 dark:text-gray-100">{zone.moisture}%</span>
                            </div>
                          </div>

                          {/* Threshold adjustment */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-gray-750 dark:text-gray-300">Adjust Trigger Threshold</span>
                            <span className="font-black text-indigo-500">{zone.moisture_threshold}%</span>
                          </div>
                          <div className="space-y-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={zone.moisture_threshold}
                              onChange={(e) => updateZoneConfig(zone.id, { moisture_threshold: parseInt(e.target.value) })}
                              className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-[9px] text-muted-foreground">
                              <span>0% Dry</span>
                              <span>100% Wet</span>
                            </div>
                          </div>

                          {/* Flip switch controls */}
                          <div className="pt-4 border-t border-gray-150 dark:border-gray-855 flex flex-col gap-3 relative">
                            {/* Auto mode block overlay */}
                            {isAuto && (
                              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center border border-white/20 dark:border-white/10">
                                <div className="text-center space-y-1 px-4">
                                  <span className="text-[10px] font-black uppercase text-indigo-500 flex items-center justify-center gap-1">
                                    <Shield className="h-3.5 w-3.5" /> AI Scheduler Active
                                  </span>
                                  <p className="text-[9px] text-muted-foreground leading-tight">
                                    Switch Master to MANUAL to unlock pump override
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Pump Override Toggle Switch */}
                            <div className="flex items-center justify-between">
                              <div className="text-xs">
                                <span className="font-bold text-gray-800 dark:text-gray-255 block">Pump Valve Override</span>
                                <span className="text-[10px] text-muted-foreground">Force valve open/close</span>
                              </div>
                              
                              {/* Skeuomorphic Rocker Switch */}
                              <button
                                onClick={() => triggerZoneIrrigation(zone.id, isZoneOn ? "OFF" : "ON")}
                                className={cn(
                                  "relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner p-1 flex items-center select-none cursor-pointer",
                                  isZoneOn ? "bg-emerald-500 shadow-emerald-500/25" : "bg-gray-300 dark:bg-gray-800"
                                )}
                              >
                                <motion.div
                                  layout
                                  className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-[8px] font-extrabold uppercase text-slate-800"
                                  animate={{ x: isZoneOn ? 32 : 0 }}
                                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                >
                                  {isZoneOn ? "ON" : "OFF"}
                                </motion.div>
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Emergency Stop Panel */}
            <motion.div variants={itemVariants}>
              <div className="p-1.5 rounded-2xl bg-[repeating-linear-gradient(-45deg,#ef4444,#ef4444_10px,#000_10px,#000_20px)] shadow-lg shadow-red-500/5">
                <Card className="border-none glass-container overflow-hidden p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <h3 className="text-base font-black text-red-500 uppercase flex items-center justify-center sm:justify-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
                        Emergency Cutoff System
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-md">
                        Immediately locks all zone pumps closed and sets master system mode to Manual Override. Use in case of water leaks, blockages, or emergency faults.
                      </p>
                    </div>
                    
                    {/* E-Stop Industrial Button */}
                    <div className="flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 0.95 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          for (const z of zones) {
                            if (z.pump_status === "ON") {
                              await triggerZoneIrrigation(z.id, "OFF")
                            }
                            await updateZoneConfig(z.id, { auto_mode: false })
                          }
                          alert("🛑 EMERGENCY SHUTDOWN TRIGGERED: All zone valves locked closed.")
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-650 hover:to-red-755 flex flex-col items-center justify-center border-4 border-slate-955 dark:border-slate-800 shadow-xl cursor-pointer animate-estop-pulse text-white font-black text-xs relative overflow-hidden"
                      >
                        <span className="text-[8px] uppercase tracking-wider text-white/50 mb-0.5">Press</span>
                        E-STOP
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Water Savings & Statistics Card */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="border-none glass-container h-full flex flex-col justify-between overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Water Conservation Analytics
                  </CardTitle>
                  <CardDescription>Precision scheduling savings stats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 py-4 justify-center flex flex-col">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Total Water Extracted</span>
                    <h2 className="text-3xl font-black text-gray-800 dark:text-white">
                      {waterSavings.total_consumed_liters.toLocaleString()} Liters
                    </h2>
                  </div>
                  <div className="space-y-1 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4" /> Total Water Saved (Est)
                    </span>
                    <h2 className="text-3xl font-black text-emerald-500">
                      {waterSavings.total_saved_liters.toLocaleString()} Liters
                    </h2>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-400 mt-4 leading-relaxed">
                    🎯 Your farm achieved a <strong>{waterSavings.efficiency_percentage}%</strong> overall conservation rating by coordinating irrigation with local soil moisture sensors.
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recharts Graphical Panels */}
            <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
              <Card className="border-none glass-container">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Soil Moisture Levels Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                  <HistoryChart data={history} />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="border-none glass-container">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Solar Generation Telemetry (Watts)</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <EnergyConsumptionChart data={history} />
              </CardContent>
            </Card>

            <Card className="border-none glass-container">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Weekly Water Consumed (Liters)</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <WaterUsageBarChart data={history} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── TAB 3: FARM INTEL (AI) ── */}
        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Config Form */}
            <Card className="border-none glass-container md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Cpu className="h-5 w-5 text-indigo-500" />
                  Crop Recommendation Engine
                </CardTitle>
                <CardDescription>Determine optimal crops for current conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRecommendationSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Soil Classification Type</label>
                    <select 
                      value={soilType} 
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="Loam">Loam (Optimal Nutrients)</option>
                      <option value="Clay">Clay (High Retentive)</option>
                      <option value="Sandy">Sandy (Quick Drainage)</option>
                      <option value="Silt">Silt (Fine Silt particles)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <label className="font-semibold">Temperature Target</label>
                      <span className="font-bold text-indigo-500">{targetTemp}°C</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="45"
                      value={targetTemp}
                      onChange={(e) => setTargetTemp(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <label className="font-semibold">Soil Moisture Target</label>
                      <span className="font-bold text-indigo-500">{targetMoist}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={targetMoist}
                      onChange={(e) => setTargetMoist(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <label className="font-semibold">Average Rainfall</label>
                      <span className="font-bold text-indigo-500">{targetRain} mm</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="50"
                      value={targetRain}
                      onChange={(e) => setTargetRain(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 accent-indigo-500"
                    />
                  </div>

                  <Button type="submit" disabled={aiLoading} className="w-full h-11 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/25">
                    {aiLoading ? "Analyzing..." : "Run AI Diagnostics 🚀"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recommendation Outputs */}
            <Card className="border-none glass-container md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-bold">Diagnostic Recommendations Output</CardTitle>
                <CardDescription>AI recommendation results with agricultural suggestions</CardDescription>
              </CardHeader>
              <CardContent className="h-full flex flex-col justify-center min-h-[300px]">
                <AnimatePresence mode="wait">
                  {aiRecommendations ? (
                    <motion.div
                      key={JSON.stringify(aiRecommendations)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="text-xs font-semibold p-3.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-900">
                        {aiRecommendations.soil_type_notes}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {aiRecommendations.recommendations.map((rec, idx) => (
                          <div key={idx} className="p-4 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10 space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-1.5">
                                <Sprout className="h-4 w-4 text-emerald-500" />
                                {rec.crop}
                              </span>
                              <Badge className={cn(
                                "rounded-full text-[10px] uppercase font-bold",
                                rec.suitability === "EXCELLENT" 
                                  ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400" 
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                              )}>
                                {rec.suitability} (Match: {rec.score}%)
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground"><strong className="text-gray-800 dark:text-white font-semibold">Agronomic Risk:</strong> {rec.risks}</p>
                            <p className="text-xs text-muted-foreground"><strong className="text-gray-800 dark:text-white font-semibold">Yield tip:</strong> {rec.yield_tip}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <Cpu className="h-12 w-12 text-muted-foreground/30 mb-3 animate-pulse" />
                      <p className="text-xs text-muted-foreground max-w-[240px]">
                        Submit farm classification parameters to run AI crop suitability suggestions
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Moisture Depletion Prediction Charts */}
          {moistureForecast && (
            <Card className="border-none glass-container mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  Moisture Depletion Forecast (Next 24 Hours)
                </CardTitle>
                <CardDescription>Estimated evaporation rates based on current meteorological trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moistureForecast.hourly_prognosis} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.08)" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<AnimatedTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="Banana (Zone A)" stroke="#ef4444" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Tomato (Zone B)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Sugarcane (Zone C)" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── TAB 4: DIGITAL TWIN ── */}
        <TabsContent value="digital-twin" className="space-y-6">
          <DigitalTwin />
        </TabsContent>

        {/* ── TAB 5: VOICE ASSISTANT ── */}
        <TabsContent value="voice" className="space-y-6">
          <VoiceAssistant />
        </TabsContent>
      </Tabs>
    </div>
  )
}
