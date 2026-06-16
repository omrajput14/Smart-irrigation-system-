import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const BlynkContext = createContext();

export function useBlynk() {
  return useContext(BlynkContext);
}

export function BlynkProvider({ children }) {
  const TOKEN = "ZGx1T1Fr-mDX49Y5IEkOjiRvryrM8r_o";
  const BLYNK_BASE = `https://blynk.cloud/external/api`;

  const [sensorData, setSensorData] = useState({
    moisture: 0,
    temperature: 0,
    pumpStatus: "OFF", // String ("ON"/"OFF")
    rainLevel: "Clear", // String ("Rain"/"Clear")
    command: 0, // Number (0 or 1)
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlynkData = useCallback(async () => {
    try {
      // V0 = Moisture, V6 = Temperature, V5 = Pump Status, V7 = Rain, V1 = Command/Mode
      const endpoints = ["V0", "V6", "V5", "V7", "V1"];
      const results = await Promise.all(
        endpoints.map(pin =>
          fetch(`${BLYNK_BASE}/get?token=${TOKEN}&${pin}`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json().catch(() => res.text());
            })
            // If individual fetch fails, return null to keep previous value
            .catch(err => {
              console.error(`Error fetching pin ${pin}:`, err);
              return null;
            })
        )
      );

      setSensorData(prev => {
        // Parse helper
        const parse = (val, fallback) => {
          if (val === null || val === undefined || val === "") return fallback;
          const rawValue = Array.isArray(val) ? val[0] : val;
          if (rawValue === null || rawValue === undefined || rawValue === "") return fallback;
          
          const strVal = String(rawValue).trim();
          const numVal = Number(strVal);
          
          // If numeric -> convert to Number
          if (!isNaN(numVal) && strVal !== "") {
            return numVal;
          }
          // If string -> keep as string
          return strVal;
        };

        const parsedMoisture = parse(results[0], prev.moisture);
        const parsedTemperature = parse(results[1], prev.temperature);
        const parsedPumpStatus = parse(results[2], prev.pumpStatus);
        const parsedRainLevel = parse(results[3], prev.rainLevel);
        const parsedCommand = parse(results[4], prev.command);

        // Enforce types as requested
        const newData = {
          moisture: typeof parsedMoisture === "number" ? parsedMoisture : Number(parsedMoisture) || 0,
          temperature: typeof parsedTemperature === "number" ? parsedTemperature : Number(parsedTemperature) || 0,
          pumpStatus: typeof parsedPumpStatus === "string" ? parsedPumpStatus : parsedPumpStatus ? "ON" : "OFF",
          rainLevel: typeof parsedRainLevel === "string" ? parsedRainLevel : parsedRainLevel ? "Rain" : "Clear",
          command: typeof parsedCommand === "number" ? parsedCommand : Number(parsedCommand) || 0,
        };

        // Ensure "ON"/"OFF" and "Rain"/"Clear" safety for physical bugs
        if (!["ON", "OFF"].includes(newData.pumpStatus)) {
             newData.pumpStatus = newData.pumpStatus == 1 ? "ON" : "OFF";
        }
        if (!["Rain", "Clear"].includes(newData.rainLevel)) {
             newData.rainLevel = newData.rainLevel == 1 ? "Rain" : "Clear";
        }

        // Update history locally safely inside state setter using newData
        setHistory(prevHist => {
          const newEntry = {
            timestamp: Date.now(),
            temperature: newData.temperature,
            moisture: newData.moisture,
            // Convert Rain string to numeric for the chart (Rain = 100%, Clear = 0%)
            rainLevel: newData.rainLevel === "Rain" ? 100 : 0, 
          };
          const updated = [...prevHist, newEntry];
          return updated.slice(-60); // Keep last 60 entries (~2 minutes)
        });

        return newData;
      });

      setLoading(false);
    } catch (error) {
      console.error("Critical error in fetchBlynkData:", error);
    }
  }, [TOKEN, BLYNK_BASE]);

  useEffect(() => {
    fetchBlynkData();
    const interval = setInterval(fetchBlynkData, 2000);
    return () => clearInterval(interval);
  }, [fetchBlynkData]);

  const turnPumpOn = async () => {
    try {
      await fetch(`${BLYNK_BASE}/update?token=${TOKEN}&V1=1`);
      setSensorData(prev => ({ ...prev, command: 1 }));
    } catch (error) {
      console.error("Error updating V1 to 1:", error);
    }
  };

  const turnPumpOff = async () => {
    try {
      await fetch(`${BLYNK_BASE}/update?token=${TOKEN}&V1=0`);
      setSensorData(prev => ({ ...prev, command: 0 }));
    } catch (error) {
      console.error("Error updating V1 to 0:", error);
    }
  };

  return (
    <BlynkContext.Provider value={{ sensorData, history, loading, turnPumpOn, turnPumpOff }}>
      {children}
    </BlynkContext.Provider>
  );
}
