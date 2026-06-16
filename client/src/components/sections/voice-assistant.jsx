import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, Globe, Command, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const SAMPLE_COMMANDS = {
  en: [
    { text: '"How much water is left?"', reply: "Borewell active. Storage tank has 3,850 liters remaining (77% capacity)." },
    { text: '"Water Zone A"', reply: "Opening solenoid valve for Zone A. Watering Banana crop now." },
    { text: '"What is the weather?"', reply: "Current temperature is 32.5°C, rain expected tonight." }
  ],
  hi: [
    { text: '"पानी कितना बचा है?"', reply: "भंडारण टैंक में 3,850 लीटर (77% क्षमता) पानी बचा है।" },
    { text: '"ज़ोन B को पानी दें"', reply: "ज़ोन B वाल्व खुला। टमाटर की फसल को पानी दिया जा रहा है।" }
  ],
  mr: [
    { text: '"पाणी किती शिल्लक आहे?"', reply: "पाण्याची टाकी ७७% भरलेली आहे, ३,८५० लिटर शिल्लक आहे।" },
    { text: '"झोन C पाणी सुरू करा"', reply: "झोन C मध्ये पाणी देणे सुरू केले आहे (ऊस पीक)।" }
  ]
}

export function VoiceAssistant() {
  const [lang, setLang] = useState("en")
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      return
    }

    setIsListening(true)
    setTranscript("Listening...")
    setResponse("")
    
    // Simulate speech-to-text recognition
    setTimeout(() => {
      setIsListening(false)
      const commands = SAMPLE_COMMANDS[lang]
      const randomCmd = commands[Math.floor(Math.random() * commands.length)]
      setTranscript(randomCmd.text)
      setLoading(true)
      
      setTimeout(() => {
        setLoading(false)
        setResponse(randomCmd.reply)
      }, 1000)
    }, 2500)
  }

  const triggerSampleCommand = (cmdText, cmdReply) => {
    setTranscript(cmdText)
    setLoading(true)
    setResponse("")
    setTimeout(() => {
      setLoading(false)
      setResponse(cmdReply)
    }, 800)
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/60 backdrop-blur-xl border border-indigo-500/10 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <CardHeader className="pb-3 border-b border-white/5">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            AI Voice Assistant (Beta)
          </CardTitle>
          <div className="flex gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10">
            <Button
              size="xs"
              variant={lang === "en" ? "secondary" : "ghost"}
              onClick={() => setLang("en")}
              className="px-2 py-0.5 h-6 text-[10px] text-white hover:text-white"
            >
              EN
            </Button>
            <Button
              size="xs"
              variant={lang === "hi" ? "secondary" : "ghost"}
              onClick={() => setLang("hi")}
              className="px-2 py-0.5 h-6 text-[10px] text-white hover:text-white"
            >
              हिं
            </Button>
            <Button
              size="xs"
              variant={lang === "mr" ? "secondary" : "ghost"}
              onClick={() => setLang("mr")}
              className="px-2 py-0.5 h-6 text-[10px] text-white hover:text-white"
            >
              मरा
            </Button>
          </div>
        </div>
        <CardDescription className="text-white/60">
          Control your farm and query telemetry hands-free
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="flex justify-center py-4">
          <motion.div
            animate={isListening ? {
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 rgba(139, 92, 246, 0.4)",
                "0 0 0 15px rgba(139, 92, 246, 0.15)",
                "0 0 0 0 rgba(139, 92, 246, 0)",
              ]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="rounded-full"
          >
            <Button
              onClick={toggleListening}
              size="lg"
              className={`w-20 h-20 rounded-full flex items-center justify-center border ${
                isListening
                  ? "bg-purple-600 border-purple-400 text-white"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {isListening ? (
                <Mic className="h-8 w-8 animate-bounce" />
              ) : (
                <MicOff className="h-8 w-8" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Live status / transcript */}
        {(transcript || response || loading) && (
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
            {transcript && (
              <div className="flex items-start gap-2.5 text-sm">
                <Command className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white/60 text-xs">Recognized Query</span>
                  <p className="font-medium italic">{transcript}</p>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="flex items-center gap-2 text-xs text-white/50 pt-2 border-t border-white/5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span>Processing command...</span>
              </div>
            )}

            {response && (
              <div className="flex items-start gap-2.5 text-sm pt-2 border-t border-white/5">
                <Volume2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-emerald-400 text-xs font-semibold">Response</span>
                  <p className="font-semibold text-emerald-300">{response}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sample commands helper */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-white/40 block">Try clicking a sample query:</span>
          <div className="grid grid-cols-1 gap-2">
            {SAMPLE_COMMANDS[lang].map((cmd, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => triggerSampleCommand(cmd.text, cmd.reply)}
                className="justify-start text-left bg-white/5 border-white/5 text-xs text-white/80 hover:bg-white/10 hover:text-white rounded-lg h-auto py-2 px-3"
              >
                {cmd.text}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
