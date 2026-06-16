const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");

const firebaseConfig = {
  databaseURL: "https://smart-project-7301b-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const now = Date.now();
const history = {};

for (let i = 24; i >= 0; i--) {
  const ts = Math.floor((now - i * 60 * 60 * 1000) / 1000); // Unix timestamp in seconds
  history[ts] = {
    temperature: 20 + Math.random() * 15,
    humidity: 40 + Math.random() * 40,
    moisture: 30 + Math.random() * 50,
    lightLevel: Math.random() * 100,
    rainDrop: Math.random() > 0.8 ? Math.random() * 100 : 0,
  };
}

set(ref(database, "sensor_data/history"), history)
  .then(() => {
    console.log("Firebase seeded successfully with 24 hours of data.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding Firebase:", err);
    process.exit(1);
  });
