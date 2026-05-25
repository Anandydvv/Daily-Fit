import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Activity, getActivities } from "../database/database";

export default function HistoryScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadActivities = async () => {
        const data = await getActivities();
        setActivities(data);
      };

      loadActivities();
    }, []),
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Activity History</Text>

      {activities.length === 0 ? (
        <Text style={styles.emptyText}>No activity records yet.</Text>
      ) : (
        activities.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Start</Text>
              <Text style={styles.value}>{item.startTime}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Finish</Text>
              <Text style={styles.value}>{item.finishTime}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Distance</Text>
              <Text style={styles.value}>{item.distance.toFixed(2)} km</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Steps</Text>
              <Text style={styles.value}>{item.steps}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Calories</Text>
              <Text style={styles.value}>{item.calories} kcal</Text>
            </View>
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
    marginBottom: 14,
    color: "#1B5E20",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    fontSize: 16,
    color: "#666",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 30,
  },
});
