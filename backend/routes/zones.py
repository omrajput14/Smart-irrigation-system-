import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import database

router = APIRouter(prefix="/api/zones", tags=["zones"])

BLYNK_TOKEN = "ZGx1T1Fr-mDX49Y5IEkOjiRvryrM8r_o"
BLYNK_BASE = "https://blynk.cloud/external/api"

class ZoneUpdateModel(BaseModel):
    name: str = None
    crop_type: str = None
    moisture_threshold: int = None
    auto_mode: bool = None

class TriggerModel(BaseModel):
    command: str  # "ON" or "OFF"

@router.get("")
def read_zones():
    return database.get_zones()

@router.put("/{zone_id}")
def update_zone_config(zone_id: str, payload: ZoneUpdateModel):
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    updated = database.update_zone(zone_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Zone not found")
    return updated

@router.post("/{zone_id}/trigger")
async def trigger_irrigation(zone_id: str, payload: TriggerModel):
    zones = database.get_zones()
    target_zone = next((z for z in zones if z["id"] == zone_id), None)
    if not target_zone:
        raise HTTPException(status_code=404, detail="Zone not found")
        
    cmd_value = 1 if payload.command == "ON" else 0
    
    # Update local/Supabase database status
    database.update_zone(zone_id, {
        "pump_status": payload.command,
        "auto_mode": False if payload.command == "ON" else target_zone["auto_mode"]
    })
    
    # Forward to Blynk Cloud so the physical microcontroller responds
    try:
        async with httpx.AsyncClient() as client:
            # V1 is manual pump override in Blynk (1 = ON, 0 = OFF/AUTO)
            # For multi-zone, typically we control solenoid valve pins or master pump.
            # In ESP8266.ino: BLYNK_WRITE(V1) sets manualMode and pumpStatus
            await client.get(f"{BLYNK_BASE}/update?token={BLYNK_TOKEN}&V1={cmd_value}")
    except Exception as e:
        print(f"⚠️ Failed to update Blynk Cloud API: {e}")
        
    # Track water consumption in background if turned ON
    if payload.command == "ON":
        # Simulate tank depletion and water usage in background
        tank = database.get_tank_status()
        new_tank_level = max(0, tank["storage_level_liters"] - 250)  # subtract 250L per trigger
        database.update_tank_status({"storage_level_liters": new_tank_level})
        
        # Add to water savings / usage stats
        savings = database.get_water_savings()
        database.update_water_savings({
            "total_consumed_liters": savings["total_consumed_liters"] + 250,
            "total_saved_liters": savings["total_saved_liters"] + 80  # estimate 80L saved through precision control
        })

    return {
        "status": "success",
        "zone_id": zone_id,
        "pump_status": payload.command,
        "message": f"Zone {zone_id} pump set to {payload.command}"
    }
