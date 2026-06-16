import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, LineChart, Line
} from "recharts";

// Custom premium tooltip
export const AnimatedTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="backdrop-blur-xl bg-slate-950/90 border border-slate-800 p-3 rounded-2xl shadow-2xl z-50 min-w-[200px]"
      >
        <p className="font-bold text-white text-xs mb-2 border-b border-white/10 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs py-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-400">{entry.name}:</span>
            </div>
            <span className="font-bold" style={{ color: entry.color }}>
              {entry.value != null ? Number(entry.value).toFixed(0) : "--"}
              {entry.name.includes("Moisture") ? "%" : entry.name.includes("Watts") ? " W" : " L"}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

const AnimatedLegend = ({ payload }) => (
  <motion.div
    className="flex flex-wrap justify-center gap-4 mt-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    {payload?.map((entry, index) => (
      <motion.div
        key={entry.value}
        className="flex items-center gap-2 text-xs bg-slate-900/50 dark:bg-slate-800/20 border border-slate-800 px-3 py-1.5 rounded-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 + index * 0.05 }}
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
        <span className="text-slate-400 font-semibold">{entry.value}</span>
      </motion.div>
    ))}
  </motion.div>
);

export function HistoryChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-3">
        <div className="text-4xl animate-pulse">📊</div>
        <p className="text-slate-500 text-sm">No historical data logs loaded</p>
      </div>
    );
  }

  // Format timestamp for display (e.g. HH:MM or date)
  const chartData = data.map(item => {
    let timeLabel = item.timestamp;
    try {
      const date = new Date(item.timestamp);
      timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      // Keep string if it's already pre-formatted
    }
    return {
      ...item,
      time: timeLabel
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="moistAGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="moistBGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="moistCGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(128,128,128,0.08)"
          vertical={false}
        />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          axisLine={{ stroke: "rgba(128,128,128,0.1)" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          axisLine={{ stroke: "rgba(128,128,128,0.1)" }}
          tickLine={false}
        />
        <Tooltip content={<AnimatedTooltip />} />
        <Legend content={<AnimatedLegend />} />

        <Area
          type="monotone"
          dataKey="moisture_A"
          name="Banana (Zone A) Moisture"
          stroke="#ef4444"
          strokeWidth={2.5}
          fill="url(#moistAGradient)"
          animationDuration={1000}
        />
        <Area
          type="monotone"
          dataKey="moisture_B"
          name="Tomato (Zone B) Moisture"
          stroke="#f59e0b"
          strokeWidth={2.5}
          fill="url(#moistBGradient)"
          animationDuration={1200}
        />
        <Area
          type="monotone"
          dataKey="moisture_C"
          name="Sugarcane (Zone C) Moisture"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#moistCGradient)"
          animationDuration={1400}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function EnergyConsumptionChart({ data = [] }) {
  if (data.length === 0) return null;
  const chartData = data.map(item => {
    let timeLabel = item.timestamp;
    try {
      const date = new Date(item.timestamp);
      timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {}
    return {
      ...item,
      time: timeLabel
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#eab308" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.08)" vertical={false} />
        <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip content={<AnimatedTooltip />} />
        <Area type="monotone" dataKey="solar_power" name="Solar Generation (Watts)" stroke="#eab308" strokeWidth={2} fill="url(#solarGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function WaterUsageBarChart({ data = [] }) {
  if (data.length === 0) return null;
  const chartData = data.map(item => {
    let timeLabel = item.timestamp;
    try {
      const date = new Date(item.timestamp);
      timeLabel = date.toLocaleDateString([], { weekday: 'short' });
    } catch {}
    return {
      ...item,
      time: timeLabel
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.08)" vertical={false} />
        <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip content={<AnimatedTooltip />} />
        <Bar dataKey="water_used" name="Water Consumed (Liters)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
