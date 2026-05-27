import { useNavigation } from "@react-navigation/native";
import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { stemmActivities } from "../data/stemmActivities";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

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

  const workingActivities = stemmActivities.filter(
    (activity) => activity.screenName,
  ).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>STEMM Lab</Text>
        <Text style={styles.subtitle}>Real-World STEMM Games</Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Project Dashboard</Text>
        <Text style={styles.heroMain}>{workingActivities}</Text>
        <Text style={styles.heroText}>
          working STEMM activities implemented
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{isAvailable ? "ON" : "OFF"}</Text>
            <Text style={styles.statLabel}>Motion Sensor</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{steps}</Text>
            <Text style={styles.statLabel}>Live Steps</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>STEMM Challenges</Text>

      {stemmActivities.map((activity) => (
        <TouchableOpacity
          key={activity.id}
          style={styles.activityCard}
          onPress={() =>
            navigation.navigate("ActivityDetail", {
              activityId: activity.id,
            })
          }
        >
          <View style={styles.activityHeader}>
            <Text style={styles.activityArea}>{activity.area}</Text>

            {activity.screenName ? (
              <Text style={styles.readyBadge}>Ready</Text>
            ) : (
              <Text style={styles.comingBadge}>Coming Soon</Text>
            )}
          </View>

          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityText}>{activity.overview}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>App Tools</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={styles.toolEmoji}>📋</Text>
          <Text style={styles.toolText}>Saved Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Battery")}
        >
          <Text style={styles.toolEmoji}>🔋</Text>
          <Text style={styles.toolText}>Battery Monitor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Accelerometer")}
        >
          <Text style={styles.toolEmoji}>📱</Text>
          <Text style={styles.toolText}>Motion Sensor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Gyroscope")}
        >
          <Text style={styles.toolEmoji}>🌀</Text>
          <Text style={styles.toolText}>Gyroscope</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Location")}
        >
          <Text style={styles.toolEmoji}>📍</Text>
          <Text style={styles.toolText}>GPS Tag</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.toolEmoji}>👥</Text>
          <Text style={styles.toolText}>Team Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Progress")}
        >
          <Text style={styles.toolEmoji}>📈</Text>
          <Text style={styles.toolText}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Reminder")}
        >
          <Text style={styles.toolEmoji}>⏱️</Text>
          <Text style={styles.toolText}>Timed Challenge</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0F172A",
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#38BDF8",
    fontSize: 17,
    marginTop: 6,
    fontWeight: "600",
  },
  heroCard: {
    backgroundColor: "#1E293B",
    borderRadius: 28,
    padding: 25,
    marginBottom: 28,
  },
  heroTitle: {
    color: "#CBD5E1",
    fontSize: 16,
    marginBottom: 10,
  },
  heroMain: {
    color: "#FFFFFF",
    fontSize: 55,
    fontWeight: "bold",
  },
  heroText: {
    color: "#94A3B8",
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 22,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#334155",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    color: "#22C55E",
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#CBD5E1",
    marginTop: 5,
    textAlign: "center",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
  },
  activityCard: {
    backgroundColor: "#1E293B",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    gap: 10,
  },
  activityArea: {
    color: "#38BDF8",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  readyBadge: {
    color: "#FFFFFF",
    backgroundColor: "#22C55E",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "bold",
  },
  comingBadge: {
    color: "#CBD5E1",
    backgroundColor: "#475569",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "bold",
  },
  activityTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  activityText: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 21,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  toolCard: {
    width: "47%",
    backgroundColor: "#1E293B",
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
  },
  toolEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  toolText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});
