import { motion } from "framer-motion"
import { PieChart as PieChartIcon, Droplet, Thermometer, Sprout, CloudRain, Sun, Zap, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useFarm } from "@/context/FarmContext"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ResponsiveContainer, AreaChart, Area } from "recharts"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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

export function AnalysisPage() {
  const { zones, tankStatus, solarStatus, weatherForecast } = useFarm()

  const getMoistureAnalysis = (moisture, threshold) => {
    if (moisture < threshold - 10) return { status: "Under-watered", color: "text-red-500", bg: "bg-red-500/10", note: "Critically below threshold. Automatic triggers will prioritize this zone." }
    if (moisture > threshold + 20) return { status: "Saturated", color: "text-blue-500", bg: "bg-blue-500/10", note: "Too much moisture. Risk of root rot. Solenoid valves will stay locked." }
    return { status: "Optimal", color: "text-emerald-500", bg: "bg-emerald-500/10", note: "Healthy moisture balance. Crops are drawing water efficiently." }
  }

  return (
    <motion.div
      className="space-y-6 py-6 max-w-7xl mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <PieChartIcon className="h-8 w-8 text-emerald-500" />
          Farm Data Analysis
        </h1>
        <p className="text-muted-foreground mt-1">In-depth telemetry analysis and agricultural diagnostic reports</p>
      </motion.div>

      {/* Multi-Zone Deep Analysis */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants}>
        {zones.map((zone) => {
          const analysis = getMoistureAnalysis(zone.moisture, zone.moisture_threshold)
          return (
            <motion.div key={zone.id} variants={itemVariants}>
              <Card className="border-none glass-container h-full flex flex-col justify-between card-hover">
                <CardHeader className="pb-3 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold flex items-center">
                      {renderCropVector(zone.crop_type)}
                      {zone.name}
                    </CardTitle>
                    <Badge className={cn("text-[9px] uppercase font-black", analysis.bg, analysis.color)}>
                      {analysis.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-[10px]">Crop Focus: <strong>{zone.crop_type}</strong></CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Moisture Indicator and Sparkline Row */}
                  <div className="flex items-center justify-between gap-4">
                    {/* Circle Moisture Gauge */}
                    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" className="text-gray-150 dark:text-gray-800/80" strokeWidth="2.5" stroke="currentColor" fill="none" />
                        <circle cx="18" cy="18" r="16" className="text-emerald-500" strokeWidth="2.5" strokeDasharray={`${zone.moisture}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" />
                      </svg>
                      <span className="absolute text-[10px] font-black text-gray-850 dark:text-gray-100">{zone.moisture}%</span>
                    </div>

                    {/* Sparkline trend */}
                    <div className="flex flex-col items-end flex-grow max-w-[90px]">
                      <div className="w-full h-8">
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
                      <span className="text-[7px] text-slate-500 dark:text-slate-400 font-mono tracking-wider">Moisture History</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Trigger Threshold:</span>
                      <span className="font-semibold text-slate-650 dark:text-slate-200">{zone.moisture_threshold}% Moisture</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Flow Rate Allocation:</span>
                      <span className="font-semibold text-slate-650 dark:text-slate-200">{zone.water_flow_rate} L/min</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-slate-800/30 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1.5 border border-slate-100 dark:border-slate-800/40">
                    <Info className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>{analysis.note}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Water & Solar Optimization Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Water Reserves Report */}
        <motion.div variants={itemVariants}>
          <Card className="border-none glass-container h-full flex flex-col justify-between card-hover">
            <CardHeader className="pb-3 border-b border-gray-50 dark:border-gray-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500 animate-pulse" />
                Aquifer Extraction & Reservoirs Report
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 uppercase tracking-wider font-semibold">Storage Remaining</span>
                    <strong className="text-lg font-black text-slate-800 dark:text-white">{tankStatus.storage_level_liters} Liters</strong>
                  </div>
                  <div className="relative w-8 h-10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 32 40">
                      <rect x="2" y="2" width="28" height="36" rx="6" fill="none" stroke="currentColor" className="text-slate-350 dark:text-slate-700" strokeWidth="1.5" />
                      <rect x="4" y={4 + (1 - tankStatus.storage_level_liters / tankStatus.storage_capacity_liters) * 32} width="24" height={(tankStatus.storage_level_liters / tankStatus.storage_capacity_liters) * 32} rx="4" fill="#38bdf8" />
                    </svg>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 uppercase tracking-wider font-semibold">Borewell Extraction</span>
                    <strong className="text-lg font-black text-slate-800 dark:text-white">{tankStatus.borewell_flow_rate} L/min</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Droplet className={cn("h-5 w-5", tankStatus.borewell_status === "ACTIVE" && "animate-pulse")} />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The storage tank holds <strong>{Math.round((tankStatus.storage_level_liters / tankStatus.storage_capacity_liters)*100)}%</strong> of its maximum capacity. The borewell aquifer extraction system is running in <strong>{tankStatus.borewell_status}</strong> mode. Pump dry-run triggers are set to flag if capacity falls below 20%.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Solar Reserves Report */}
        <motion.div variants={itemVariants}>
          <Card className="border-none glass-container h-full flex flex-col justify-between card-hover">
            <CardHeader className="pb-3 border-b border-gray-50 dark:border-gray-800">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500 animate-sun-spin" />
                Renewable Solar Conversion Report
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 uppercase tracking-wider font-semibold">Battery Reserves</span>
                    <strong className="text-lg font-black text-slate-800 dark:text-white">{solarStatus.battery_pct}% Capacity</strong>
                  </div>
                  <div className="relative w-10 h-6 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 40 24">
                      <rect x="2" y="4" width="30" height="16" rx="3" fill="none" stroke="currentColor" className="text-slate-350 dark:text-slate-700" strokeWidth="1.5" />
                      <rect x="33" y="9" width="3" height="6" rx="1.5" fill="currentColor" className="text-slate-350 dark:text-slate-700" />
                      <rect x="4.5" y="6.5" width={(solarStatus.battery_pct / 100) * 25} height="11" rx="1.5" fill={solarStatus.battery_pct > 50 ? "#10b981" : "#f59e0b"} />
                    </svg>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/5 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 uppercase tracking-wider font-semibold">Solar Output Power</span>
                    <strong className="text-lg font-black text-slate-800 dark:text-white">{solarStatus.solar_output_watts} Watts</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <Sun className={cn("h-5 w-5", solarStatus.solar_output_watts > 10 && "animate-sun-spin")} />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your renewable power generation is operating at <strong>{solarStatus.solar_efficiency}% efficiency</strong>. There is no active load consumption by the pumps. The smart scheduler is currently reserving battery cycles to ensure reliable nighttime telemetry logging.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
