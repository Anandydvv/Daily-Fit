import { ScrollView, StyleSheet, Text, View } from "react-native";

const sampleHistory = [
  {
    date: "18 May 2026",
    start: "9:00 AM",
    finish: "9:45 AM",
    steps: 4200,
    calories: 168,
  },
  {
    date: "17 May 2026",
    start: "6:30 PM",
    finish: "7:10 PM",
    steps: 3500,
    calories: 140,
  },
];

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Activity History</Text>

      {sampleHistory.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.date}>{item.date}</Text>

          <Text style={styles.text}>
            Start: {item.start}
          </Text>

          <Text style={styles.text}>
            Finish: {item.finish}
          </Text>

          <Text style={styles.text}>
            Steps: {item.steps}
          </Text>

          <Text style={styles.text}>
            Calories: {item.calories} kcal
          </Text>
        </View>
      ))}
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
});