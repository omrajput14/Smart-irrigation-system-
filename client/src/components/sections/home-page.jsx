import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Sprout, BarChart2, Droplet, Sun, Zap, CloudRain, Thermometer, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 240, damping: 20 } },
}

const heroVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 18 } },
}

export function HomePage() {
  const features = [
    { icon: Droplet, title: "Smart Irrigation", description: "Automated watering cycles calibrated around real-time soil moisture sensors.", color: "text-blue-500", bg: "bg-blue-500/10", glow: "glow-blue" },
    { icon: Sun, title: "Solar Powered", description: "Eco-friendly energy tracking for clean pump extraction and battery preservation.", color: "text-yellow-500", bg: "bg-yellow-500/10", glow: "glow-yellow" },
    { icon: Thermometer, title: "Climate Analytics", description: "Monitor air temperature, humidity, and sunlight conditions in real-time.", color: "text-red-500", bg: "bg-red-500/10", glow: "glow-red" },
    { icon: CloudRain, title: "Precipitation Delay", description: "Automatic rain sensor triggers lock active pumps immediately to conserve reserves.", color: "text-cyan-500", bg: "bg-cyan-500/10", glow: "glow-cyan" },
    { icon: Zap, title: "AI Diagnostic Engine", description: "Intelligent scoring algorithms determine crop suitability and hydration demands.", color: "text-purple-500", bg: "bg-purple-500/10", glow: "glow-purple" },
    { icon: BarChart2, title: "Telemetry History", description: "Log sensors records and verify water savings statistics on visual charts.", color: "text-green-500", bg: "bg-green-500/10", glow: "glow-green" },
  ]

  return (
    <motion.div
      className="space-y-12 py-8 max-w-7xl mx-auto p-4 md:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ── HERO BANNER (Split-Grid Layout) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Left Side: Copy and CTAs */}
        <motion.div className="lg:col-span-7 space-y-6 text-left" variants={heroVariants}>
          <motion.div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/10 neon-glow-emerald"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              <Sprout className="h-4 w-4" />
            </motion.div>
            Smart Agriculture System (v2)
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Grow Smarter with{" "}
            <span className="font-header bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-700 dark:from-emerald-400 dark:via-emerald-500 dark:to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(16,185,129,0.1)]">
              EcoIrrigate
            </span>
          </motion.h1>
          
          <motion.p
            className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            An autonomous farm intelligence platform powered by IoT telemetry, solar-grid power tracking, and crop-specific automation.
          </motion.p>
          
          <motion.div
            className="flex gap-4 items-center flex-wrap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link to="/dashboard">
              <Button size="lg" className="h-12 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-103 hover:-translate-y-0.5 transition-all">
                <BarChart2 className="mr-2 h-4 w-4" />
                Open Control Center
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="h-12 text-xs font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-103 hover:-translate-y-0.5 transition-all glass-container">
                Learn Architecture
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side: Large Detailed Smart Farm Ecosystem SVG Scene */}
        <motion.div 
          className="lg:col-span-5 w-full flex items-center justify-center p-2"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <div className="w-full max-w-[360px] aspect-square relative rounded-2xl overflow-hidden glass-container border border-white/20 dark:border-white/5 p-4 shadow-xl flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 300 300">
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="60%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="skyGradDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#166534" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>
                <linearGradient id="sunGrad" x1="0" y1="0" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="solarGlass" x1="0" y1="0" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Sky Background Circle */}
              <circle cx="150" cy="150" r="130" fill="url(#skyGrad)" className="dark:hidden" />
              <circle cx="150" cy="150" r="130" fill="url(#skyGradDark)" className="hidden dark:block" />

              <g clipPath="url(#border-clip)">
                <clipPath id="border-clip">
                  <circle cx="150" cy="150" r="128" />
                </clipPath>

                {/* Rotating Sun */}
                <g transform="translate(60, 75)">
                  <circle cx="0" cy="0" r="20" fill="url(#sunGrad)" className="animate-sun-spin" />
                  <circle cx="0" cy="0" r="26" fill="rgba(251, 191, 36, 0.2)" className="animate-pulse" />
                </g>

                {/* Clouds */}
                <g className="animate-cloud-drift text-white/80 dark:text-slate-400/40">
                  <path d="M 170,60 C 166,60 162,63 162,67 C 162,67.5 162.2,68 162.3,68.5 C 160,69.5 158.5,71.5 158.5,74 C 158.5,77.5 161.5,80 165,80 L 195,80 C 198.5,80 201,77.5 201,74 C 201,71 199,69 196.5,68.5 C 196.3,63 192,60 186.5,60 Z" fill="currentColor" />
                  <path d="M 80,45 C 77,45 74.5,47.5 74.5,51 C 74.5,51.5 74.6,52 74.7,52.5 C 72.5,53.5 71,55.5 71,58 C 71,61.5 74,64 77.5,64 L 105,64 C 108.5,64 111,61.5 111,58 C 111,55 109,53 106.5,52.5 C 106.3,47.5 102.5,45 98,45 Z" fill="currentColor" opacity="0.6" />
                </g>

                {/* Rolling Green Hills */}
                <path d="M 10 240 Q 90 170 180 210 T 300 190 L 300 300 L 10 300 Z" fill="url(#hillGrad2)" />
                <path d="M 10 260 Q 110 200 210 230 T 300 220 L 300 300 L 10 300 Z" fill="url(#hillGrad1)" />

                {/* Swaying Crops */}
                {/* Crop 1 (Banana Tree Left) */}
                <g transform="translate(45, 220) scale(0.9)">
                  {/* Trunk */}
                  <path d="M 10 50 Q 8 25 15 0" stroke="#854d0e" strokeWidth="3" fill="none" />
                  {/* Leaves */}
                  <g className="animate-sway" style={{ transformOrigin: "15px 0px" }}>
                    <path d="M 15 0 Q -10 -15 -25 -5 Q -10 0 15 0" fill="#22c55e" />
                    <path d="M 15 0 Q 30 -25 50 -15 Q 35 0 15 0" fill="#15803d" />
                    <path d="M 15 0 Q 0 -30 -10 -45 Q 5 -30 15 0" fill="#16a34a" />
                  </g>
                </g>

                {/* Crop 2 (Tomato Sprout Center) */}
                <g transform="translate(130, 245) scale(0.8)">
                  <path d="M 10 30 Q 12 15 8 0" stroke="#166534" strokeWidth="2.5" fill="none" />
                  <g className="animate-sway-delayed" style={{ transformOrigin: "8px 0px" }}>
                    {/* Tomatoes */}
                    <circle cx="2" cy="-2" r="5" fill="#ef4444" />
                    <circle cx="16" cy="3" r="4" fill="#ea580c" />
                    {/* Foliage */}
                    <path d="M 8 0 Q -5 -8 -12 2 Q -2 4 8 0" fill="#22c55e" />
                    <path d="M 8 0 Q 20 -10 28 -2 Q 18 3 8 0" fill="#15803d" />
                  </g>
                </g>

                {/* Crop 3 (Sugarcane Right) */}
                <g transform="translate(225, 215) scale(0.95)">
                  {/* Jointed stalks */}
                  <rect x="0" y="10" width="3" height="40" fill="#15803d" rx="1" />
                  <rect x="8" y="0" width="3.5" height="50" fill="#16a34a" rx="1" />
                  <rect x="16" y="15" width="2.5" height="35" fill="#22c55e" rx="1" />
                  {/* Arching Leaves */}
                  <g className="animate-sway" style={{ transformOrigin: "8px 0px" }}>
                    <path d="M 10 0 Q -15 -10 -25 -2" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 10 0 Q 30 -12 45 -5" fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                </g>

                {/* Solar Panel Setup (Floating Above Field) */}
                <g transform="translate(210, 110)">
                  {/* Stand */}
                  <line x1="20" y1="20" x2="20" y2="45" stroke="#475569" strokeWidth="3" />
                  {/* Panel Grid */}
                  <g transform="rotate(-15 20 20)">
                    <rect x="0" y="5" width="40" height="25" fill="url(#solarGlass)" rx="2" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="20" y1="5" x2="20" y2="30" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="0" y1="13" x2="40" y2="13" stroke="#e2e8f0" strokeWidth="0.8" />
                    <line x1="0" y1="21" x2="40" y2="21" stroke="#e2e8f0" strokeWidth="0.8" />
                  </g>
                </g>

                {/* Power Lines connecting Solar to Battery */}
                <path d="M 215 135 L 175 145" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow-reverse" />

                {/* Battery Charging block */}
                <g transform="translate(145, 135)">
                  <rect x="0" y="0" width="24" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-slate-600" />
                  <rect x="2" y="2" width="16" height="10" rx="1" fill="#10b981" className="animate-pulse" />
                  <rect x="25" y="4" width="2" height="6" rx="0.5" fill="currentColor" className="text-slate-400 dark:text-slate-600" />
                </g>

                {/* Irrigation Water lines connecting Battery/Controller to Sprinkler */}
                <path d="M 145 142 L 115 155" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow-forward" />

                {/* Sprinkler Spraying Water droplets */}
                <g transform="translate(105, 160)">
                  {/* Stand */}
                  <rect x="-1.5" y="0" width="3" height="15" fill="#475569" />
                  <rect x="-3" y="-2" width="6" height="3" fill="#334155" />
                  {/* Spray droplets */}
                  <g stroke="#7dd3fc" strokeWidth="1" fill="none" opacity="0.8">
                    <path d="M -3,-2 Q -12,-15 -24,-8" strokeDasharray="2 3" className="animate-flow-reverse" />
                    <path d="M 3,-2 Q 12,-15 24,-8" strokeDasharray="2 3" className="animate-flow-forward" />
                  </g>
                </g>

                {/* Ring border frame */}
                <circle cx="150" cy="150" r="129" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" className="dark:stroke-white/10 stroke-slate-900/10" />
              </g>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* ── CORE FEATURES ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className={cn(
              "border-none glass-container card-hover sensor-card-glow transition-all duration-300 h-full", 
              feature.glow
            )}>
              <CardContent className="p-6 space-y-4">
                <motion.div
                  className={cn("w-12 h-12 rounded-xl flex items-center justify-center", feature.bg)}
                  whileHover={{ scale: 1.12, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 450, damping: 15 }}
                >
                  <feature.icon className={cn("h-6 w-6", feature.color)} />
                </motion.div>
                <div className="space-y-1.5">
                  <h3 className="font-header text-base font-bold text-foreground">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-body">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── STATS DASHBOARD ── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {[
          { label: "Active Sensors", value: "8 Channels", color: "text-emerald-500", glow: "neon-glow-emerald" },
          { label: "Live Data Feed", value: "3s Intervals", color: "text-blue-500", glow: "" },
          { label: "Water Conservation", value: "Save 40%", color: "text-cyan-500", glow: "" },
          { label: "Solar Energy Conversion", value: "94.5% Ratio", color: "text-yellow-500", glow: "" },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={statVariants}>
            <Card className="border-none glass-container text-center p-5 card-hover overflow-hidden">
              <motion.div
                className={cn("text-xl font-bold font-telemetry", stat.color, stat.glow)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 20 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground mt-1 tracking-wider font-header">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
