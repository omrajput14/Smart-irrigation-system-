from fastapi import APIRouter
from pydantic import BaseModel
import database
import math
import datetime

router = APIRouter(prefix="/api/ai", tags=["ai"])

class CropInputModel(BaseModel):
    soil_type: str
    moisture: float
    temperature: float
    rainfall: float

@router.post("/crop-recommendation")
def get_crop_recommendation(payload: CropInputModel):
    soil = payload.soil_type.lower()
    temp = payload.temperature
    moist = payload.moisture
    rain = payload.rainfall
    
    recommendations = []
    
    # Banana logic
    if soil in ["loam", "silt"] and 24 <= temp <= 32 and moist >= 40 and rain > 1000:
        recommendations.append({
            "crop": "Banana",
            "score": 95,
            "suitability": "EXCELLENT",
            "risks": "High susceptibility to Panama wilt in waterlogged soils.",
            "yield_tip": "Maintain high soil moisture. Provide organic mulching to increase potassium."
        })
    elif soil in ["clay", "loam"] and moist >= 30:
        recommendations.append({
            "crop": "Banana",
            "score": 75,
            "suitability": "GOOD",
            "risks": "Slow growth if temperatures drop below 20°C.",
            "yield_tip": "Ensure adequate nitrogen supply and drip irrigation."
        })
        
    # Tomato logic
    if 18 <= temp <= 28 and 30 <= moist <= 50 and rain < 800:
        recommendations.append({
            "crop": "Tomato",
            "score": 90,
            "suitability": "EXCELLENT",
            "risks": "Blossom end rot if moisture levels fluctuate rapidly.",
            "yield_tip": "Implement consistent drip watering. Ensure proper calcium levels in loam soil."
        })
    else:
        recommendations.append({
            "crop": "Tomato",
            "score": 60,
            "suitability": "MODERATE",
            "risks": "High fungal leaf disease risk under humid or rainy conditions.",
            "yield_tip": "Avoid overhead watering; protect under tunnels if rainfall increases."
        })
        
    # Sugarcane logic
    if soil in ["clay", "loam"] and 25 <= temp <= 38 and moist >= 50:
        recommendations.append({
            "crop": "Sugarcane",
            "score": 92,
            "suitability": "EXCELLENT",
            "risks": "Water logging in early stages reduces sucrose accumulation.",
            "yield_tip": "Practice furrow irrigation. Drain excess water before harvesting."
        })
    else:
        recommendations.append({
            "crop": "Sugarcane",
            "score": 65,
            "suitability": "MODERATE",
            "risks": "Stunted growth during cold waves (below 15°C).",
            "yield_tip": "Apply mulch to preserve root temperature during dry spells."
        })
        
    # Cotton (Bonus Crop)
    if soil in ["sandy", "loam"] and temp >= 25 and moist <= 40:
        recommendations.append({
            "crop": "Cotton",
            "score": 85,
            "suitability": "GOOD",
            "risks": "Fungal boll rot if heavy rainfall occurs during maturity.",
            "yield_tip": "Optimized for dry environments. Keep moisture low during harvest."
        })
        
    # Sort recommendations by score descending
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return {
        "input": payload,
        "recommendations": recommendations,
        "soil_type_notes": f"{payload.soil_type.capitalize()} soil retains nutrients well but requires careful moisture balancing."
    }

@router.get("/moisture-depletion")
def get_moisture_depletion():
    # Generate mock 24-hour and 7-day moisture depletion curves
    # starting from current moisture levels in Zone A, B, C
    zones = database.get_zones()
    
    current_time = datetime.datetime.utcnow()
    hours_forecast = []
    days_forecast = []
    
    for i in range(24):
        timestamp = (current_time + datetime.timedelta(hours=i)).strftime("%H:00")
        # Moisture depletes exponentially due to heat
        # Banana depletion curve (Zone A starts at ~45)
        moist_A = max(20.0, 45.0 - (0.8 * i) + 2.0 * math.sin(i/3.0))
        # Tomato depletion curve (Zone B starts at ~38)
        moist_B = max(15.0, 38.0 - (0.6 * i) + 1.5 * math.sin(i/3.0))
        # Sugarcane depletion curve (Zone C starts at ~62)
        moist_C = max(30.0, 62.0 - (0.9 * i) + 2.5 * math.sin(i/3.0))
        
        hours_forecast.append({
            "time": timestamp,
            "Banana (Zone A)": round(moist_A, 1),
            "Tomato (Zone B)": round(moist_B, 1),
            "Sugarcane (Zone C)": round(moist_C, 1)
        })
        
    for i in range(7):
        timestamp = (current_time + datetime.timedelta(days=i)).strftime("%a")
        # banana (depletes, with simulated manual watering at day 3)
        water_A = 65.0 if i == 3 else max(20.0, 45.0 - (4.0 * i))
        water_B = 55.0 if i == 4 else max(15.0, 38.0 - (3.5 * i))
        water_C = 70.0 if i == 2 else max(30.0, 62.0 - (5.0 * i))
        
        days_forecast.append({
            "day": timestamp,
            "Banana (Zone A)": round(water_A, 1),
            "Tomato (Zone B)": round(water_B, 1),
            "Sugarcane (Zone C)": round(water_C, 1)
        })
        
    return {
        "hourly_prognosis": hours_forecast,
        "daily_prognosis": days_forecast,
        "warning_alerts": [
            "Zone B (Tomato) will reach critical depletion threshold in 14 hours.",
            "High solar radiation tomorrow will increase evaporation rates by 15%."
        ]
    }
