import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getActivities } from "../database/database";

type Activity = {
  id: number;
  date: string;
  startTime: string;
  finishTime: string;
  steps: number;
  calories: number;
};

export default function HistoryScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadActivities = async () => {
      const data = await getActivities();
      setActivities(data as Activity[]);
    };

    loadActivities();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Activity History</Text>

      {activities.length === 0 ? (
        <Text style={styles.emptyText}>No activity records yet.</Text>
      ) : (
        activities.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.text}>Start: {item.startTime}</Text>
            <Text style={styles.text}>Finish: {item.finishTime}</Text>
            <Text style={styles.text}>Steps: {item.steps}</Text>
            <Text style={styles.text}>Calories: {item.calories} kcal</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  date: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1B5E20",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 30,
  },
});