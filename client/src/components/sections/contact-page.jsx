import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, Github, MapPin, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

export function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <motion.div className="space-y-6 py-6 max-w-7xl mx-auto p-4 md:p-6" initial="hidden" animate="visible" variants={cV}>
      {/* ── TOP HEADER ── */}
      <motion.div variants={iV} className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2.5">
          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}>
            <Mail className="h-8 w-8 text-emerald-500 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          </motion.div>
          Contact Us
        </h1>
        <p className="text-sm text-muted-foreground">Get in touch for questions, feedback, or collaboration</p>
      </motion.div>

      {/* ── CONTENT BODY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form panel */}
        <motion.div variants={iV}>
          <Card className="border-none glass-container card-hover overflow-hidden h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800 dark:text-gray-100">
                <MessageCircle className="h-5 w-5 text-indigo-500" />
                Send a Message
              </CardTitle>
              <CardDescription className="text-xs">Fill out the form and we'll get back to you shortly</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                {["name", "email"].map((field) => (
                  <div key={field} className="space-y-1.5">
                    <label className="block text-xs font-bold capitalize text-gray-700 dark:text-gray-300">{field}</label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      required
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-950 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
                      placeholder={field === "email" ? "your@email.com" : "Your name"}
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Message</label>
                  <textarea
                    required 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-950 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none font-semibold"
                    placeholder="Your message..."
                  />
                </div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full h-11 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </motion.div>
                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 text-center text-xs font-bold"
                    >
                      ✅ Message sent successfully!
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info panel */}
        <motion.div className="space-y-6" variants={cV}>
          <motion.div variants={iV}>
            <Card className="border-none glass-container card-hover overflow-hidden">
              <CardHeader className="pb-3"><CardTitle className="text-base font-bold">📬 Contact Information</CardTitle></CardHeader>
              <CardContent className="pt-2 space-y-4">
                {[
                  { icon: Mail, color: "text-blue-500", label: "Email", value: "omrajput@example.com" },
                  { icon: Github, color: "text-gray-500 dark:text-gray-300", label: "GitHub", value: "github.com/omrajputt369", link: "https://github.com/omrajputt369" },
                  { icon: MapPin, color: "text-red-500", label: "Location", value: "India" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-150 dark:border-gray-850 hover:bg-white dark:hover:bg-gray-800/40 transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                      <item.icon className={cn("h-5 w-5", item.color)} />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-800 dark:text-gray-200">{item.label}</div>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-emerald-500 text-xs font-semibold hover:underline mt-0.5 block">{item.value}</a>
                      ) : (
                        <div className="text-muted-foreground text-xs font-medium mt-0.5">{item.value}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={iV}>
            <Card className="border-none glass-container card-hover overflow-hidden">
              <CardHeader className="pb-3"><CardTitle className="text-base font-bold">🔗 Project Source</CardTitle></CardHeader>
              <CardContent className="pt-1">
                <motion.a
                  href="https://github.com/omrajputt369" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-150 dark:border-gray-850 hover:bg-white dark:hover:bg-gray-800/40 transition-all"
                  whileHover={{ scale: 1.01, x: 2 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-850 dark:text-gray-250 block">View Source Code</span>
                    <span className="text-[10px] text-muted-foreground">Clone, modify, or fork this repository</span>
                  </div>
                  <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold">Open Source</Badge>
                </motion.a>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
