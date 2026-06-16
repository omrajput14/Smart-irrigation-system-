from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import database
from routes import zones, weather, solar, ai_engine
import datetime
import uvicorn

app = FastAPI(title="Smart Irrigation & Farm Intelligence API", version="2.0")

# Enable CORS for local React dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
        "http://localhost:5175", "http://127.0.0.1:5175",
        "http://localhost:5176", "http://127.0.0.1:5176",
        "http://localhost:3000", "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include sub-routers
app.include_router(zones.router)
app.include_router(weather.router)
app.include_router(solar.router)
app.include_router(ai_engine.router)

class TelemetryPayload(BaseModel):
    temperature: float
    humidity: float
    moisture: int
    moisture_raw: int = None
    lightLevel: int = None
    lightLevelRaw: int = None
    rainDrop: int = None
    rainDropRaw: int = None
    pumpStatus: str = None  # "ON" or "OFF"
    tankLevel: int = None   # Liters

@app.get("/api/status")
def get_system_status():
    return {
        "status": "online",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "api_version": "2.0.0-MVP"
    }

@app.get("/api/tank", tags=["tank"])
def get_tank():
    return database.get_tank_status()

@app.put("/api/tank", tags=["tank"])
def update_tank(payload: dict):
    return database.update_tank_status(payload)

@app.post("/api/telemetry")
def receive_telemetry(payload: TelemetryPayload):
    # Log incoming microcontroller sensor packets
    print(f"📥 Received ESP Telemetry: Temp={payload.temperature}°C, Moisture={payload.moisture}%, Rain={payload.rainDrop}%")
    
    # Update Zone moisture levels (simulate multi-zone mapping from single hardware sensor)
    # Zone A (Banana) uses the direct physical sensor reading
    database.update_zone("A", {
        "moisture": payload.moisture,
        "moisture_raw": payload.moisture_raw or int((100 - payload.moisture) * 10.23),
        "pump_status": payload.pumpStatus or "OFF"
    })
    
    # Simulate slightly offset values for Zone B and Zone C to populate charts realistically
    database.update_zone("B", {
        "moisture": max(0, payload.moisture - 7),
        "moisture_raw": min(1023, (payload.moisture_raw or 500) + 70)
    })
    database.update_zone("C", {
        "moisture": min(100, payload.moisture + 15),
        "moisture_raw": max(0, (payload.moisture_raw or 500) - 150)
    })
    
    # Update Weather Conditions cache
    database.update_weather_forecast({
        "current_temp": payload.temperature,
        "current_humidity": payload.humidity,
        "current_rain_prob": payload.rainDrop or 0.0,
        "rain_expected_6h": (payload.rainDrop or 0) > 40
    })
    
    # Update Tank Level if provided
    if payload.tankLevel is not None:
        database.update_tank_status({
            "storage_level_liters": payload.tankLevel,
            "safety_warning": "CRITICAL" if payload.tankLevel < 1000 else "NONE"
        })
        
    # Append to History Database for Analytics charts
    history_entry = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "moisture_A": payload.moisture,
        "moisture_B": max(0, payload.moisture - 7),
        "moisture_C": min(100, payload.moisture + 15),
        "water_used": 0 if payload.pumpStatus != "ON" else 25,  # 25 Liters per telemetry tick when running
        "solar_power": 320 if datetime.datetime.utcnow().hour in range(6, 18) else 0,
        "battery": 82
    }
    database.add_history_entry(history_entry)
    
    return {"status": "telemetry_logged"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
