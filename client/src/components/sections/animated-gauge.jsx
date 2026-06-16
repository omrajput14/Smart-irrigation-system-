import { useEffect, useRef, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

/**
 * AnimatedCircularGauge - A beautiful circular gauge with gradient stroke,
 * animated fill, and optional wave/glow/ripple effects.
 *
 * @param {number} value - Current value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} type - One of: "temperature", "humidity", "soilMoisture", "light", "rain"
 * @param {string} unit - Display unit (°C, %, etc.)
 * @param {string} label - Label text
 */
export function AnimatedCircularGauge({ value = 0, min = 0, max = 100, type = "default", unit = "%", label = "" }) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - percentage / 100)

  // Animated spring value for smooth number counting
  const springValue = useSpring(0, { stiffness: 50, damping: 20 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (v) => {
      setDisplayValue(Number(v.toFixed(1)))
    })
    return unsubscribe
  }, [springValue])

  // Color schemes per sensor type
  const getColors = () => {
    switch (type) {
      case "temperature":
        return {
          gradient: ["#ef4444", "#f97316", "#eab308"],
          glow: "rgba(239, 68, 68, 0.4)",
          bg: "rgba(239, 68, 68, 0.08)",
          accent: "#ef4444",
        }
      case "humidity":
        return {
          gradient: ["#3b82f6", "#06b6d4", "#22d3ee"],
          glow: "rgba(59, 130, 246, 0.4)",
          bg: "rgba(59, 130, 246, 0.08)",
          accent: "#3b82f6",
        }
      case "soilMoisture":
        return {
          gradient: ["#22c55e", "#16a34a", "#15803d"],
          glow: "rgba(34, 197, 94, 0.4)",
          bg: "rgba(34, 197, 94, 0.08)",
          accent: "#22c55e",
        }
      case "light":
        return {
          gradient: ["#eab308", "#f59e0b", "#fbbf24"],
          glow: "rgba(234, 179, 8, 0.4)",
          bg: "rgba(234, 179, 8, 0.08)",
          accent: "#eab308",
        }
      case "rain":
        return {
          gradient: ["#06b6d4", "#0891b2", "#0e7490"],
          glow: "rgba(6, 182, 212, 0.4)",
          bg: "rgba(6, 182, 212, 0.08)",
          accent: "#06b6d4",
        }
      default:
        return {
          gradient: ["#22c55e", "#16a34a", "#15803d"],
          glow: "rgba(34, 197, 94, 0.4)",
          bg: "rgba(34, 197, 94, 0.08)",
          accent: "#22c55e",
        }
    }
  }

  const colors = getColors()
  const gradientId = `gauge-gradient-${type}-${Math.random().toString(36).slice(2, 8)}`

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="relative w-36 h-36">
        {/* Glow effect behind gauge */}
        <motion.div
          className="absolute inset-2 rounded-full"
          animate={{
            boxShadow: [
              `0 0 15px ${colors.glow}, inset 0 0 15px ${colors.bg}`,
              `0 0 30px ${colors.glow}, inset 0 0 20px ${colors.bg}`,
              `0 0 15px ${colors.glow}, inset 0 0 15px ${colors.bg}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.gradient[0]} />
              <stop offset="50%" stopColor={colors.gradient[1]} />
              <stop offset="100%" stopColor={colors.gradient[2]} />
            </linearGradient>
            {/* Glow filter */}
            <filter id={`glow-${type}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700/50"
            strokeWidth="6"
          />

          {/* Tick marks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 360
            const radAngle = (angle * Math.PI) / 180
            const inner = 46
            const outer = 48
            return (
              <line
                key={i}
                x1={60 + inner * Math.cos(radAngle)}
                y1={60 + inner * Math.sin(radAngle)}
                x2={60 + outer * Math.cos(radAngle)}
                y2={60 + outer * Math.sin(radAngle)}
                stroke="currentColor"
                className="text-gray-300 dark:text-gray-600"
                strokeWidth="0.5"
              />
            )
          })}

          {/* Animated value arc */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            filter={`url(#glow-${type})`}
          />

          {/* End cap dot */}
          {percentage > 2 && (
            <motion.circle
              cx={60 + radius * Math.cos(((percentage / 100) * 360 - 90) * (Math.PI / 180))}
              cy={60 + radius * Math.sin(((percentage / 100) * 360 - 90) * (Math.PI / 180))}
              r="4"
              fill={colors.accent}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              filter={`url(#glow-${type})`}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold tabular-nums"
            key={displayValue}
          >
            {displayValue}
          </motion.span>
          <span className="text-xs text-muted-foreground font-medium">{unit}</span>
        </div>

        {/* Sensor-specific effects */}
        {type === "soilMoisture" && <WaveEffect percentage={percentage} color={colors.accent} />}
        {type === "temperature" && percentage > 60 && <HeatGlow />}
        {type === "humidity" && <RippleEffect color={colors.accent} />}
      </div>
    </div>
  )
}

/* ========== Sensor-Specific Visual Effects ========== */

/** Wave/liquid fill for soil moisture */
function WaveEffect({ percentage, color }) {
  return (
    <div className="absolute inset-4 rounded-full overflow-hidden pointer-events-none opacity-20">
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: `${percentage}%`,
          background: `linear-gradient(to top, ${color}, transparent)`,
        }}
        initial={{ height: "0%" }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        {/* SVG wave */}
        <svg
          className="absolute -top-2 left-0 w-full"
          viewBox="0 0 120 10"
          preserveAspectRatio="none"
          style={{ height: "8px" }}
        >
          <motion.path
            d="M0 5 Q15 0 30 5 Q45 10 60 5 Q75 0 90 5 Q105 10 120 5 V10 H0Z"
            fill={color}
            animate={{
              d: [
                "M0 5 Q15 0 30 5 Q45 10 60 5 Q75 0 90 5 Q105 10 120 5 V10 H0Z",
                "M0 5 Q15 10 30 5 Q45 0 60 5 Q75 10 90 5 Q105 0 120 5 V10 H0Z",
                "M0 5 Q15 0 30 5 Q45 10 60 5 Q75 0 90 5 Q105 10 120 5 V10 H0Z",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  )
}

/** Orange/red heat glow for temperature */
function HeatGlow() {
  return (
    <motion.div
      className="absolute inset-3 rounded-full pointer-events-none"
      animate={{
        boxShadow: [
          "inset 0 0 15px rgba(239, 68, 68, 0.1)",
          "inset 0 0 25px rgba(249, 115, 22, 0.2)",
          "inset 0 0 15px rgba(239, 68, 68, 0.1)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

/** Water ripple animation for humidity */
function RippleEffect({ color }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: color }}
          initial={{ width: 30, height: 30, opacity: 0.6 }}
          animate={{
            width: [30, 80],
            height: [30, 80],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

/**
 * AnimatedValue - Smooth counting number animation
 */
export function AnimatedValue({ value, decimals = 1, suffix = "" }) {
  const springValue = useSpring(0, { stiffness: 50, damping: 20 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  useEffect(() => {
    const unsub = springValue.on("change", (v) => {
      setDisplay(Number(v.toFixed(decimals)))
    })
    return unsub
  }, [springValue, decimals])

  return (
    <motion.span className="tabular-nums">
      {display}{suffix}
    </motion.span>
  )
}

/**
 * AnimatedBadge - Pulsing/glowing status badge with smooth transitions
 */
export function AnimatedBadge({ status, className = "" }) {
  const getStyle = () => {
    switch (status) {
      case "Optimal":
      case "Moist":
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 shadow-green-500/20"
      case "High":
      case "Bright Sunlight":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400 shadow-yellow-500/20"
      case "Low":
      case "Dry":
      case "Dim/Shadow":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 shadow-blue-500/20"
      case "Critical":
      case "Very High":
      case "Air/No Soil":
        return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 shadow-red-500/20"
      case "Wet/Water":
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400 shadow-cyan-500/20"
      case "Charging":
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 shadow-green-500/20"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-400"
    }
  }

  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-lg ${getStyle()} ${className}`}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: "currentColor" }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {status}
    </motion.span>
  )
}
