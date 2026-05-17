import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("dailyfit.db");

export const createTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      steps INTEGER,
      calories INTEGER
    );
  `);
};

export const insertGoal = async (
  steps: number,
  calories: number
) => {
  await db.runAsync(
    "INSERT INTO goals (steps, calories) VALUES (?, ?)",
    [steps, calories]
  );
};

export const getGoals = async () => {
  return await db.getAllAsync(
    "SELECT * FROM goals"
  );
};