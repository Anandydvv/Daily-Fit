import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import { LineChart } from "react-native-chart-kit";
import { getActivities } from "../database/database";

const screenWidth = Dimensions.get("window").width;

export default function ProgressScreen() {
  const [weeklySteps, setWeeklySteps] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [averageSteps, setAverageSteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const activities: any = await getActivities();

    const days = [0, 0, 0, 0, 0, 0, 0];

    activities.forEach((item: any) => {
      const date = new Date(item.date);
      const day = date.getDay();

      let index = day - 1;

      if (day === 0) {
        index = 6;
      }

      if (index >= 0) {
        days[index] += item.steps || 0;
      }
    });

    setWeeklySteps(days);

    const total = days.reduce((sum, value) => sum + value, 0);

    setTotalSteps(total);
    setAverageSteps(Math.floor(total / 7));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Step Progress</Text>

      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: weeklySteps,
            },
          ],
        }}
        width={screenWidth - 30}
        height={260}
        yAxisSuffix=""
        fromZero
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,

          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,

          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

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

        <Text style={styles.steps}>{averageSteps}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Weekly Steps</Text>

        <Text style={styles.steps}>{totalSteps}</Text>
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
