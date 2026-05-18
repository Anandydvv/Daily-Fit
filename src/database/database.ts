import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("dailyfit.db");

export const createActivityTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      startTime TEXT,
      finishTime TEXT,
      steps INTEGER,
      calories INTEGER,
      startLatitude REAL,
      startLongitude REAL,
      finishLatitude REAL,
      finishLongitude REAL
    );
  `);
};

export const insertActivity = async (
  date: string,
  startTime: string,
  finishTime: string,
  steps: number,
  calories: number,
  startLatitude: number,
  startLongitude: number,
  finishLatitude: number,
  finishLongitude: number
) => {
  await db.runAsync(
    `INSERT INTO activities 
    (
      date,
      startTime,
      finishTime,
      steps,
      calories,
      startLatitude,
      startLongitude,
      finishLatitude,
      finishLongitude
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      date,
      startTime,
      finishTime,
      steps,
      calories,
      startLatitude,
      startLongitude,
      finishLatitude,
      finishLongitude
    ]
  );
};

export const getActivities = async () => {
  return await db.getAllAsync(
    "SELECT * FROM activities ORDER BY id DESC"
  );
};