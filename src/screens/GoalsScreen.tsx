import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function GoalsScreen() {
  const [steps, setSteps] = useState(0);

  const dailyGoal = 10000;
  const caloriesBurned = Math.round(steps * 0.04);

  useEffect(() => {
    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Goals</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Steps</Text>
        <Text style={styles.value}>{steps}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Daily Goal</Text>
        <Text style={styles.value}>{dailyGoal}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Calories Burned</Text>
        <Text style={styles.value}>{caloriesBurned} kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 18,
    marginBottom: 18,
  },
  label: {
    fontSize: 18,
    color: "#666",
  },
  value: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
});