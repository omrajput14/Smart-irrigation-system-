import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sprout, Sun, Droplets, HelpCircle, Thermometer, BatteryCharging, Waves } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFarm } from "@/context/FarmContext"
import { Badge } from "@/components/ui/badge"

export function DigitalTwin() {
  const { zones, tankStatus, solarStatus } = useFarm()
  const [selectedElement, setSelectedElement] = useState(null)

  const getMoistureColor = (moisture) => {
    if (moisture < 40) return "bg-red-500/25 border-red-500 text-red-400"
    if (moisture < 60) return "bg-green-500/25 border-green-500 text-green-400"
    return "bg-blue-500/25 border-blue-500 text-blue-400"
  }

  const zoneA = zones.find(z => z.id === "A") || { moisture: 45, pump_status: "OFF" }
  const zoneB = zones.find(z => z.id === "B") || { moisture: 38, pump_status: "OFF" }
  const zoneC = zones.find(z => z.id === "C") || { moisture: 62, pump_status: "OFF" }

  return (
    <Card className="border-none glass-container overflow-hidden card-hover">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-indigo-500" />
              Interactive Farm Digital Twin
            </CardTitle>
            <CardDescription>
              Virtual layout displaying real-time moisture heatmaps, water sources, and energy relays
            </CardDescription>
          </div>
          <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
            3D Vector Model
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Virtual Grid Graphic (2 columns wide on large screens) */}
          <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            
            {/* Top row: Tank & Solar Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 z-10">
              {/* Solar Array Node */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedElement({
                  title: "Solar Power Array",
                  stats: [
                    { label: "Battery Status", value: `${solarStatus.battery_pct}% (${solarStatus.charging ? 'Charging' : 'Discharging'})` },
                    { label: "Current Generation", value: `${solarStatus.solar_output_watts} Watts` },
                    { label: "Pump Consumption", value: `${solarStatus.pump_consumption_watts} Watts` }
                  ],
                  note: "Powers the primary borewell extraction system and solenoid relays."
                })}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-yellow-500/50 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Sun className="h-5 w-5 animate-sun-spin" />
                  </div>
                  <div>
                    <h4 className="text-xs text-white/50 font-semibold">Solar Grid</h4>
                    <span className="text-sm font-bold text-white">{solarStatus.solar_output_watts}W</span>
                  </div>
                </div>
                {solarStatus.charging && (
                  <BatteryCharging className="h-4 w-4 text-green-400 animate-pulse" />
                )}
              </motion.div>

              {/* Water Storage Tank Node */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedElement({
                  title: "Main Reservoirs Tank",
                  stats: [
                    { label: "Water Level", value: `${tankStatus.storage_level_liters} Liters (${Math.round((tankStatus.storage_level_liters / tankStatus.storage_capacity_liters)*100)}%)` },
                    { label: "Extraction Rate", value: `${tankStatus.borewell_status === "ACTIVE" ? '25 L/sec' : '0 L/sec'}` }
                  ],
                  note: "Primary borewell draws from the aquifer automatically when storage falls below 1,500 liters."
                })}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Waves className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-white/50 font-semibold">Storage Tank</h4>
                    <span className="text-sm font-bold text-white">{tankStatus.storage_level_liters}L</span>
                  </div>
                </div>
                {tankStatus.borewell_status === "ACTIVE" && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
              </motion.div>
            </div>

            {/* Farm Zones Mockup Field */}
            <div className="grid grid-cols-3 gap-4 z-10 flex-1">
              {/* Zone A (Banana) */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedElement({
                  title: "Zone A - North (Banana)",
                  stats: [
                    { label: "Crop Type", value: "Banana (Musa acuminata)" },
                    { label: "Moisture Level", value: `${zoneA.moisture}%` },
                    { label: "Solenoid Valve", value: zoneA.pump_status === "ON" ? "OPEN (Flowing)" : "CLOSED (Static)" }
                  ],
                  note: "Requires heavy moisture. Optimal moisture threshold configured to 50%."
                })}
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${getMoistureColor(zoneA.moisture)}`}
              >
                <div className="flex justify-between items-start">
                  <Sprout className="h-6 w-6" />
                  <Badge className="bg-white/10 hover:bg-white/20 text-white border-0 text-[10px]">A</Badge>
                </div>
                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-white">Banana Plantation</h4>
                  <p className="text-lg font-bold mt-1">{zoneA.moisture}%</p>
                </div>
                {zoneA.pump_status === "ON" && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-300 font-semibold animate-pulse">
                    <Droplets className="h-3 w-3" /> Watering...
                  </div>
                )}
              </motion.div>

              {/* Zone B (Tomato) */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedElement({
                  title: "Zone B - Greenhouse (Tomato)",
                  stats: [
                    { label: "Crop Type", value: "Tomato (Solanum lycopersicum)" },
                    { label: "Moisture Level", value: `${zoneB.moisture}%` },
                    { label: "Solenoid Valve", value: zoneB.pump_status === "ON" ? "OPEN (Flowing)" : "CLOSED (Static)" }
                  ],
                  note: "Requires moderate moisture. Overwatering can lead to blight."
                })}
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${getMoistureColor(zoneB.moisture)}`}
              >
                <div className="flex justify-between items-start">
                  <Sprout className="h-6 w-6" />
                  <Badge className="bg-white/10 hover:bg-white/20 text-white border-0 text-[10px]">B</Badge>
                </div>
                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-white">Tomato Greenhouse</h4>
                  <p className="text-lg font-bold mt-1">{zoneB.moisture}%</p>
                </div>
                {zoneB.pump_status === "ON" && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-300 font-semibold animate-pulse">
                    <Droplets className="h-3 w-3" /> Watering...
                  </div>
                )}
              </motion.div>

              {/* Zone C (Sugarcane) */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedElement({
                  title: "Zone C - South Ridge (Sugarcane)",
                  stats: [
                    { label: "Crop Type", value: "Sugarcane (Saccharum officinarum)" },
                    { label: "Moisture Level", value: `${zoneC.moisture}%` },
                    { label: "Solenoid Valve", value: zoneC.pump_status === "ON" ? "OPEN (Flowing)" : "CLOSED (Static)" }
                  ],
                  note: "Configured for dry-spell resilience with furrow irrigation."
                })}
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${getMoistureColor(zoneC.moisture)}`}
              >
                <div className="flex justify-between items-start">
                  <Sprout className="h-6 w-6" />
                  <Badge className="bg-white/10 hover:bg-white/20 text-white border-0 text-[10px]">C</Badge>
                </div>
                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-white">Sugarcane Field</h4>
                  <p className="text-lg font-bold mt-1">{zoneC.moisture}%</p>
                </div>
                {zoneC.pump_status === "ON" && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-300 font-semibold animate-pulse">
                    <Droplets className="h-3 w-3" /> Watering...
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="p-5 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex flex-col justify-between min-h-[400px]">
            <AnimatePresence mode="wait">
              {selectedElement ? (
                <motion.div
                  key={selectedElement.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-base font-bold text-gray-800 dark:text-white">{selectedElement.title}</h3>
                    <div className="h-1 w-12 bg-indigo-500 rounded-full mt-1.5" />
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {selectedElement.stats.map((stat, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/45 dark:bg-slate-900/45 rounded-lg shadow-sm border border-white/30 dark:border-white/5">
                        <span className="text-muted-foreground">{stat.label}:</span>
                        <span className="font-bold text-gray-800 dark:text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                    {selectedElement.note}
                  </p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center flex-1 py-12">
                  <HelpCircle className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-xs text-muted-foreground max-w-[180px]">
                    Click any zone, solar array, or tank element in the farm blueprint to inspect telemetry
                  </p>
                </div>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-[10px] text-muted-foreground flex items-center justify-between">
              <span>Heatmap Legend:</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500/40" /> Dry</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-500/40" /> Opt</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500/40" /> Wet</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
