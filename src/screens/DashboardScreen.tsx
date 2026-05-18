import { useNavigation } from "@react-navigation/native";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  const calories = Math.round(steps * 0.04);
  const goal = 10000;
  const progress = Math.min(Math.round((steps / goal) * 100), 100);

  useEffect(() => {
    Pedometer.isAvailableAsync().then((result) => {
      setIsAvailable(result);
    });

    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });

    return () => subscription.remove();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>DailyFit</Text>
      <Text style={styles.subtitle}>Your health dashboard</Text>

      <View style={styles.mainCard}>
        <Text style={styles.cardLabel}>Steps Today</Text>
        <Text style={styles.steps}>{steps}</Text>
        <Text style={styles.cardText}>
          Pedometer: {isAvailable ? "Available" : "Not Available"}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.cardLabel}>Calories</Text>
          <Text style={styles.cardValue}>{calories}</Text>
          <Text style={styles.cardText}>kcal</Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.cardLabel}>Goal</Text>
          <Text style={styles.cardValue}>{progress}%</Text>
          <Text style={styles.cardText}>{goal} steps</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Goals")}>
        <Text style={styles.navButtonText}>Goals & Calories</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Location")}>
        <Text style={styles.navButtonText}>GPS Tracking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Reminder")}>
        <Text style={styles.navButtonText}>Workout Reminder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Battery")}>
        <Text style={styles.navButtonText}>Battery Status</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F7FA",
    flexGrow: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 16,
    color: "#666",
  },
  steps: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#2E7D32",
    marginVertical: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#777",
  },
  row: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
  },
  cardValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1976D2",
    marginTop: 8,
  },
  navButton: {
    backgroundColor: "#1B5E20",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});