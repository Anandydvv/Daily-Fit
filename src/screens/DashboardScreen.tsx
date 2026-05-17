import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

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
    <View style={styles.container}>
      <Text style={styles.title}>DailyFit Dashboard</Text>

      <Text style={styles.label}>
        Pedometer Available:
      </Text>

      <Text style={styles.value}>
        {isAvailable ? "Yes" : "No"}
      </Text>

      <Text style={styles.label}>
        Steps Today
      </Text>

      <Text style={styles.steps}>
        {steps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },

  label: {
    fontSize: 18,
    marginTop: 10,
  },

  value: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  steps: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});