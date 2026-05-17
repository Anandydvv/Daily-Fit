import { StyleSheet, Text, View } from "react-native";

export default function GoalsScreen() {
  const caloriesBurned = 320;
  const dailyGoal = 10000;
  const currentSteps = 4200;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Goals</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Steps</Text>
        <Text style={styles.value}>{currentSteps}</Text>
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
    backgroundColor: "#fff",
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
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  label: {
    fontSize: 18,
    color: "#666",
  },

  value: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },
});