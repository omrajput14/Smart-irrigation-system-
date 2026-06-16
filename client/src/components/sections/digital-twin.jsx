import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sprout, 
  Sun, 
  Droplets, 
  HelpCircle, 
  Thermometer, 
  BatteryCharging, 
  Waves, 
  Layers, 
  Activity, 
  Zap, 
  Power,
  TrendingUp,
  AlertTriangle,
  Lightbulb
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFarm } from "@/context/FarmContext"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function DigitalTwin() {
  const { zones, tankStatus, solarStatus, weatherForecast, triggerZoneIrrigation } = useFarm()
  const [selectedElement, setSelectedElement] = useState("A") // Default to Zone A
  const [activeLayers, setActiveLayers] = useState({
    heatmap: true,
    irrigation: true,
    solar: true
  })

  // Helper to toggle active layers
  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }

  // Get moisture level color gradient for heatmap
  const getMoistureColor = (moisture) => {
    if (moisture < 45) return "rgba(239, 68, 68, 0.45)" // Dry - Red
    if (moisture < 75) return "rgba(34, 197, 94, 0.45)" // Optimal - Green
    return "rgba(59, 130, 246, 0.45)" // Wet - Blue
  }

  // Get moisture status text
  const getMoistureStatus = (moisture) => {
    if (moisture < 45) return { text: "CRITICAL DRY", color: "text-red-500", bg: "bg-red-500/10 border-red-500/30" }
    if (moisture < 75) return { text: "OPTIMAL", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30" }
    return { text: "SATURATED", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/30" }
  }

  // Find actual elements in context
  const zoneA = zones.find(z => z.id === "A") || { name: "Zone A - North", moisture: 45, pump_status: "OFF", crop_type: "Banana", moisture_threshold: 50 }
  const zoneB = zones.find(z => z.id === "B") || { name: "Zone B - Greenhouse", moisture: 38, pump_status: "OFF", crop_type: "Tomato", moisture_threshold: 40 }
  const zoneC = zones.find(z => z.id === "C") || { name: "Zone C - South Ridge", moisture: 62, pump_status: "OFF", crop_type: "Sugarcane", moisture_threshold: 35 }

  // Map elements for easy lookup in details panel
  const elementDetails = {
    A: {
      id: "A",
      title: zoneA.name,
      crop: zoneA.crop_type,
      description: "Requires heavy moisture. Crop leaves grow broad and evaporate water rapidly, demanding dense irrigation schedules.",
      threshold: zoneA.moisture_threshold,
      moisture: zoneA.moisture,
      pump: zoneA.pump_status,
      icon: <Sprout className="h-6 w-6 text-emerald-500" />,
      tips: "Ensure root zones remain above 50% moisture to prevent tip burn and fruit size decrease.",
      stats: [
        { label: "Optimal Range", value: "50% - 80% RH" },
        { label: "Microclimate Temp", value: `${weatherForecast.current_temp}°C` },
        { label: "Solenoid Valve", value: zoneA.pump_status === "ON" ? "OPEN (Flowing)" : "CLOSED (Static)" }
      ]
    },
    B: {
      id: "B",
      title: zoneB.name,
      crop: zoneB.crop_type,
      description: "Greenhouse environments run warmer. Water is routed through high-efficiency overhead micro-drip manifolds.",
      threshold: zoneB.moisture_threshold,
      moisture: zoneB.moisture,
      pump: zoneB.pump_status,
      icon: <Sprout className="h-6 w-6 text-orange-500" />,
      tips: "Optimal range is 40%-60%. Avoid overwatering to prevent root fungal blight and fruit splitting.",
      stats: [
        { label: "Optimal Range", value: "40% - 65% RH" },
        { label: "Greenhouse Temp", value: `${weatherForecast.current_temp + 2}°C` },
        { label: "Drip Valve", value: zoneB.pump_status === "ON" ? "OPEN (Flowing)" : "CLOSED (Static)" }
      ]
    },
    C: {
      id: "C",
      title: zoneC.name,
      crop: zoneC.crop_type,
      description: "Deep-root furrow crop. High resistance to dry spells. Configured to schedule irrigation cycles primarily during low evapotranspiration hours.",
      threshold: zoneC.moisture_threshold,
      moisture: zoneC.moisture,
      pump: zoneC.pump_status,
      icon: <Sprout className="h-6 w-6 text-teal-500" />,
      tips: "Solenoids open dynamically. Target 35% trigger threshold is optimized to promote root expansion.",
      stats: [
        { label: "Optimal Range", value: "35% - 70% RH" },
        { label: "Field Soil Temp", value: `${weatherForecast.current_temp - 1}°C` },
        { label: "Gate Valve", value: zoneC.pump_status === "ON" ? "OPEN (Flowing)" : "CLOSED (Static)" }
      ]
    },
    solar: {
      id: "solar",
      title: "Solar Generation Array",
      crop: "Renewable Power",
      description: "Dual-axis solar array providing off-grid electricity to the primary borehole pump, solenoid valves, and microcontrollers.",
      icon: <Sun className="h-6 w-6 text-yellow-500" />,
      tips: "Clean solar cells monthly. The system automatically routes grid backup power if battery level drops below 30%.",
      stats: [
        { label: "Array Output", value: `${solarStatus.solar_output_watts} Watts` },
        { label: "Conversion Efficiency", value: `${solarStatus.solar_efficiency}%` },
        { label: "Battery Charge", value: `${solarStatus.battery_pct}% (${solarStatus.charging ? "Charging" : "Discharging"})` },
        { label: "Active Power Draw", value: `${solarStatus.pump_consumption_watts} Watts` }
      ]
    },
    tank: {
      id: "tank",
      title: "Water Reservoir Silo",
      crop: "Water Storage",
      description: "Primary gravity-fed water silo connected to the aquifer borehole extraction pump. Routes water to zones A, B, and C.",
      icon: <Waves className="h-6 w-6 text-blue-500" />,
      tips: "When levels drop below 1,500 L, low pressure warning alerts activate. Borehole pump fires automatically when solar power is peaked.",
      stats: [
        { label: "Storage Level", value: `${tankStatus.storage_level_liters} L / ${tankStatus.storage_capacity_liters} L` },
        { label: "Borehole Extractor", value: tankStatus.borewell_status },
        { label: "Solenoid Pressure", value: "3.2 Bar" },
        { label: "Safety Status", value: tankStatus.safety_warning }
      ]
    }
  }

  const activeDetails = elementDetails[selectedElement] || elementDetails.A

  return (
    <Card className="border-none glass-container overflow-hidden relative card-hover">
      {/* Dynamic Keyframe Animations injected locally */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dashflow {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes powerflow {
          to {
            stroke-dashoffset: -15;
          }
        }
        @keyframes isopulse {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.8));
          }
        }
        .anim-pipe-flow {
          stroke-dasharray: 6, 4;
          animation: dashflow 1s linear infinite;
        }
        .anim-power-flow {
          stroke-dasharray: 4, 3;
          animation: powerflow 0.8s linear infinite;
        }
        .selected-glow {
          animation: isopulse 2s infinite ease-in-out;
        }
        .isomap-card {
          backdrop-filter: blur(12px);
          background: rgba(15, 23, 42, 0.45);
        }
        .isometric-svg {
          transform: rotateX(60deg) rotateZ(-45deg);
          transform-style: preserve-3d;
        }
        .grid-isometric-bg {
          background-size: 20px 20px;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
        }
      `}} />

      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-black text-gray-800 dark:text-white">
              <Waves className="h-5 w-5 text-indigo-500 animate-pulse" />
              Interactive Farm Digital Twin
            </CardTitle>
            <CardDescription>
              Virtual layout displaying moisture heatmaps, water routes, and energy pipelines
            </CardDescription>
          </div>

          {/* Layer Toggles Panel */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-100/60 dark:bg-slate-900/50 p-1.5 rounded-xl border border-gray-200/40 dark:border-white/5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground px-2">Layers:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleLayer("heatmap")}
              className={`h-7 px-2.5 text-[11px] font-bold rounded-lg transition-all ${
                activeLayers.heatmap 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20" 
                  : "text-muted-foreground hover:bg-gray-200 dark:hover:bg-slate-800"
              }`}
            >
              <Activity className="h-3 w-3 mr-1" />
              Heatmap
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleLayer("irrigation")}
              className={`h-7 px-2.5 text-[11px] font-bold rounded-lg transition-all ${
                activeLayers.irrigation 
                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20" 
                  : "text-muted-foreground hover:bg-gray-200 dark:hover:bg-slate-800"
              }`}
            >
              <Droplets className="h-3 w-3 mr-1" />
              Pipelines
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleLayer("solar")}
              className={`h-7 px-2.5 text-[11px] font-bold rounded-lg transition-all ${
                activeLayers.solar 
                  ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20" 
                  : "text-muted-foreground hover:bg-gray-200 dark:hover:bg-slate-800"
              }`}
            >
              <Zap className="h-3 w-3 mr-1" />
              Power Relays
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ── 2.5D BLUEPRINT MAP AREA ── */}
          <div className="lg:col-span-2 relative min-h-[420px] rounded-2xl bg-slate-950 border border-slate-900 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
            <div className="absolute inset-0 grid-isometric-bg opacity-15 pointer-events-none" />
            
            {/* Top Indicator Tag */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-black text-slate-400 flex items-center gap-1.5 z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              REAL-TIME SVG SYNCHRONIZATION ACTIVE
            </div>

            {/* Legend / Overlay details */}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-lg border border-slate-800 text-[9px] font-semibold text-slate-400 flex flex-col gap-1.5 z-20">
              <span className="font-bold text-[10px] text-white">Heatmap Index:</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/60" /> Dry (&lt;45%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/60" /> Opt (45%-75%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500/60" /> Wet (&gt;75%)</span>
              </div>
            </div>

            {/* ── ISOMETRIC SVG MAP CANVAS ── */}
            <div className="w-full flex-1 flex items-center justify-center py-6">
              <svg className="w-full max-w-[550px] aspect-[5/3.5] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" viewBox="0 0 600 420">
                <defs>
                  {/* Gradients */}
                  <linearGradient id="tankBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="30%" stopColor="#334155" />
                    <stop offset="70%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  
                  <linearGradient id="waterLevelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>

                  <linearGradient id="solarPanelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>

                  {/* Glow Filters */}
                  <filter id="neonGlowBlue" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="neonGlowGold" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* ── GROUND GRID LANDSCAPE BLUEPRINT ── */}
                {/* Major Farm Boundary */}
                <polygon points="300,40 570,195 300,350 30,195" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <polygon points="300,43 565,195 300,347 35,195" fill="rgba(30,41,59,0.15)" />

                {/* ── LAYER: POWER LINES (SOLAR GRID) ── */}
                {activeLayers.solar && (
                  <g>
                    {/* Solar Panel Array -> Hub */}
                    <path d="M 440,115 L 300,185" fill="none" stroke={solarStatus.solar_output_watts > 10 ? "rgba(234, 179, 8, 0.2)" : "#334155"} strokeWidth="4" />
                    {solarStatus.solar_output_watts > 10 && (
                      <path 
                        d="M 440,115 L 300,185" 
                        fill="none" 
                        stroke="#eab308" 
                        strokeWidth="2" 
                        filter="url(#neonGlowGold)"
                        className="anim-power-flow"
                      />
                    )}
                  </g>
                )}

                {/* ── LAYER: WATER PIPELINES (IRRIGATION) ── */}
                {activeLayers.irrigation && (
                  <g>
                    {/* Tank -> Hub */}
                    <path d="M 160,115 L 300,185" fill="none" stroke={tankStatus.borewell_status === "ACTIVE" ? "rgba(14, 165, 233, 0.2)" : "#334155"} strokeWidth="4" />
                    {tankStatus.borewell_status === "ACTIVE" && (
                      <path d="M 160,115 L 300,185" fill="none" stroke="#0ea5e9" strokeWidth="2" filter="url(#neonGlowBlue)" className="anim-pipe-flow" />
                    )}

                    {/* Hub -> Field A */}
                    <path d="M 300,185 L 180,225" fill="none" stroke={zoneA.pump_status === "ON" ? "rgba(14, 165, 233, 0.2)" : "#334155"} strokeWidth="4" />
                    {zoneA.pump_status === "ON" && (
                      <path d="M 300,185 L 180,225" fill="none" stroke="#0ea5e9" strokeWidth="2" filter="url(#neonGlowBlue)" className="anim-pipe-flow" />
                    )}

                    {/* Hub -> Field B */}
                    <path d="M 300,185 L 290,270" fill="none" stroke={zoneB.pump_status === "ON" ? "rgba(14, 165, 233, 0.2)" : "#334155"} strokeWidth="4" />
                    {zoneB.pump_status === "ON" && (
                      <path d="M 300,185 L 290,270" fill="none" stroke="#0ea5e9" strokeWidth="2" filter="url(#neonGlowBlue)" className="anim-pipe-flow" />
                    )}

                    {/* Hub -> Field C */}
                    <path d="M 300,185 L 420,225" fill="none" stroke={zoneC.pump_status === "ON" ? "rgba(14, 165, 233, 0.2)" : "#334155"} strokeWidth="4" />
                    {zoneC.pump_status === "ON" && (
                      <path d="M 300,185 L 420,225" fill="none" stroke="#0ea5e9" strokeWidth="2" filter="url(#neonGlowBlue)" className="anim-pipe-flow" />
                    )}
                  </g>
                )}

                {/* ── INTERACTIVE ASSET NODES: BACK ROW ── */}

                {/* 1. Water Reservoir Silo */}
                <g 
                  onClick={() => setSelectedElement("tank")} 
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Highlights/Hover indicator */}
                  {selectedElement === "tank" && (
                    <ellipse cx="160" cy="130" rx="35" ry="16" fill="none" stroke="#6366f1" strokeWidth="2" className="selected-glow" />
                  )}
                  
                  {/* Stand / Frame */}
                  <line x1="145" y1="110" x2="145" y2="135" stroke="#475569" strokeWidth="2" />
                  <line x1="175" y1="110" x2="175" y2="135" stroke="#475569" strokeWidth="2" />
                  <line x1="160" y1="115" x2="160" y2="138" stroke="#475569" strokeWidth="1.5" />
                  <ellipse cx="160" cy="130" rx="20" ry="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />

                  {/* Silo Cylinder Tank Body */}
                  {/* Bottom Cap */}
                  <ellipse cx="160" cy="110" rx="20" ry="8" fill="url(#tankBodyGrad)" stroke="#475569" strokeWidth="1" />
                  {/* Vertical Extrusions */}
                  <rect x="140" y="75" width="40" height="35" fill="url(#tankBodyGrad)" />
                  {/* Glass shell outlines */}
                  <line x1="140" y1="75" x2="140" y2="110" stroke="#475569" strokeWidth="1.5" />
                  <line x1="180" y1="75" x2="180" y2="110" stroke="#475569" strokeWidth="1.5" />
                  
                  {/* Water column inside */}
                  <g>
                    {/* Calculate height based on tank volume */}
                    {/* Max volume = 5000L, height = 30px */}
                    {(() => {
                      const fillPct = tankStatus.storage_level_liters / tankStatus.storage_capacity_liters
                      const fillHeight = 32 * fillPct
                      const waterY = 110 - fillHeight
                      return (
                        <>
                          <rect x="141.5" y={waterY} width="37" height={fillHeight} fill="url(#waterLevelGrad)" opacity="0.85" />
                          <ellipse cx="160" cy={waterY} rx="18.5" ry="7.5" fill="#38bdf8" opacity="0.9" />
                        </>
                      )
                    })()}
                  </g>

                  {/* Top Cap */}
                  <ellipse cx="160" cy="75" rx="20" ry="8" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  {/* Cone Roof */}
                  <polygon points="160,60 140,75 180,75" fill="#475569" stroke="#64748b" strokeWidth="1" />

                  {/* Silo Title Badge */}
                  <g transform="translate(160, 48)">
                    <rect x="-32" y="-9" width="64" height="15" rx="4" fill="rgba(15,23,42,0.85)" stroke="#38bdf8" strokeWidth="1" />
                    <text x="0" y="2" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">RESERVOIR</text>
                  </g>
                </g>

                {/* 2. Solar Generation Array */}
                <g 
                  onClick={() => setSelectedElement("solar")} 
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Highlights/Hover indicator */}
                  {selectedElement === "solar" && (
                    <ellipse cx="440" cy="130" rx="35" ry="16" fill="none" stroke="#6366f1" strokeWidth="2" className="selected-glow" />
                  )}

                  {/* Support Pole */}
                  <line x1="440" y1="100" x2="440" y2="125" stroke="#475569" strokeWidth="3.5" />
                  <ellipse cx="440" cy="125" rx="15" ry="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />

                  {/* Panels isometric grids */}
                  <g transform="translate(440, 95)">
                    {/* Base Panel Support Mount */}
                    <polygon points="-25,0 25,-10 30,-5 -20,5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                    
                    {/* Solar Panel Cells (Isometric Angled Quadrilateral) */}
                    <polygon points="-28,-14 22,-24 28,-12 -22,-2" fill="url(#solarPanelGrad)" stroke="#eab308" strokeWidth="1.5" />
                    
                    {/* Panel divisions grid */}
                    <line x1="-3" y1="-19" x2="3" y2="-7" stroke="#eab308" strokeWidth="0.5" opacity="0.6" />
                    <line x1="-15" y1="-16" x2="-9" y2="-4" stroke="#eab308" strokeWidth="0.5" opacity="0.6" />
                    <line x1="9" y1="-22" x2="15" y2="-10" stroke="#eab308" strokeWidth="0.5" opacity="0.6" />
                    <line x1="-25" y1="-8" x2="25" y2="-18" stroke="#eab308" strokeWidth="0.5" opacity="0.6" />

                    {/* Array Glow when output is active */}
                    {solarStatus.solar_output_watts > 10 && (
                      <polygon points="-28,-14 22,-24 28,-12 -22,-2" fill="rgba(234,179,8,0.15)" className="animate-pulse" />
                    )}
                  </g>

                  {/* Solar Title Badge */}
                  <g transform="translate(440, 48)">
                    <rect x="-26" y="-9" width="52" height="15" rx="4" fill="rgba(15,23,42,0.85)" stroke="#fbbf24" strokeWidth="1" />
                    <text x="0" y="2" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">SOLAR GRID</text>
                  </g>
                </g>

                {/* ── CENTRAL HUB NODE ── */}
                <g>
                  {/* Central Node Platform */}
                  <ellipse cx="300" cy="185" rx="14" ry="7" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  
                  {/* Central Hub Dome */}
                  <path d="M 292,183 Q 300,165 308,183 Z" fill="#334155" stroke="#475569" strokeWidth="1" />
                  
                  {/* Central Hub LED indicator */}
                  <circle cx="300" cy="177" r="2.5" fill="#10b981" className="animate-ping" />
                  <circle cx="300" cy="177" r="1.5" fill="#34d399" />
                </g>


                {/* ── INTERACTIVE FIELDS NODES: FRONT ROW ── */}

                {/* 3. Zone A (Banana Field) */}
                <g 
                  onClick={() => setSelectedElement("A")}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Field base layout */}
                  <polygon 
                    points="80,220 190,165 290,215 180,270" 
                    fill={activeLayers.heatmap ? getMoistureColor(zoneA.moisture) : "rgba(16, 185, 129, 0.15)"} 
                    stroke={selectedElement === "A" ? "#6366f1" : "rgba(255,255,255,0.15)"} 
                    strokeWidth={selectedElement === "A" ? "2.5" : "1.5"} 
                    className={selectedElement === "A" ? "selected-glow" : ""}
                  />

                  {/* Crops Details (Swaying Banana trees) */}
                  <g transform="translate(180, 215)">
                    {/* Tree 1 */}
                    <g className="animate-sway" transform="translate(-50, 5)">
                      <path d="M0,15 Q -5,5 -2,-10" stroke="#15803d" strokeWidth="2.5" fill="none" />
                      <path d="M-2,-10 Q -15,-20 -28,-8 Q -10,-8 -2,-10" fill="#22c55e" />
                      <path d="M-2,-10 Q 15,-20 28,-8 Q 10,-8 -2,-10" fill="#16a34a" />
                      <path d="M-2,-10 Q 0,-25 -8,-32 Q -5,-15 -2,-10" fill="#4ade80" />
                    </g>
                    {/* Tree 2 */}
                    <g className="animate-sway-delayed" transform="translate(5, -25)">
                      <path d="M0,15 Q 5,5 2,-10" stroke="#15803d" strokeWidth="2" fill="none" />
                      <path d="M2,-10 Q -10,-18 -22,-8 Q -8,-8 2,-10" fill="#22c55e" opacity="0.9" />
                      <path d="M2,-10 Q 12,-18 24,-8 Q 8,-8 2,-10" fill="#16a34a" opacity="0.9" />
                    </g>
                  </g>

                  {/* Sprinkler visualization */}
                  {zoneA.pump_status === "ON" && (
                    <g transform="translate(185, 217)">
                      {/* Active Mist Effect */}
                      <circle cx="0" cy="-10" r="15" fill="rgba(14,165,233,0.15)" className="animate-pulse" />
                      <path d="M 0,0 Q -15,-20 -35,-15 M 0,0 Q 15,-20 35,-15" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="3 3" className="anim-pipe-flow" />
                    </g>
                  )}

                  {/* Value tag */}
                  <g transform="translate(110, 195)">
                    <rect x="-16" y="-7" width="32" height="13" rx="3" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <text x="0" y="2" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{zoneA.moisture}%</text>
                  </g>

                  {/* Crop Label Tag */}
                  <g transform="translate(145, 255)">
                    <rect x="-24" y="-8" width="48" height="14" rx="4" fill="rgba(15,23,42,0.75)" stroke="#16a34a" strokeWidth="0.8" />
                    <text x="0" y="2" textAnchor="middle" fill="#4ade80" fontSize="7" fontWeight="bold">BANANA</text>
                  </g>
                </g>

                {/* 4. Zone B (Tomato Greenhouse Field) */}
                <g 
                  onClick={() => setSelectedElement("B")}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Field base layout */}
                  <polygon 
                    points="190,275 290,220 390,270 290,325" 
                    fill={activeLayers.heatmap ? getMoistureColor(zoneB.moisture) : "rgba(249, 115, 22, 0.1)"} 
                    stroke={selectedElement === "B" ? "#6366f1" : "rgba(255,255,255,0.15)"} 
                    strokeWidth={selectedElement === "B" ? "2.5" : "1.5"} 
                    className={selectedElement === "B" ? "selected-glow" : ""}
                  />

                  {/* Tomato Crops (Small red tomato spheres & green bushes) */}
                  <g transform="translate(290, 270)">
                    {/* Rows of tomato plants */}
                    <g transform="translate(-40, -10)">
                      <circle cx="0" cy="0" r="5" fill="#15803d" />
                      <circle cx="-2" cy="-2" r="2" fill="#ef4444" />
                      <circle cx="2" cy="1" r="1.5" fill="#ef4444" />
                    </g>
                    <g transform="translate(40, -10)">
                      <circle cx="0" cy="0" r="5" fill="#15803d" />
                      <circle cx="-1" cy="2" r="1.8" fill="#ef4444" />
                      <circle cx="2" cy="-1" r="1.5" fill="#ea580c" />
                    </g>
                    <g transform="translate(0, 20)">
                      <circle cx="0" cy="0" r="6" fill="#16a34a" />
                      <circle cx="-2" cy="-2" r="2.2" fill="#ef4444" />
                      <circle cx="3" cy="2" r="2" fill="#ef4444" />
                    </g>
                  </g>

                  {/* Greenhouse Glass Frame Overlay (Futuristic wireframe structure) */}
                  <g opacity="0.4" className="pointer-events-none">
                    <line x1="190" y1="275" x2="190" y2="250" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="290" y1="220" x2="290" y2="195" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="390" y1="270" x2="390" y2="245" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="290" y1="325" x2="290" y2="300" stroke="#94a3b8" strokeWidth="1" />
                    
                    {/* Arched Roof Grid */}
                    <polygon points="190,250 290,195 390,245 290,300" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                    {/* Center arch support */}
                    <path d="M 190,250 Q 290,170 390,245" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                  </g>

                  {/* Micro-drip system spraying */}
                  {zoneB.pump_status === "ON" && (
                    <g transform="translate(290, 272)">
                      {/* Animated drip lines */}
                      <circle cx="0" cy="-15" r="10" fill="rgba(14,165,233,0.1)" className="animate-pulse" />
                      <line x1="-30" y1="-15" x2="-30" y2="5" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="2 4" className="anim-pipe-flow" />
                      <line x1="30" y1="-15" x2="30" y2="5" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="2 4" className="anim-pipe-flow" />
                      <line x1="0" y1="-20" x2="0" y2="20" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="2 4" className="anim-pipe-flow" />
                    </g>
                  )}

                  {/* Value tag */}
                  <g transform="translate(350, 255)">
                    <rect x="-16" y="-7" width="32" height="13" rx="3" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <text x="0" y="2" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{zoneB.moisture}%</text>
                  </g>

                  {/* Crop Label Tag */}
                  <g transform="translate(290, 310)">
                    <rect x="-24" y="-8" width="48" height="14" rx="4" fill="rgba(15,23,42,0.75)" stroke="#ea580c" strokeWidth="0.8" />
                    <text x="0" y="2" textAnchor="middle" fill="#f97316" fontSize="7" fontWeight="bold">TOMATO</text>
                  </g>
                </g>

                {/* 5. Zone C (Sugarcane Field) */}
                <g 
                  onClick={() => setSelectedElement("C")}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Field base layout */}
                  <polygon 
                    points="310,215 420,160 520,215 410,270" 
                    fill={activeLayers.heatmap ? getMoistureColor(zoneC.moisture) : "rgba(52, 211, 153, 0.15)"} 
                    stroke={selectedElement === "C" ? "#6366f1" : "rgba(255,255,255,0.15)"} 
                    strokeWidth={selectedElement === "C" ? "2.5" : "1.5"} 
                    className={selectedElement === "C" ? "selected-glow" : ""}
                  />

                  {/* Crops Details (Swaying Sugarcane stalks) */}
                  <g transform="translate(415, 215)">
                    <g className="animate-sway-delayed" transform="translate(-35, -20)">
                      <line x1="0" y1="20" x2="3" y2="-10" stroke="#166534" strokeWidth="2" />
                      <line x1="3" y1="-10" x2="-5" y2="-18" stroke="#22c55e" strokeWidth="1" />
                      <line x1="3" y1="-10" x2="12" y2="-15" stroke="#22c55e" strokeWidth="1" />
                    </g>
                    <g className="animate-sway" transform="translate(25, 5)">
                      <line x1="0" y1="20" x2="-2" y2="-12" stroke="#15803d" strokeWidth="2.2" />
                      <line x1="-2" y1="-12" x2="-10" y2="-20" stroke="#4ade80" strokeWidth="1" />
                      <line x1="-2" y1="-12" x2="5" y2="-22" stroke="#4ade80" strokeWidth="1" />
                    </g>
                  </g>

                  {/* Furrow flood irrigation indicator */}
                  {zoneC.pump_status === "ON" && (
                    <g transform="translate(415, 217)">
                      <ellipse cx="0" cy="-2" rx="20" ry="8" fill="rgba(14,165,233,0.1)" className="animate-pulse" />
                      <path d="M -25,5 Q 0,-5 25,5" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" className="anim-pipe-flow" />
                    </g>
                  )}

                  {/* Value tag */}
                  <g transform="translate(470, 185)">
                    <rect x="-16" y="-7" width="32" height="13" rx="3" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <text x="0" y="2" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">{zoneC.moisture}%</text>
                  </g>

                  {/* Crop Label Tag */}
                  <g transform="translate(420, 255)">
                    <rect x="-28" y="-8" width="56" height="14" rx="4" fill="rgba(15,23,42,0.75)" stroke="#15803d" strokeWidth="0.8" />
                    <text x="0" y="2" textAnchor="middle" fill="#22c55e" fontSize="7" fontWeight="bold">SUGARCANE</text>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* ── 3D DETAIL SIDEBAR ── */}
          <div className="p-5 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex flex-col justify-between min-h-[420px] shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDetails.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        {activeDetails.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-gray-800 dark:text-white leading-tight">
                          {activeDetails.title}
                        </h3>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold block mt-0.5">
                          Category: {activeDetails.crop}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Separator line */}
                  <div className="h-px w-full bg-gray-200/60 dark:bg-slate-800/40 my-3.5" />

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeDetails.description}
                  </p>

                  {/* Circular moisture gauge / progress details if a field zone is selected */}
                  {(activeDetails.id === "A" || activeDetails.id === "B" || activeDetails.id === "C") && (
                    <div className="mt-4 p-3 rounded-xl border border-gray-200/30 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* Circular progress meter */}
                        <div className="relative w-14 h-14 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" className="text-gray-100 dark:text-gray-800/50" strokeWidth="3" stroke="currentColor" fill="none" />
                            <circle cx="18" cy="18" r="16" className="text-indigo-500" strokeWidth="3" strokeDasharray={`${activeDetails.moisture}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" />
                          </svg>
                          <span className="absolute text-xs font-black text-gray-850 dark:text-white">{activeDetails.moisture}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider font-black text-muted-foreground block">Real-time Soil Moisture</span>
                          <span className={cn(
                            "text-[10px] font-black uppercase mt-0.5 block px-1.5 py-0.5 rounded border inline-block",
                            getMoistureStatus(activeDetails.moisture).color,
                            getMoistureStatus(activeDetails.moisture).bg
                          )}>
                            {getMoistureStatus(activeDetails.moisture).text}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider font-black text-muted-foreground block">Trigger Threshold</span>
                        <span className="text-xs font-black text-gray-800 dark:text-white mt-1 block">{activeDetails.threshold}% Moisture</span>
                      </div>
                    </div>
                  )}

                  {/* High Fidelity Technical Specs Table */}
                  <div className="space-y-2 pt-4">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground block mb-1">System Telemetry & Controls:</span>
                    {activeDetails.stats.map((stat, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/60 dark:bg-slate-900/40 rounded-xl border border-gray-150/40 dark:border-white/5 shadow-sm">
                        <span className="text-muted-foreground font-semibold">{stat.label}:</span>
                        <span className="font-bold text-gray-800 dark:text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Trigger Action / AI Advisory Override */}
                <div className="pt-4 border-t border-gray-200/50 dark:border-slate-800/40 mt-4 space-y-3.5">
                  <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-start gap-2.5">
                    <Lightbulb className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-relaxed text-indigo-700 dark:text-indigo-400 font-semibold">
                      <strong>AI Smart Recommendation:</strong> {activeDetails.tips}
                    </div>
                  </div>

                  {/* Manual Override Water Valves Control */}
                  {(activeDetails.id === "A" || activeDetails.id === "B" || activeDetails.id === "C") && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Power className="h-4 w-4 text-indigo-500" />
                        <span className="text-xs font-bold text-gray-850 dark:text-white">Valve Override</span>
                      </div>
                      <Switch 
                        checked={activeDetails.pump === "ON"} 
                        onCheckedChange={() => triggerZoneIrrigation(activeDetails.id)} 
                      />
                    </div>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Selector Guide Footer */}
            <div className="text-[10px] text-muted-foreground mt-4 text-center">
              Click any region of the isometric blueprint model to toggle telemetry metrics.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
