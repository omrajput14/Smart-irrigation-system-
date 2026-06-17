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

def load_local_db():
    if not DB_FILE.exists():
        # Fallback raw initialization if file somehow missing
        DB_FILE.parent.mkdir(parents=True, exist_ok=True)
        default_data = {
            "zones": [],
            "tank_status": {},
            "solar_status": {},
            "weather_forecast": {},
            "water_savings": {},
            "history": []
        }
        with open(DB_FILE, "w") as f:
            json.dump(default_data, f, indent=2)
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_local_db(data):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

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
