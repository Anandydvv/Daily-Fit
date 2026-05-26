import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("stemm_lab_v3.db");

export type ActivityResult = {
  id: number;
  activityId: string;
  activityTitle: string;
  area: string;
  design: string;
  prediction: string;
  height: string;
  mass: string;
  dropTime: string;
  stopTime: string;
  finalVelocity: string;
  acceleration: string;
  netForce: string;
  weight: string;
  dragForce: string;
  gForce: string;
  reflection: string;
  mediaUri: string;
  createdAt: string;
};

export const createActivityResultsTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS activity_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activityId TEXT,
      activityTitle TEXT,
      area TEXT,
      design TEXT,
      prediction TEXT,
      height TEXT,
      mass TEXT,
      dropTime TEXT,
      stopTime TEXT,
      finalVelocity TEXT,
      acceleration TEXT,
      netForce TEXT,
      weight TEXT,
      dragForce TEXT,
      gForce TEXT,
      reflection TEXT,
      mediaUri TEXT,
      createdAt TEXT
    );
  `);
};

export const insertActivityResult = async (
  result: Omit<ActivityResult, "id">,
) => {
  await createActivityResultsTable();

  await db.runAsync(
    `
    INSERT INTO activity_results
    (
      activityId,
      activityTitle,
      area,
      design,
      prediction,
      height,
      mass,
      dropTime,
      stopTime,
      finalVelocity,
      acceleration,
      netForce,
      weight,
      dragForce,
      gForce,
      reflection,
      mediaUri,
      createdAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      result.activityId,
      result.activityTitle,
      result.area,
      result.design,
      result.prediction,
      result.height,
      result.mass,
      result.dropTime,
      result.stopTime,
      result.finalVelocity,
      result.acceleration,
      result.netForce,
      result.weight,
      result.dragForce,
      result.gForce,
      result.reflection,
      result.mediaUri,
      result.createdAt,
    ],
  );
};

export const getActivityResults = async (): Promise<ActivityResult[]> => {
  await createActivityResultsTable();

  return await db.getAllAsync<ActivityResult>(
    "SELECT * FROM activity_results ORDER BY id DESC",
  );
};

export const clearActivityResults = async () => {
  await createActivityResultsTable();

  await db.runAsync("DELETE FROM activity_results");
};

// Keeps old screens from breaking if they still import old fitness functions.
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
    `
    INSERT INTO activities
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
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

export const clearActivities = async () => {
  await createActivityTable();

  await db.runAsync("DELETE FROM activities");
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
