from fastapi import APIRouter
from pydantic import BaseModel
import database

router = APIRouter(prefix="/api/solar", tags=["solar"])

class SolarTelemetryModel(BaseModel):
    battery_pct: int
    charging: bool
    solar_output_watts: float
    pump_consumption_watts: float

@router.get("")
def get_solar():
    solar = database.get_solar_status()
    
    # Calculate Solar Efficiency
    # Efficiency is high if solar output matches or exceeds load
    if solar["solar_output_watts"] > 0:
        eff = min(100.0, (solar["solar_output_watts"] / 500.0) * 100.0) # max capacity 500W
        solar["solar_efficiency"] = round(eff, 1)
    else:
        solar["solar_efficiency"] = 0.0
        
    return solar

@router.post("/telemetry")
def update_solar_telemetry(payload: SolarTelemetryModel):
    data = payload.dict()
    # Add status flag
    data["grid_backup_active"] = payload.battery_pct < 20 and not payload.charging
    updated = database.update_solar_status(data)
    return updated
