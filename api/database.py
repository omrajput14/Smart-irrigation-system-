import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

DB_FILE = Path(__file__).parent / "data" / "db.json"

# Check for Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
use_supabase = bool(SUPABASE_URL and SUPABASE_KEY)

supabase_client = None
if use_supabase:
    try:
        from supabase import create_client
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("🔗 Successfully connected to Supabase Database client")
    except Exception as e:
        print(f"⚠️ Failed to init Supabase client: {e}. Falling back to local JSON database.")
        use_supabase = False

# In-memory database fallback representing initial seed data
_in_memory_db = {
  "zones": [
    {
      "id": "A",
      "name": "Zone A - North Plantation",
      "crop_type": "Banana",
      "moisture": 45,
      "moisture_raw": 562,
      "moisture_threshold": 50,
      "pump_status": "ON",
      "auto_mode": False,
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
      "auto_mode": True,
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
      "auto_mode": True,
      "water_flow_rate": 20.0
    }
  ],
  "tank_status": {
    "storage_level_liters": 3100,
    "storage_capacity_liters": 5000,
    "borewell_status": "ACTIVE",
    "borewell_flow_rate": 25.0,
    "safety_warning": "NONE",
    "estimated_hours_left": 48
  },
  "solar_status": {
    "battery_pct": 82,
    "charging": True,
    "solar_output_watts": 480,
    "pump_consumption_watts": 0,
    "solar_efficiency": 94.5,
    "grid_backup_active": False
  },
  "weather_forecast": {
    "current_temp": 32.5,
    "current_humidity": 42.0,
    "current_rain_prob": 12.0,
    "rain_expected_6h": False,
    "rain_expected_24h": True,
    "forecast_description": "Clear day, light drizzle expected tonight",
    "recommended_delay_hours": 0
  },
  "water_savings": {
    "total_consumed_liters": 125250,
    "total_saved_liters": 39140,
    "efficiency_percentage": 31.2
  },
  "history": [
    {
      "timestamp": "2026-06-10T08:00:00Z",
      "moisture_A": 65,
      "moisture_B": 55,
      "moisture_C": 70,
      "water_used": 1200,
      "solar_power": 350,
      "battery": 60
    },
    {
      "timestamp": "2026-06-11T08:00:00Z",
      "moisture_A": 58,
      "moisture_B": 48,
      "moisture_C": 65,
      "water_used": 950,
      "solar_power": 410,
      "battery": 75
    },
    {
      "timestamp": "2026-06-12T08:00:00Z",
      "moisture_A": 50,
      "moisture_B": 42,
      "moisture_C": 60,
      "water_used": 1400,
      "solar_power": 450,
      "battery": 85
    },
    {
      "timestamp": "2026-06-13T08:00:00Z",
      "moisture_A": 44,
      "moisture_B": 39,
      "moisture_C": 56,
      "water_used": 1800,
      "solar_power": 490,
      "battery": 90
    },
    {
      "timestamp": "2026-06-14T08:00:00Z",
      "moisture_A": 60,
      "moisture_B": 52,
      "moisture_C": 68,
      "water_used": 500,
      "solar_power": 250,
      "battery": 80
    },
    {
      "timestamp": "2026-06-15T08:00:00Z",
      "moisture_A": 52,
      "moisture_B": 45,
      "moisture_C": 62,
      "water_used": 1100,
      "solar_power": 470,
      "battery": 88
    },
    {
      "timestamp": "2026-06-16T08:00:00Z",
      "moisture_A": 45,
      "moisture_B": 38,
      "moisture_C": 62,
      "water_used": 1350,
      "solar_power": 480,
      "battery": 82
    }
  ]
}

def load_local_db():
    global _in_memory_db
    try:
        if DB_FILE.exists():
            with open(DB_FILE, "r") as f:
                return json.load(f)
    except Exception as e:
        print(f"⚠️ Failed to read DB_FILE: {e}. Using in-memory fallback.")
    
    # If the file does not exist, try creating it (works in writable local dev environments)
    try:
        if not DB_FILE.exists():
            DB_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(DB_FILE, "w") as f:
                json.dump(_in_memory_db, f, indent=2)
            return _in_memory_db
    except Exception as e:
        print(f"⚠️ Failed to initialize default DB_FILE: {e}. Using in-memory fallback.")
        
    return _in_memory_db

def save_local_db(data):
    global _in_memory_db
    _in_memory_db = data
    try:
        DB_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(DB_FILE, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"⚠️ Failed to write update to DB_FILE: {e}. Saved in-memory only.")

# --- ZONES ---
def get_zones():
    if use_supabase:
        try:
            res = supabase_client.table("zones").select("*").execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Supabase read zones error: {e}")
    
    # Fallback to local
    return load_local_db()["zones"]

def update_zone(zone_id, zone_data):
    if use_supabase:
        try:
            res = supabase_client.table("zones").update(zone_data).eq("id", zone_id).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"Supabase update zone error: {e}")
            
    # Fallback to local
    db = load_local_db()
    for zone in db["zones"]:
        if zone["id"] == zone_id:
            zone.update(zone_data)
            save_local_db(db)
            return zone
    return None

# --- TANK ---
def get_tank_status():
    if use_supabase:
        try:
            res = supabase_client.table("tank_levels").select("*").order("timestamp", desc=True).limit(1).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"Supabase tank status error: {e}")
    return load_local_db()["tank_status"]

def update_tank_status(data):
    if use_supabase:
        try:
            res = supabase_client.table("tank_levels").insert(data).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"Supabase update tank error: {e}")
    
    db = load_local_db()
    db["tank_status"].update(data)
    save_local_db(db)
    return db["tank_status"]

# --- SOLAR ---
def get_solar_status():
    if use_supabase:
        try:
            res = supabase_client.table("solar_telemetry").select("*").order("timestamp", desc=True).limit(1).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"Supabase solar status error: {e}")
    return load_local_db()["solar_status"]

def update_solar_status(data):
    if use_supabase:
        try:
            res = supabase_client.table("solar_telemetry").insert(data).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"Supabase update solar error: {e}")
            
    db = load_local_db()
    db["solar_status"].update(data)
    save_local_db(db)
    return db["solar_status"]

# --- WEATHER ---
def get_weather_forecast():
    # Mostly external API integration or local cache
    return load_local_db()["weather_forecast"]

def update_weather_forecast(data):
    db = load_local_db()
    db["weather_forecast"].update(data)
    save_local_db(db)
    return db["weather_forecast"]

# --- ANALYTICS & HISTORY ---
def get_history():
    if use_supabase:
        try:
            res = supabase_client.table("sensor_history").select("*").order("timestamp", desc=False).execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Supabase read history error: {e}")
    return load_local_db()["history"]

def add_history_entry(entry):
    if use_supabase:
        try:
            supabase_client.table("sensor_history").insert(entry).execute()
        except Exception as e:
            print(f"Supabase insert history error: {e}")
            
    db = load_local_db()
    db["history"].append(entry)
    # limit local history to last 60 records
    if len(db["history"]) > 60:
        db["history"] = db["history"][-60:]
    save_local_db(db)
    return entry

def get_water_savings():
    return load_local_db()["water_savings"]

def update_water_savings(data):
    db = load_local_db()
    db["water_savings"].update(data)
    save_local_db(db)
    return db["water_savings"]
