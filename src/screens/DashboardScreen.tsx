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

import { createActivityTable, insertActivity } from "../database/database";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  const [walking, setWalking] = useState(false);
  const [sessionSteps, setSessionSteps] = useState(0);

  const [startTime, setStartTime] = useState<Date | null>(null);

  const [endTime, setEndTime] = useState<Date | null>(null);

  const calories = Math.round(steps * 0.04);

  const sessionCalories = Math.round(sessionSteps * 0.04);

  const goal = 10000;

  const progress = Math.min(Math.round((steps / goal) * 100), 100);

  useEffect(() => {
    createActivityTable();

    Pedometer.isAvailableAsync().then((result) => {
      setIsAvailable(result);
    });

    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);

      if (walking) {
        setSessionSteps(result.steps);
      }
    });

    return () => subscription.remove();
  }, [walking]);

  const startWalk = () => {
    setWalking(true);
    setSessionSteps(0);
    setStartTime(new Date());
    setEndTime(null);
  };

  const finishWalk = async () => {
    const finish = new Date();

    setWalking(false);
    setEndTime(finish);

    if (startTime) {
      await insertActivity(
        new Date().toLocaleDateString(),
        startTime.toLocaleTimeString(),
        finish.toLocaleTimeString(),
        sessionSteps,
        sessionCalories,
        0,
        0,
        0,
        0,
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning 👋</Text>

        <Text style={styles.headerTitle}>DailyFit Dashboard</Text>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Today's Activity</Text>

        <Text style={styles.heroSteps}>{steps}</Text>

        <Text style={styles.heroSub}>
          {progress}% of {goal} step goal
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{calories}</Text>

            <Text style={styles.statLabel}>Calories</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{isAvailable ? "ON" : "OFF"}</Text>

            <Text style={styles.statLabel}>Pedometer</Text>
          </View>
        </View>
      </View>

      {/* Session Card */}
      <View style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionTitle}>Walking Session</Text>

          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: walking ? "#00E676" : "#FF5252",
              },
            ]}
          />
        </View>

        <Text style={styles.sessionStatus}>
          {walking ? "ACTIVE" : "NOT ACTIVE"}
        </Text>

        <View style={styles.sessionStats}>
          <View>
            <Text style={styles.sessionNumber}>{sessionSteps}</Text>

            <Text style={styles.sessionText}>Session Steps</Text>
          </View>

          <View>
            <Text style={styles.sessionNumber}>{sessionCalories}</Text>

            <Text style={styles.sessionText}>Calories</Text>
          </View>
        </View>

        {startTime && (
          <Text style={styles.timeText}>
            Started: {startTime.toLocaleTimeString()}
          </Text>
        )}

        {endTime && (
          <Text style={styles.timeText}>
            Finished: {endTime.toLocaleTimeString()}
          </Text>
        )}

        {!walking ? (
          <TouchableOpacity style={styles.walkButton} onPress={startWalk}>
            <Text style={styles.walkButtonText}>Start Walk</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.walkButton, { backgroundColor: "#D32F2F" }]}
            onPress={finishWalk}
          >
            <Text style={styles.walkButtonText}>Finish Walk</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("Goals")}
        >
          <Text style={styles.actionEmoji}>🎯</Text>

          <Text style={styles.actionText}>Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("Location")}
        >
          <Text style={styles.actionEmoji}>📍</Text>

          <Text style={styles.actionText}>GPS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("Reminder")}
        >
          <Text style={styles.actionEmoji}>⏰</Text>

          <Text style={styles.actionText}>Reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("Battery")}
        >
          <Text style={styles.actionEmoji}>🔋</Text>

          <Text style={styles.actionText}>Battery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate("Progress")}
        >
          <Text style={styles.actionEmoji}>📈</Text>

          <Text style={styles.actionText}>Progress</Text>
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
    paddingTop: 50,
  },

  header: {
    marginBottom: 25,
  },

  greeting: {
    color: "#94A3B8",
    fontSize: 16,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
  },

  heroCard: {
    backgroundColor: "#1E293B",
    borderRadius: 28,
    padding: 28,
    marginBottom: 25,
  },

  heroLabel: {
    color: "#94A3B8",
    fontSize: 16,
  },

  heroSteps: {
    color: "#FFFFFF",
    fontSize: 58,
    fontWeight: "bold",
    marginTop: 12,
  },

  heroSub: {
    color: "#CBD5E1",
    fontSize: 15,
    marginTop: 8,
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 25,
    gap: 15,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#334155",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },

  statValue: {
    color: "#00E676",
    fontSize: 24,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#CBD5E1",
    marginTop: 5,
  },

  sessionCard: {
    backgroundColor: "#1E293B",
    borderRadius: 28,
    padding: 25,
    marginBottom: 30,
  },

  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sessionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },

  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 50,
  },

  sessionStatus: {
    color: "#94A3B8",
    marginTop: 8,
    marginBottom: 25,
  },

  sessionStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  sessionNumber: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  sessionText: {
    color: "#94A3B8",
    marginTop: 5,
  },

  timeText: {
    color: "#CBD5E1",
    marginBottom: 8,
  },

  walkButton: {
    backgroundColor: "#00C853",
    padding: 16,
    borderRadius: 18,
    marginTop: 20,
  },

  walkButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },

  actionCard: {
    width: "47%",
    backgroundColor: "#1E293B",
    borderRadius: 22,
    padding: 25,
    alignItems: "center",
  },

  actionEmoji: {
    fontSize: 34,
    marginBottom: 12,
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
