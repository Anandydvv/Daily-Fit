import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function ProgressScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Step Progress</Text>

      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: [3000, 4500, 5000, 7000, 6500, 8000, 9000],
            },
          ],
        }}
        width={screenWidth - 30}
        height={260}
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,

          color: (opacity = 1) =>
            `rgba(76, 175, 80, ${opacity})`,

          labelColor: (opacity = 1) =>
            `rgba(0, 0, 0, ${opacity})`,

          style: {
            borderRadius: 16,
          },

          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#4CAF50",
          },
        }}
        bezier
        style={styles.chart}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Average Daily Steps</Text>
        <Text style={styles.steps}>6142</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },

  chart: {
    marginVertical: 20,
    borderRadius: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
  },

  steps: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});