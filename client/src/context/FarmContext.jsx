import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const FarmContext = createContext();

export function useFarm() {
  return useContext(FarmContext);
}

export function FarmProvider({ children }) {
  const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000/api"
    : "/api";

  const [zones, setZones] = useState([
    {
      "id": "A",
      "name": "Zone A - North Plantation",
      "crop_type": "Banana",
      "moisture": 45,
      "moisture_raw": 562,
      "moisture_threshold": 50,
      "pump_status": "OFF",
      "auto_mode": true,
      "water_flow_rate": 15.2
    },
    {
      "id": "B",
      "name": "Zone B - Greenhouse Beta",
      "crop_type": "Tomato",
      "moisture": 38,
      "moisture_raw": 634,
      "moisture_threshold": 40,
      "pump_status": "OFF",
      "auto_mode": true,
      "water_flow_rate": 8.5
    },
    {
      "id": "C",
      "name": "Zone C - South Ridge",
      "crop_type": "Sugarcane",
      "moisture": 62,
      "moisture_raw": 389,
      "moisture_threshold": 55,
      "pump_status": "OFF",
      "auto_mode": true,
      "water_flow_rate": 20.0
    }
  ]);
  const [tankStatus, setTankStatus] = useState({
    storage_level_liters: 3850,
    storage_capacity_liters: 5000,
    borewell_status: "STANDBY",
    borewell_flow_rate: 25.0,
    safety_warning: "NONE",
    estimated_hours_left: 48
  });
  const [solarStatus, setSolarStatus] = useState({
    battery_pct: 82,
    charging: true,
    solar_output_watts: 480,
    pump_consumption_watts: 0,
    solar_efficiency: 94.5,
    grid_backup_active: false
  });
  const [weatherForecast, setWeatherForecast] = useState({
    current_temp: 32.5,
    current_humidity: 42.0,
    current_rain_prob: 12.0,
    rain_expected_6h: false,
    rain_expected_24h: true,
    forecast_description: "Clear day, light drizzle expected tonight",
    recommended_delay_hours: 0
  });
  const [waterSavings, setWaterSavings] = useState({
    total_consumed_liters: 124500,
    total_saved_liters: 38900,
    efficiency_percentage: 31.2
  });
  const [history, setHistory] = useState([
    { timestamp: "2026-06-10T08:00:00Z", moisture_A: 65, moisture_B: 55, moisture_C: 70, water_used: 1200, solar_power: 350, battery: 60 },
    { timestamp: "2026-06-11T08:00:00Z", moisture_A: 58, moisture_B: 48, moisture_C: 65, water_used: 950, solar_power: 410, battery: 75 },
    { timestamp: "2026-06-12T08:00:00Z", moisture_A: 50, moisture_B: 42, moisture_C: 60, water_used: 1400, solar_power: 450, battery: 85 },
    { timestamp: "2026-06-13T08:00:00Z", moisture_A: 44, moisture_B: 39, moisture_C: 56, water_used: 1800, solar_power: 490, battery: 90 },
    { timestamp: "2026-06-14T08:00:00Z", moisture_A: 60, moisture_B: 52, moisture_C: 68, water_used: 500, solar_power: 250, battery: 80 },
    { timestamp: "2026-06-15T08:00:00Z", moisture_A: 52, moisture_B: 45, moisture_C: 62, water_used: 1100, solar_power: 470, battery: 88 },
    { timestamp: "2026-06-16T08:00:00Z", moisture_A: 45, moisture_B: 38, moisture_C: 62, water_used: 1350, solar_power: 480, battery: 82 }
  ]);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [moistureForecast, setMoistureForecast] = useState({
    hourly_prognosis: [
      { time: "12:00", "Banana (Zone A)": 45, "Tomato (Zone B)": 38, "Sugarcane (Zone C)": 62 },
      { time: "13:00", "Banana (Zone A)": 44, "Tomato (Zone B)": 37, "Sugarcane (Zone C)": 61 },
      { time: "14:00", "Banana (Zone A)": 43, "Tomato (Zone B)": 36, "Sugarcane (Zone C)": 60 }
    ],
    daily_prognosis: []
  });
  const [loading, setLoading] = useState(true);

  // Core data fetcher
  const fetchAllData = useCallback(async () => {
    try {
      const [zonesRes, tankRes, solarRes, weatherRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/zones`).then(res => res.json()).catch(() => []),
        fetch(`${API_BASE}/tank`).then(res => res.json()).catch(() => null),
        fetch(`${API_BASE}/solar`).then(res => res.json()).catch(() => null),
        fetch(`${API_BASE}/weather`).then(res => res.json()).catch(() => null),
        fetch(`${API_BASE}/ai/moisture-depletion`).then(res => res.json()).catch(() => null)
      ]);

      if (zonesRes && zonesRes.length > 0) setZones(zonesRes);
      
      if (tankRes) {
        setTankStatus(tankRes);
      } else if (zonesRes && zonesRes.length > 0) {
        setTankStatus(prev => {
          const activePumps = zonesRes.filter(z => z.pump_status === "ON").length;
          const newLevel = activePumps > 0 ? Math.max(0, prev.storage_level_liters - 5) : Math.min(5000, prev.storage_level_liters + 2);
          return {
            ...prev,
            storage_level_liters: Math.round(newLevel),
            borewell_status: activePumps > 0 ? "ACTIVE" : "STANDBY",
            safety_warning: newLevel < 1000 ? "LOW_LEVEL" : "NONE",
            estimated_hours_left: activePumps > 0 ? Math.round(newLevel / 500) : 48
          };
        });
      }

      if (solarRes) setSolarStatus(solarRes);
      if (weatherRes) setWeatherForecast(weatherRes);
      if (historyRes) {
        setMoistureForecast(historyRes);
        const activeHistory = historyRes.hourly_prognosis.map((h, index) => ({
          timestamp: h.time,
          moisture_A: h["Banana (Zone A)"],
          moisture_B: h["Tomato (Zone B)"],
          moisture_C: h["Sugarcane (Zone C)"],
          water_used: index % 4 === 0 ? 150 : 0,
          solar_power: index % 3 === 0 ? 340 : 0,
          battery: 80 - index
        }));
        setHistory(activeHistory.reverse());
      }
    } catch (err) {
      console.error("Error fetching farm context data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 4000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Zone Actions
  const triggerZoneIrrigation = async (zoneId, command) => {
    try {
      const response = await fetch(`${API_BASE}/zones/${zoneId}/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command })
      });
      if (response.ok) {
        setZones(prev => prev.map(z => z.id === zoneId ? { ...z, pump_status: command } : z));
      }
    } catch (err) {
      console.error(`Error triggering zone ${zoneId}:`, err);
    }
  };

  const updateZoneConfig = async (zoneId, configData) => {
    try {
      const response = await fetch(`${API_BASE}/zones/${zoneId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configData)
      });
      if (response.ok) {
        const updated = await response.json();
        setZones(prev => prev.map(z => z.id === zoneId ? updated : z));
      }
    } catch (err) {
      console.error(`Error updating config for zone ${zoneId}:`, err);
    }
  };

  // AI Recommendations
  const fetchAICropRecommendations = async (soilType, moisture, temperature, rainfall) => {
    setAiLoading(true);
    try {
      const response = await fetch(`${API_BASE}/ai/crop-recommendation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soil_type: soilType,
          moisture: parseFloat(moisture),
          temperature: parseFloat(temperature),
          rainfall: parseFloat(rainfall)
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAiRecommendations(data);
      }
    } catch (err) {
      console.error("Error loading crop recommendations:", err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <FarmContext.Provider
      value={{
        zones,
        tankStatus,
        solarStatus,
        weatherForecast,
        waterSavings,
        history,
        aiRecommendations,
        aiLoading,
        moistureForecast,
        loading,
        triggerZoneIrrigation,
        updateZoneConfig,
        fetchAICropRecommendations,
        refreshData: fetchAllData
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}
