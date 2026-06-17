import { motion, AnimatePresence } from "framer-motion"
import {
  Power,
  Gamepad2,
  Settings2,
  Droplets,
  Shield,
  Loader2,
  Wifi,
  Activity,
  Zap,
  CircleDot,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useBlynk } from "@/context/BlynkContext"
import { useState } from "react"

// Animation variants
const panelVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
}

const buttonVariants = {
  idle: { scale: 1 },
  tap: { scale: 0.93 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
}

const statusVariants = {
  initial: { opacity: 0, scale: 0.8, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
  exit: { opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.2 } },
}

export function RemoteControlPanel() {
  const { sensorData, loading, turnPumpOn, turnPumpOff } = useBlynk()
  const [actionLoading, setActionLoading] = useState(false)
  const [lastAction, setLastAction] = useState(null)

  // V5 is for pump status display
  const pumpStatus = sensorData.pumpStatus === "ON"

  // V1 controls mode and manual pump
  // V1 = 1 -> Manual ON, V1 = 0 -> Manual OFF (Auto mode active)
  const isAuto = sensorData.command === 0
  const isManual = sensorData.command === 1
  const synced = !loading;

  const handleCommand = async (commandValue) => {
    if (actionLoading) return
    setActionLoading(true)
    setLastAction(commandValue === 1 ? "on" : "off")
    try {
      if (commandValue === 1) {
        await turnPumpOn()
      } else {
        await turnPumpOff()
      }
    } finally {
      setTimeout(() => setActionLoading(false), 800) // debounce UI visual
    }
  }

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      <Card className={cn(
        "relative overflow-hidden glass-container soil-texture-glow border transition-all duration-700",
        pumpStatus
          ? "border-primary/40 shadow-lg shadow-primary/5"
          : "border-border/60"
      )}>
        {/* Animated top gradient bar */}
        <div
          className="h-1.5 w-full gradient-bar-animated"
          style={{
            background: pumpStatus
              ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))"
              : "linear-gradient(90deg, hsl(var(--muted-foreground)/0.2), hsl(var(--muted-foreground)/0.4), hsl(var(--muted-foreground)/0.2))",
            backgroundSize: "300% 100%",
          }}
        />

        {/* Glow overlay when pump is ON */}
        <AnimatePresence>
          {pumpStatus && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "radial-gradient(ellipse at center, hsla(var(--primary) / 0.05) 0%, transparent 70%)",
                boxShadow: "inset 0 0 60px hsla(var(--primary) / 0.08), 0 0 40px hsla(var(--primary) / 0.04)",
              }}
            />
          )}
        </AnimatePresence>

        <CardHeader className="pb-3 pt-5 z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-header font-bold">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  "bg-gradient-to-br from-primary to-emerald-800 text-primary-foreground shadow-lg shadow-primary/10"
                )}
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              >
                <Gamepad2 className="h-5 w-5" />
              </motion.div>
              <div>
                <span className="bg-gradient-to-r from-primary via-emerald-600 to-amber-700 dark:from-primary dark:to-amber-500 bg-clip-text text-transparent">
                  Remote Control Panel
                </span>
                <span className="ml-1.5">🎮</span>
                <div className="text-xs font-normal text-muted-foreground mt-0.5 font-body">
                  Manual system control & monitoring via Blynk
                </div>
              </div>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Pump status badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={pumpStatus ? "on" : "off"}
                  variants={statusVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-header font-semibold transition-all duration-500",
                      pumpStatus
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    <motion.div
                      animate={pumpStatus ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Droplets className={cn("h-3.5 w-3.5", pumpStatus ? "text-primary" : "text-muted-foreground")} />
                    </motion.div>
                    {pumpStatus ? "Pump Running 💧" : "Pump Stopped ❌"}
                  </Badge>
                </motion.div>
              </AnimatePresence>
              {/* Mode badge */}
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-header font-semibold transition-all duration-300",
                  isAuto
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800"
                )}
              >
                {isAuto ? <Settings2 className="h-3.5 w-3.5" /> : <Gamepad2 className="h-3.5 w-3.5" />}
                {isAuto ? "Auto Mode ⚙️" : "Manual Mode 🎮"}
              </Badge>
              {/* Sync indicator */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-header">
                <motion.div
                  className={cn("w-2 h-2 rounded-full", synced ? "bg-green-500" : "bg-yellow-500")}
                  animate={synced ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>{synced ? "Live" : "Syncing..."}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-5 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ────── LEFT: MODE TOGGLE ────── */}
            <div className={cn(
              "p-5 rounded-2xl border transition-all duration-500",
              "bg-gray-50/80 dark:bg-gray-800/60 border-gray-200/50 dark:border-gray-700/50"
            )}>
              <div className="flex items-center gap-3 mb-5">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                  isAuto
                    ? "bg-gradient-to-br from-blue-400 to-blue-600"
                    : "bg-gradient-to-br from-amber-400 to-amber-600"
                )}>
                  {isAuto ? <Settings2 className="h-5 w-5 text-white" /> : <Gamepad2 className="h-5 w-5 text-white" />}
                </div>
                <div>
                  <div className="font-semibold text-sm">Operating Mode</div>
                  <div className="text-xs text-muted-foreground">Sets V1 logic</div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="flex-1">
                  <Button
                    size="sm"
                    variant={isManual ? "default" : "outline"}
                    onClick={() => handleCommand(1)}
                    disabled={actionLoading || isManual}
                    className={cn(
                      "w-full h-12 text-sm font-semibold transition-all duration-300 rounded-xl",
                      isManual && "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 border-0"
                    )}
                  >
                    {actionLoading && lastAction === "on" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Gamepad2 className="h-4 w-4 mr-2" />
                    )}
                    Manual ON 🎮
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="flex-1">
                  <Button
                    size="sm"
                    variant={isAuto ? "default" : "outline"}
                    onClick={() => handleCommand(0)}
                    disabled={actionLoading || isAuto}
                    className={cn(
                      "w-full h-12 text-sm font-semibold transition-all duration-300 rounded-xl",
                      isAuto && "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-0"
                    )}
                  >
                    {actionLoading && lastAction === "off" ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Settings2 className="h-4 w-4 mr-2" />
                    )}
                    Auto OFF ⚙️
                  </Button>
                </motion.div>
              </div>

              {/* Auto mode message */}
              <AnimatePresence>
                {isAuto && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold mb-0.5">Auto Mode Active (V1=0)</div>
                        <div className="text-blue-600/80 dark:text-blue-400/80">
                          Pump is controlled by the irrigation algorithm based on real-time sensor data.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Manual mode hint */}
              <AnimatePresence>
                {isManual && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="font-semibold mb-0.5">Manual Mode Active (V1=1)</div>
                        <div className="text-amber-600/80 dark:text-amber-400/80">
                          Pump is forced ON manually.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ────── RIGHT: PUMP CONTROL ────── */}
            <div className={cn(
              "p-5 rounded-2xl border transition-all duration-700",
              pumpStatus
                ? "bg-primary/5 border-primary/30"
                : "bg-muted/45 border-border"
            )}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-500",
                  pumpStatus
                    ? "bg-gradient-to-br from-primary to-emerald-800 text-primary-foreground"
                    : "bg-muted text-muted-foreground border border-border"
                )}>
                  <motion.div
                    animate={pumpStatus ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Droplets className="h-5 w-5" />
                  </motion.div>
                </div>
                <div>
                  <div className="font-header font-semibold text-sm">Pump Control</div>
                  <div className="text-xs text-muted-foreground font-body">
                    Matches mode state
                  </div>
                </div>
                {/* Live indicator */}
                <div className="ml-auto flex items-center gap-1.5 font-header">
                  <motion.div
                    className={cn("w-2.5 h-2.5 rounded-full", pumpStatus ? "bg-primary" : "bg-muted-foreground/40")}
                    animate={pumpStatus ? { scale: [1, 1.6, 1], opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span className={cn(
                    "text-xs font-bold",
                    pumpStatus ? "text-primary" : "text-muted-foreground"
                  )}>
                    {pumpStatus ? "LIVE (V5=1)" : "OFF (V5=0)"}
                  </span>
                </div>
              </div>

              {/* Big pump status indicator */}
              <div className="flex justify-center mb-5">
                <motion.div
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-700 cursor-default relative overflow-hidden",
                    pumpStatus
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                      : "border-border bg-muted/40 shadow-inner"
                  )}
                  animate={pumpStatus ? {
                    boxShadow: [
                      "0 0 0 0 hsla(var(--primary) / 0)",
                      "0 0 0 16px hsla(var(--primary) / 0.12)",
                      "0 0 0 0 hsla(var(--primary) / 0)",
                    ],
                  } : {
                    boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={pumpStatus ? { rotate: [0, 360] } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Power className={cn(
                      "h-10 w-10 transition-colors duration-500",
                      pumpStatus ? "text-primary" : "text-muted-foreground/60"
                    )} />
                  </motion.div>
                </motion.div>
              </div>

              {/* Pump status text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={pumpStatus ? "running" : "stopped"}
                  variants={statusVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center mb-4 font-header"
                >
                  <div className={cn(
                    "text-lg font-bold",
                    pumpStatus ? "text-primary" : "text-muted-foreground"
                  )}>
                    {pumpStatus ? "Pump Running 💧" : "Pump Stopped ❌"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-body">
                    {pumpStatus ? "Water flow is active" : "No water flow"}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ON / OFF buttons */}
              <div className="flex gap-3">
                <motion.div variants={buttonVariants} whileHover={!isManual ? "hover" : undefined} whileTap={!isManual ? "tap" : undefined} className="flex-1">
                  <Button
                    id="pump-on-button"
                    onClick={() => handleCommand(1)}
                    disabled={isManual || actionLoading}
                    className={cn(
                      "w-full h-14 text-xs font-header font-bold transition-all duration-300 rounded-xl uppercase tracking-wider",
                      !isManual && !actionLoading
                        ? "bg-gradient-to-r from-primary to-emerald-700 hover:from-primary hover:to-emerald-800 text-primary-foreground shadow-lg shadow-primary/10 border-0"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {actionLoading && lastAction === "on" ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Power className="h-5 w-5 mr-2" />
                    )}
                    {actionLoading && lastAction === "on" ? "Starting..." : "ON"}
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover={!isAuto ? "hover" : undefined} whileTap={!isAuto ? "tap" : undefined} className="flex-1">
                  <Button
                    id="pump-off-button"
                    onClick={() => handleCommand(0)}
                    disabled={isAuto || actionLoading}
                    variant="outline"
                    className={cn(
                      "w-full h-14 text-xs font-header font-bold transition-all duration-300 rounded-xl uppercase tracking-wider",
                      !isAuto && !actionLoading
                        ? "border-destructive/30 text-destructive hover:bg-destructive/10 shadow-md shadow-destructive/5"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {actionLoading && lastAction === "off" ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Power className="h-5 w-5 mr-2" />
                    )}
                    {actionLoading && lastAction === "off" ? "Stopping..." : "OFF/AUTO"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 px-2 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs text-muted-foreground font-body">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>Polled from Blynk Cloud API</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-telemetry">
                <CircleDot className="h-3.5 w-3.5 text-primary" />
                <span>Commands: <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">V1</code></span>
              </div>
              <div className="flex items-center gap-1.5 font-telemetry">
                <Wifi className="h-3.5 w-3.5 text-primary" />
                <span>Status: <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">V5</code></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
