import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("dailyfit.db");

export type Activity = {
  id: number;
  date: string;
  startTime: string;
  finishTime: string;
  steps: number;
  calories: number;
  distance: number;
  startLatitude: number;
  startLongitude: number;
  finishLatitude: number;
  finishLongitude: number;
};

export const createActivityTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      startTime TEXT,
      finishTime TEXT,
      steps INTEGER,
      calories INTEGER,
      distance REAL DEFAULT 0,
      startLatitude REAL,
      startLongitude REAL,
      finishLatitude REAL,
      finishLongitude REAL
    );
  `);

  await db
    .execAsync(
      `
    ALTER TABLE activities ADD COLUMN distance REAL DEFAULT 0;
  `,
    )
    .catch(() => {});
};

export const insertActivity = async (
  date: string,
  startTime: string,
  finishTime: string,
  steps: number,
  calories: number,
  distance: number,
  startLatitude: number,
  startLongitude: number,
  finishLatitude: number,
  finishLongitude: number,
) => {
  await createActivityTable();

  await db.runAsync(
    `INSERT INTO activities 
    (
      date,
      startTime,
      finishTime,
      steps,
      calories,
      distance,
      startLatitude,
      startLongitude,
      finishLatitude,
      finishLongitude
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      date,
      startTime,
      finishTime,
      steps,
      calories,
      distance,
      startLatitude,
      startLongitude,
      finishLatitude,
      finishLongitude,
    ],
  );
};

export const getActivities = async (): Promise<Activity[]> => {
  await createActivityTable();

  return await db.getAllAsync<Activity>(
    "SELECT * FROM activities ORDER BY id DESC",
  );
};

export const getWeeklyStepData = async () => {
  await createActivityTable();

  const rows = await db.getAllAsync<{
    date: string;
    steps: number;
  }>("SELECT date, steps FROM activities");

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = [0, 0, 0, 0, 0, 0, 0];

  rows.forEach((item) => {
    const day = new Date(item.date).getDay();

    const index = day === 0 ? 6 : day - 1;

    data[index] += item.steps || 0;
  });

  const totalSteps = data.reduce((sum, value) => sum + value, 0);
  const averageSteps = Math.round(totalSteps / 7);

  return {
    labels,
    data,
    averageSteps,
    totalSteps,
  };
};
