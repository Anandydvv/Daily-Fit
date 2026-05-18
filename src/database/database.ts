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
      calories INTEGER
    );
  `);
};

export const insertActivity = async (
  date: string,
  startTime: string,
  finishTime: string,
  steps: number,
  calories: number
) => {
  await db.runAsync(
    `INSERT INTO activities 
    (date, startTime, finishTime, steps, calories) 
    VALUES (?, ?, ?, ?, ?)`,
    [date, startTime, finishTime, steps, calories]
  );
};

export const getActivities = async () => {
  return await db.getAllAsync("SELECT * FROM activities ORDER BY id DESC");
};