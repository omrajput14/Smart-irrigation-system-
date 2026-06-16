import React from "react"
import { motion } from "framer-motion"
import { Sprout, Cpu, Wifi, Sun, CloudRain, Droplet, Thermometer, Zap, Database, Monitor } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const cV = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
}

const iV = { 
  hidden: { opacity: 0, y: 25 }, 
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } } 
}

export function AboutPage() {
  const techStack = [
    { name: "ESP8266", desc: "WiFi-enabled microcontroller", icon: Cpu, color: "text-blue-500", glow: "glow-blue" },
    { name: "Firebase RTDB", desc: "Real-time cloud database", icon: Database, color: "text-yellow-500", glow: "glow-yellow" },
    { name: "React.js", desc: "Frontend UI framework", icon: Monitor, color: "text-cyan-500", glow: "glow-cyan" },
    { name: "DHT11", desc: "Temperature & humidity sensor", icon: Thermometer, color: "text-red-500", glow: "glow-red" },
    { name: "Soil Moisture Sensor", desc: "Capacitive soil sensor", icon: Sprout, color: "text-green-500", glow: "glow-green" },
    { name: "Rain Sensor", desc: "Rain drop detection module", icon: CloudRain, color: "text-blue-400", glow: "glow-blue" },
    { name: "LDR Sensor", desc: "Light dependent resistor", icon: Sun, color: "text-yellow-400", glow: "glow-yellow" },
    { name: "Solar Panel", desc: "Renewable energy source", icon: Zap, color: "text-purple-500", glow: "glow-purple" },
  ]

  return (
    <motion.div className="space-y-8 py-6 max-w-7xl mx-auto p-4 md:p-6" initial="hidden" animate="visible" variants={cV}>
      {/* ── TOP HEADER ── */}
      <motion.div variants={iV} className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2.5">
          <motion.div animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}>
            <Sprout className="h-8 w-8 text-emerald-500 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          </motion.div>
          About EcoIrrigate
        </h1>
        <p className="text-sm text-muted-foreground">Learn about our intelligent IoT smart irrigation architecture</p>
      </motion.div>

      {/* ── SECTION 1: WHAT IS IT ── */}
      <motion.div variants={iV}>
        <Card className="border-none glass-container card-hover overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="text-lg">🌱</span> What is EcoIrrigate?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              EcoIrrigate is an intelligent, IoT-based smart irrigation platform designed to optimize water usage in agriculture and gardening.
              It integrates real-time environmental sensors, automated scheduling, clean solar power metrics, and predictive AI modeling to maximize crop health while minimizing resource depletion.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By monitoring moisture, temp, humidity, light intensity, and rainfall in real-time, our system decides when and how much to water. This data-driven precision helps farms conserve up to 40% of their water reserves compared to traditional timer-based methods.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── SYSTEM ARCHITECTURE PIPELINE DIAGRAM ── */}
      <motion.div variants={iV}>
        <Card className="border-none glass-container card-hover overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-500 animate-pulse" />
              EcoIrrigate IoT & Cloud Architecture Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 overflow-x-auto">
            <div className="min-w-[620px]">
              <svg className="w-full h-auto" viewBox="0 0 660 160">
                <defs>
                  <linearGradient id="primaryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="indigoGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </linearGradient>
                  <linearGradient id="yellowGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                  </filter>
                </defs>

                {/* --- PIPELINE CONNECTIONS (FLOW LINES) --- */}
                {/* 1. Sensors -> Edge */}
                <path d="M 95 80 L 155 80" fill="none" stroke="rgba(255,255,255,0.1)" className="dark:stroke-white/10 stroke-slate-900/10" strokeWidth="4" />
                <path d="M 95 80 L 155 80" fill="none" stroke="#10b981" strokeWidth="2.5" className="animate-flow-forward" />

                {/* 2. Edge -> Firebase */}
                <path d="M 235 80 L 295 80" fill="none" stroke="rgba(255,255,255,0.1)" className="dark:stroke-white/10 stroke-slate-900/10" strokeWidth="4" />
                <path d="M 235 80 L 295 80" fill="none" stroke="#6366f1" strokeWidth="2.5" className="animate-flow-forward" />

                {/* 3. Firebase <-> FastAPI */}
                <path d="M 375 75 L 435 75" fill="none" stroke="rgba(255,255,255,0.1)" className="dark:stroke-white/10 stroke-slate-900/10" strokeWidth="4" />
                <path d="M 375 75 L 435 75" fill="none" stroke="#fbbf24" strokeWidth="2.5" className="animate-flow-forward" />
                <path d="M 435 85 L 375 85" fill="none" stroke="rgba(255,255,255,0.1)" className="dark:stroke-white/10 stroke-slate-900/10" strokeWidth="4" />
                <path d="M 435 85 L 375 85" fill="none" stroke="#fbbf24" strokeWidth="2.5" className="animate-flow-reverse" />

                {/* 4. FastAPI -> Actuators */}
                <path d="M 515 80 L 575 80" fill="none" stroke="rgba(255,255,255,0.1)" className="dark:stroke-white/10 stroke-slate-900/10" strokeWidth="4" />
                <path d="M 515 80 L 575 80" fill="none" stroke="#10b981" strokeWidth="2.5" className="animate-flow-forward" />

                {/* --- NODES --- */}

                {/* NODE 1: SENSORS */}
                <g transform="translate(15, 40)">
                  <rect width="80" height="80" rx="10" fill="url(#primaryGlow)" filter="url(#nodeShadow)" />
                  <g fill="white" transform="translate(28, 16)">
                    <path d="M 12 0 C 7 7 4 12 4 17 C 4 22 8 25 12 25 C 16 25 20 22 20 17 C 20 12 17 7 12 0 Z" />
                    <line x1="12" y1="2" x2="12" y2="23" stroke="#059669" strokeWidth="1.5" />
                  </g>
                  <text x="40" y="66" textAnchor="middle" fill="white" className="text-[9px] font-black tracking-wider">SENSORS</text>
                  <text x="40" y="54" textAnchor="middle" fill="white" className="text-[7px] font-medium opacity-80">DHT11/Soil</text>
                </g>

                {/* NODE 2: EDGE CONTROLLER */}
                <g transform="translate(155, 40)">
                  <rect width="80" height="80" rx="10" fill="url(#indigoGlow)" filter="url(#nodeShadow)" />
                  <g stroke="white" strokeWidth="1.5" fill="none" transform="translate(28, 14)">
                    <rect x="2" y="2" width="20" height="20" rx="2" />
                    <line x1="2" y1="7" x2="0" y2="7" />
                    <line x1="2" y1="12" x2="0" y2="12" />
                    <line x1="2" y1="17" x2="0" y2="17" />
                    <line x1="22" y1="7" x2="24" y2="7" />
                    <line x1="22" y1="12" x2="24" y2="12" />
                    <line x1="22" y1="17" x2="24" y2="17" />
                    <line x1="7" y1="2" x2="7" y2="0" />
                    <line x1="12" y1="2" x2="12" y2="0" />
                    <line x1="17" y1="2" x2="17" y2="0" />
                    <line x1="7" y1="22" x2="7" y2="24" />
                    <line x1="12" y1="22" x2="12" y2="24" />
                    <line x1="17" y1="22" x2="17" y2="24" />
                    <circle cx="12" cy="12" r="3" fill="white" />
                  </g>
                  <text x="40" y="66" textAnchor="middle" fill="white" className="text-[9px] font-black tracking-wider">ESP8266</text>
                  <text x="40" y="54" textAnchor="middle" fill="white" className="text-[7px] font-medium opacity-80">IoT Edge</text>
                </g>

                {/* NODE 3: FIREBASE RTDB */}
                <g transform="translate(295, 40)">
                  <rect width="80" height="80" rx="10" fill="url(#yellowGlow)" filter="url(#nodeShadow)" />
                  <g fill="white" transform="translate(28, 14)">
                    <path d="M12 2 C 5 2 2 4.5 2 7.5 C 2 10.5 5 13 12 13 C 19 13 22 10.5 22 7.5 C 22 4.5 19 2 12 2 Z" />
                    <path d="M2 7.5 L2 14 C 2 17 5 19.5 12 19.5 C 19 19.5 22 17 22 14 L22 7.5 C 22 10.5 19 12 12 12 C 5 12 2 10.5 2 7.5 Z" />
                    <path d="M2 14 L2 20.5 C 2 23.5 5 26 12 26 C 19 26 22 23.5 22 20.5 L22 14 C 22 17 19 18.5 12 18.5 C 5 18.5 2 17 2 14 Z" opacity="0.8" />
                  </g>
                  <text x="40" y="66" textAnchor="middle" fill="white" className="text-[9px] font-black tracking-wider">FIREBASE</text>
                  <text x="40" y="54" textAnchor="middle" fill="white" className="text-[7px] font-medium opacity-80">Realtime DB</text>
                </g>

                {/* NODE 4: FASTAPI GATEWAY */}
                <g transform="translate(435, 40)">
                  <rect width="80" height="80" rx="10" fill="url(#indigoGlow)" filter="url(#nodeShadow)" />
                  <g fill="white" transform="translate(28, 14)">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="1.5" />
                    <path d="M12 4 L12 12 L17 14.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="1.5" />
                  </g>
                  <text x="40" y="66" textAnchor="middle" fill="white" className="text-[9px] font-black tracking-wider">FASTAPI</text>
                  <text x="40" y="54" textAnchor="middle" fill="white" className="text-[7px] font-medium opacity-80">AI Scorer</text>
                </g>

                {/* NODE 5: ACTUATORS */}
                <g transform="translate(575, 40)">
                  <rect width="80" height="80" rx="10" fill="url(#primaryGlow)" filter="url(#nodeShadow)" />
                  <g stroke="white" strokeWidth="1.5" fill="none" transform="translate(28, 14)">
                    <path d="M 2 4 L 22 20 L 22 4 L 2 20 Z" fill="rgba(255,255,255,0.2)" />
                    <rect x="10" y="8" width="4" height="8" fill="white" />
                  </g>
                  <text x="40" y="66" textAnchor="middle" fill="white" className="text-[9px] font-black tracking-wider">ACTUATORS</text>
                  <text x="40" y="54" textAnchor="middle" fill="white" className="text-[7px] font-medium opacity-80">Pumps/Valves</text>
                </g>
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed text-center">
              EcoIrrigate edge sensors query local soil conditions every 3 seconds. The telemetry updates Firebase dynamically, which communicates bi-directionally with our FastAPI AI engine to calculate water budget optimization scores and trigger pump relays.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── SECTION 2: HOW IT WORKS ── */}
      <motion.div variants={iV}>
        <Card className="border-none glass-container card-hover overflow-hidden">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold">⚙️ How It Works</CardTitle></CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Wifi, color: "text-blue-500", bg: "bg-blue-500/10", title: "1. Sense", desc: "ESP microcontrollers poll capacitive moisture, temperature, and meteorological sensors every 3 seconds." },
                { icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10", title: "2. Analyze", desc: "An intelligent diagnostic scorer evaluates temperature spikes, soil drainage, and solar charge states." },
                { icon: Droplet, color: "text-emerald-500", bg: "bg-emerald-500/10", title: "3. Irrigate", desc: "Pump relays fire automatically during high-battery hours. Rain sensor triggers auto-bypass locks immediately." },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-150 dark:border-gray-850 text-center"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <motion.div
                    className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4", step.bg)}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
                  >
                    <step.icon className={cn("h-6 w-6", step.color)} />
                  </motion.div>
                  <h3 className="font-bold text-sm mb-2 text-gray-800 dark:text-gray-100">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── SECTION 3: TECH STACK ── */}
      <motion.div variants={iV}>
        <Card className="border-none glass-container card-hover overflow-hidden">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold">🛠️ Technology Stack</CardTitle></CardHeader>
          <CardContent className="pt-2">
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" variants={cV}>
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-150 dark:border-gray-850 transition-all hover:bg-white dark:hover:bg-gray-800/40 sensor-card-glow"
                  variants={iV}
                  whileHover={{ scale: 1.02, x: 2 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gray-150/50 dark:bg-gray-750/50 flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 12 }}
                  >
                    <tech.icon className={cn("h-5 w-5", tech.color)} />
                  </motion.div>
                  <div>
                    <div className="font-bold text-xs text-gray-800 dark:text-gray-100">{tech.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{tech.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── FOOTER SIGNATURE ── */}
      <motion.div variants={iV}>
        <Card className="border-none glass-container overflow-hidden">
          <CardContent className="p-6 text-center space-y-3.5">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Built with ❤️ by Om Rajput</h3>
            <p className="text-xs text-muted-foreground">Smart Irrigation System — IoT + Firebase + React + FastAPI</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {[
                { label: "IoT", cls: "bg-green-100/60 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-500/10 neon-glow-emerald" },
                { label: "Firebase", cls: "bg-blue-100/60 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-500/10" },
                { label: "React", cls: "bg-purple-100/60 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-500/10" },
                { label: "Solar", cls: "bg-yellow-100/60 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 border border-yellow-500/10" },
              ].map((b) => (
                <Badge key={b.label} className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold border-0", b.cls)}>{b.label}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
