import { motion } from "framer-motion"
import { History, Clock, Thermometer, Sprout, CloudRain, CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HistoryChart } from "@/components/sections/history-chart"
import { useFarm } from "@/context/FarmContext"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
}

export function HistoryPage() {
  const { history } = useFarm()

  return (
    <motion.div
      className="space-y-6 py-6 max-w-7xl mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <History className="h-8 w-8 text-emerald-500" />
          Sensor History
        </h1>
        <p className="text-muted-foreground mt-1">View historical multi-zone sensor logs and environmental trends</p>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-none glass-container card-hover">
          <CardHeader className="border-b border-gray-50 dark:border-gray-800 pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Clock className="h-5 w-5 text-indigo-500" />
              Recent Soil Moisture Trends (Multi-Zone)
            </CardTitle>
            <CardDescription>Visualized area graphs representing moisture values over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[380px]">
              <HistoryChart data={history} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Readings Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-none glass-container card-hover">
          <CardHeader className="border-b border-gray-50 dark:border-gray-800 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-emerald-500" />
              Recent Telemetry Logs
            </CardTitle>
            <CardDescription>Detailed history record outputs from last sessions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Zone A (Banana)</th>
                    <th className="p-4">Zone B (Tomato)</th>
                    <th className="p-4">Zone C (Sugarcane)</th>
                    <th className="p-4">Water Consumption</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {history.length > 0 ? history.map((entry, idx) => (
                    <motion.tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all font-medium"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                    >
                      <td className="p-4 text-muted-foreground">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleString("en-IN") : '--'}
                      </td>
                      <td className="p-4 text-red-500 font-bold">{entry.moisture_A}%</td>
                      <td className="p-4 text-amber-500 font-bold">{entry.moisture_B}%</td>
                      <td className="p-4 text-emerald-500 font-bold">{entry.moisture_C}%</td>
                      <td className="p-4 text-indigo-500 font-bold">
                        {entry.water_used > 0 ? `${entry.water_used} Liters` : '0 L (Static)'}
                      </td>
                    </motion.tr>
                  )).reverse() : (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-muted-foreground font-semibold">
                        No telemetry logs reported yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
