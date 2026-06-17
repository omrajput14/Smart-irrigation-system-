import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Home, BarChart2, History, PieChart, Lightbulb, Info, Menu, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/sections/theme-toggle"

export function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart2 },
    { name: "History", href: "/history", icon: History },
    { name: "Analysis", href: "/analysis", icon: PieChart },
    { name: "Insights", href: "/insights", icon: Lightbulb },
    { name: "About", href: "/about", icon: Info },
  ]

  return (
    <div className="flex min-h-screen flex-col mesh-bg transition-colors duration-500 pb-12">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 sticky top-0 z-50">
        <header className="w-full rounded-2xl border border-white/50 dark:border-white/5 bg-white/75 dark:bg-gray-950/65 backdrop-blur-md shadow-lg shadow-slate-900/5 dark:shadow-black/25">
          <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            {/* Logo — always visible */}
            <Link to="/" className="flex items-center space-x-2 mr-2 sm:mr-4">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8">
                <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8 text-primary">
                  <path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" />
                  <path fill="currentColor" d="M12,7V12L15,10.5L12,7" />
                </svg>
              </div>
              <span className="font-header font-black text-lg sm:text-xl text-primary tracking-tight hidden xs:inline">EcoIrrigate</span>
            </Link>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              className="px-2 text-base hover:bg-transparent focus-visible:ring-0 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">Toggle Menu</span>
            </Button>

            {/* Desktop nav */}
            <div className="hidden md:flex">
              <nav className="flex items-center gap-0.5 text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "font-header flex items-center px-3 lg:px-4 py-2 text-xs uppercase tracking-wider transition-all duration-200 rounded-lg relative",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary font-bold border border-primary/20"
                        : "text-foreground/60 hover:text-foreground/80 hover:bg-muted/50",
                    )}
                  >
                    <item.icon className="mr-1.5 h-3.5 w-3.5" />
                    <span className="hidden lg:inline">{item.name}</span>
                    <span className="lg:hidden text-xs">{item.name.split(" ")[0]}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center font-header text-xs uppercase tracking-wider">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
              <span className="text-muted-foreground">Connected</span>
            </div>
            {/* Mobile: just show green dot */}
            <div className="sm:hidden flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </div>

      {/* Animated mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Menu panel */}
            <motion.nav
              className="absolute top-14 left-0 right-0 bg-background border-b shadow-xl p-4 space-y-1"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "font-header flex items-center px-4 py-3 text-xs uppercase tracking-wider rounded-lg transition-colors",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary font-bold border border-primary/20"
                        : "text-foreground/60 hover:bg-muted/50",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <div className="container py-3 sm:py-4 px-3 sm:px-4">{children}</div>
      </main>
    </div>
  )
}
