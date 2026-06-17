from fastapi import APIRouter
from pydantic import BaseModel
import database
import random

router = APIRouter(prefix="/api/weather", tags=["weather"])

class WeatherSyncModel(BaseModel):
    temperature: float = None
    humidity: float = None

@router.get("")
def get_weather():
    # Fetch current weather stats
    weather = database.get_weather_forecast()
    
    # Smart Logic: Calculate recommended irrigation delay based on forecast
    # If rain expected within 6h, recommend delay of 12 hours
    if weather["rain_expected_6h"]:
        weather["recommended_delay_hours"] = 12
    elif weather["rain_expected_24h"]:
        weather["recommended_delay_hours"] = 6
    else:
        weather["recommended_delay_hours"] = 0
        
    return weather

@router.post("/sync")
def sync_weather(payload: WeatherSyncModel):
    # Endpoint to simulate weather forecasting trigger updates
    weather = database.get_weather_forecast()
    
    if payload.temperature is not None:
        weather["current_temp"] = payload.temperature
    if payload.humidity is not None:
        weather["current_humidity"] = payload.humidity
        
    # Simulate forecast changes
    weather["rain_expected_6h"] = random.choice([True, False, False, False])
    weather["rain_expected_24h"] = random.choice([True, True, False])
    weather["current_rain_prob"] = 80.0 if weather["rain_expected_6h"] else (45.0 if weather["rain_expected_24h"] else 5.0)
    
    if weather["rain_expected_6h"]:
        weather["forecast_description"] = "Storm warning: Heavy rain predicted within 6 hours"
    elif weather["rain_expected_24h"]:
        weather["forecast_description"] = "Cloudy: Showers expected tonight"
    else:
        weather["forecast_description"] = "Sunny: Clear sky with high evaporation rates"

    updated = database.update_weather_forecast(weather)
    return updated
