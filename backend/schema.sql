-- Smart Irrigation System Database Schema (Supabase PostgreSQL)

-- 1. Create Zones Table
CREATE TABLE IF NOT EXISTS public.zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    crop_type TEXT NOT NULL,
    moisture INTEGER DEFAULT 50,
    moisture_raw INTEGER DEFAULT 512,
    moisture_threshold INTEGER DEFAULT 50,
    pump_status TEXT DEFAULT 'OFF',
    auto_mode BOOLEAN DEFAULT TRUE,
    water_flow_rate DOUBLE PRECISION DEFAULT 0.0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) or public access depending on user preference.
-- For simplicity and ease of initial prototyping, we allow public read/write.
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.zones FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.zones FOR ALL USING (true);

-- 2. Create Tank Levels (Historical Logger) Table
CREATE TABLE IF NOT EXISTS public.tank_levels (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    storage_level_liters INTEGER NOT NULL,
    storage_capacity_liters INTEGER DEFAULT 5000,
    borewell_status TEXT DEFAULT 'OFF',
    borewell_flow_rate DOUBLE PRECISION DEFAULT 0.0,
    safety_warning TEXT DEFAULT 'NONE',
    estimated_hours_left INTEGER DEFAULT 48
);

ALTER TABLE public.tank_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.tank_levels FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.tank_levels FOR INSERT WITH CHECK (true);

-- 3. Create Solar Telemetry (Historical Logger) Table
CREATE TABLE IF NOT EXISTS public.solar_telemetry (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    battery_pct INTEGER NOT NULL,
    charging BOOLEAN DEFAULT FALSE,
    solar_output_watts INTEGER DEFAULT 0,
    pump_consumption_watts INTEGER DEFAULT 0,
    solar_efficiency DOUBLE PRECISION DEFAULT 0.0,
    grid_backup_active BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.solar_telemetry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.solar_telemetry FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.solar_telemetry FOR INSERT WITH CHECK (true);

-- 4. Create Sensor History Table (Aggregated hourly/daily logs for charts)
CREATE TABLE IF NOT EXISTS public.sensor_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    moisture_A INTEGER NOT NULL,
    moisture_B INTEGER NOT NULL,
    moisture_C INTEGER NOT NULL,
    water_used INTEGER DEFAULT 0,
    solar_power INTEGER DEFAULT 0,
    battery INTEGER DEFAULT 80
);

ALTER TABLE public.sensor_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.sensor_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.sensor_history FOR INSERT WITH CHECK (true);
