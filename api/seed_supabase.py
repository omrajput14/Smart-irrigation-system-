import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_KEY must be configured in your .env file.")
    sys.exit(1)

try:
    from supabase import create_client
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("🔗 Successfully connected to Supabase Database client")
except ImportError:
    print("❌ Error: supabase package is not installed. Run 'pip install supabase' first.")
    sys.exit(1)
except Exception as e:
    print(f"❌ Connection error: {e}")
    sys.exit(1)

def seed_zones():
    print("\n🌱 Seeding 'zones' table...")
    default_zones = [
        {
            "id": "A",
            "name": "Zone A - North Plantation",
            "crop_type": "Banana",
            "moisture": 45,
            "moisture_raw": 562,
            "moisture_threshold": 50,
            "pump_status": "OFF",
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
    ]
    
    for zone in default_zones:
        try:
            # Upsert into zones
            res = supabase.table("zones").upsert(zone).execute()
            print(f"  ✅ Upserted Zone {zone['id']} successfully.")
        except Exception as e:
            print(f"  ❌ Failed to upsert Zone {zone['id']}: {e}")

def seed_tank_status():
    print("\n💧 Seeding 'tank_levels' table...")
    initial_tank = {
        "storage_level_liters": 3100,
        "storage_capacity_liters": 5000,
        "borewell_status": "ACTIVE",
        "borewell_flow_rate": 25.0,
        "safety_warning": "NONE",
        "estimated_hours_left": 48
    }
    try:
        supabase.table("tank_levels").insert(initial_tank).execute()
        print("  ✅ Logged initial tank telemetry successfully.")
    except Exception as e:
        print(f"  ❌ Failed to seed tank telemetry: {e}")

def seed_solar_status():
    print("\n⚡ Seeding 'solar_telemetry' table...")
    initial_solar = {
        "battery_pct": 82,
        "charging": True,
        "solar_output_watts": 480,
        "pump_consumption_watts": 0,
        "solar_efficiency": 94.5,
        "grid_backup_active": False
    }
    try:
        supabase.table("solar_telemetry").insert(initial_solar).execute()
        print("  ✅ Logged initial solar telemetry successfully.")
    except Exception as e:
        print(f"  ❌ Failed to seed solar telemetry: {e}")

def seed_history():
    print("\n📊 Seeding 'sensor_history' table...")
    default_history = [
        {"timestamp": "2026-06-10T08:00:00Z", "moisture_A": 65, "moisture_B": 55, "moisture_C": 70, "water_used": 1200, "solar_power": 350, "battery": 60},
        {"timestamp": "2026-06-11T08:00:00Z", "moisture_A": 58, "moisture_B": 48, "moisture_C": 65, "water_used": 950,  "solar_power": 410, "battery": 75},
        {"timestamp": "2026-06-12T08:00:00Z", "moisture_A": 50, "moisture_B": 42, "moisture_C": 60, "water_used": 1400, "solar_power": 450, "battery": 85},
        {"timestamp": "2026-06-13T08:00:00Z", "moisture_A": 44, "moisture_B": 39, "moisture_C": 56, "water_used": 1800, "solar_power": 490, "battery": 90},
        {"timestamp": "2026-06-14T08:00:00Z", "moisture_A": 60, "moisture_B": 52, "moisture_C": 68, "water_used": 500,  "solar_power": 250, "battery": 80},
        {"timestamp": "2026-06-15T08:00:00Z", "moisture_A": 52, "moisture_B": 45, "moisture_C": 62, "water_used": 1100, "solar_power": 470, "battery": 88},
        {"timestamp": "2026-06-16T08:00:00Z", "moisture_A": 45, "moisture_B": 38, "moisture_C": 62, "water_used": 1350, "solar_power": 480, "battery": 82}
    ]
    
    # Check if history already populated
    try:
        existing = supabase.table("sensor_history").select("id").limit(1).execute()
        if existing.data:
            print("  ⚠️ History table is already populated. Skipping to prevent duplicate charts.")
            return
    except Exception:
        pass

    for entry in default_history:
        try:
            supabase.table("sensor_history").insert(entry).execute()
        except Exception as e:
            print(f"  ❌ Failed to insert history entry: {e}")
            break
    else:
        print("  ✅ Populated historical sensor records successfully.")

if __name__ == "__main__":
    print("🚀 Starting Supabase Database Seeding...")
    seed_zones()
    seed_tank_status()
    seed_solar_status()
    seed_history()
    print("\n🏁 Seeding process complete.")
