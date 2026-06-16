#define BLYNK_PRINT Serial

#include <ArduinoJson.h>
#include <BlynkSimpleEsp8266.h>
#include <DHT.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <SimpleTimer.h>
#include <WiFiClient.h>

// =========================
// 🔥 Blynk Credentials
// =========================
char auth[] = "ZGx1T1Fr-mDX49Y5IEkOjiRvryrM8r_o";
char ssid[] = "X6";
char pass[] = "12345678";

// =========================
// 🌦️ Weather API (Dhule)
// =========================
String apiKey = "dd2b134076a6e378d6316b3bb7886bd4";
String city = "Dhule";

bool rainExpected = false;
float dhuleTemp = 0;

// =========================
// 🔌 Pins
// =========================
#define RELAY_PIN D1
#define SOIL_PIN A0
#define DHTPIN D4
#define DHTTYPE DHT11

// =========================
// Objects
// =========================
SimpleTimer timer;
DHT dht(DHTPIN, DHTTYPE);

// =========================
// Variables
// =========================
int moistureRaw = 0;
int moisturePercent = 0;
int moistureThreshold = 60; // % based

float temperature = 0;

String pumpStatus = "OFF";
String soilStatus = "Normal";

bool manualMode = false;

// =========================
// Pump Control
// =========================
void turnPumpOn() {
  digitalWrite(RELAY_PIN, LOW);
  pumpStatus = "ON";
}

void turnPumpOff() {
  digitalWrite(RELAY_PIN, HIGH);
  pumpStatus = "OFF";
}

// =========================
// 🌱 Soil Moisture
// =========================
void readSoilMoisture() {

  moistureRaw = analogRead(SOIL_PIN);
  moisturePercent = map(moistureRaw, 1024, 0, 0, 100);

  Serial.print("Moisture %: ");
  Serial.println(moisturePercent);

  Blynk.virtualWrite(V0, moisturePercent);
}

// =========================
// 🌡️ Temperature
// =========================
void readTemperature() {

  temperature = dht.readTemperature();
  if (isnan(temperature))
    return;

  Serial.print("Temp: ");
  Serial.println(temperature);

  Blynk.virtualWrite(V6, temperature);
}

// =========================
// 🌦️ Weather API
// =========================
void getWeatherData() {

  WiFiClient client;
  HTTPClient http;

  String url = "http://api.openweathermap.org/data/2.5/forecast?q=" + city +
               "&appid=" + apiKey;

  http.begin(client, url);
  int httpCode = http.GET();

  if (httpCode == 200) {

    String payload = http.getString();

    DynamicJsonDocument doc(4096);
    deserializeJson(doc, payload);

    rainExpected = false;

    for (int i = 0; i < 5; i++) {
      if (doc["list"][i]["weather"][0]["main"] == "Rain") {
        rainExpected = true;
        break;
      }
    }

    dhuleTemp = doc["list"][0]["main"]["temp"] - 273.15;

    Serial.print("Weather Temp: ");
    Serial.println(dhuleTemp);

    Serial.print("Rain Expected: ");
    Serial.println(rainExpected ? "YES" : "NO");

    Blynk.virtualWrite(V8, dhuleTemp);
    Blynk.virtualWrite(V7, rainExpected ? "Rain 🌧️" : "Clear ☀️");
  }

  http.end();
}

// =========================
// 🤖 Smart Watering
// =========================
void smartWatering() {

  if (manualMode)
    return;

  if (moisturePercent < moistureThreshold && !rainExpected) {

    turnPumpOn();
    soilStatus = "Auto: Watering 🌱";

  } else {

    turnPumpOff();
    soilStatus = "Safe ✅";
  }

  Serial.println(soilStatus);

  Blynk.virtualWrite(V4, soilStatus);
  Blynk.virtualWrite(V5, pumpStatus);
}

// =========================
// 🎮 Manual Control
// =========================
BLYNK_WRITE(V1) {
  int state = param.asInt();

  if (state == 1) {
    manualMode = true;
    turnPumpOn();
  } else {
    manualMode = false;
    turnPumpOff();
  }

  Blynk.virtualWrite(V5, pumpStatus);
}

// =========================
// 🎚 Threshold Slider
// =========================
BLYNK_WRITE(V3) { moistureThreshold = param.asInt(); }

// =========================
// Sync
// =========================
BLYNK_CONNECTED() { Blynk.syncVirtual(V1, V3); }

// =========================
// Setup
// =========================
void setup() {

  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  turnPumpOff();

  dht.begin();

  Blynk.begin(auth, ssid, pass);

  timer.setInterval(2000L, readSoilMoisture);
  timer.setInterval(3000L, readTemperature);
  timer.setInterval(4000L, smartWatering);
  timer.setInterval(600000L, getWeatherData); // every 10 min
}

// =========================
// Loop
// =========================
void loop() {
  Blynk.run();
  timer.run();
}