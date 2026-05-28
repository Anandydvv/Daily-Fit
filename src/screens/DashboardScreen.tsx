import { useNavigation } from "@react-navigation/native";
import { Pedometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
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

  const floatOne = useRef(new Animated.Value(0)).current;
  const floatTwo = useRef(new Animated.Value(0)).current;
  const floatThree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Pedometer.isAvailableAsync().then((result) => {
      setIsAvailable(result);
    });

    const subscription = Pedometer.watchStepCount((result) => {
      setSteps(result.steps);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const makeFloat = (value: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: -12,
            duration: 1400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 1400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    makeFloat(floatOne, 0);
    makeFloat(floatTwo, 350);
    makeFloat(floatThree, 700);
  }, [floatOne, floatTwo, floatThree]);

  const workingActivities = stemmActivities.filter(
    (activity) => activity.screenName
  ).length;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />
      <View style={styles.backgroundCircleThree} />

      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>STEMM Lab</Text>
          <Text style={styles.subtitle}>Explore. Test. Learn.</Text>
        </View>

        <TouchableOpacity
          style={styles.profileBubble}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.profileEmoji}>👥</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.floatingEmojiBox}>
          <Animated.Text
            style={[
              styles.floatingEmoji,
              { transform: [{ translateY: floatOne }] },
            ]}
          >
            🧪
          </Animated.Text>

          <Animated.Text
            style={[
              styles.floatingEmoji,
              { transform: [{ translateY: floatTwo }] },
            ]}
          >
            🚀
          </Animated.Text>

          <Animated.Text
            style={[
              styles.floatingEmoji,
              { transform: [{ translateY: floatThree }] },
            ]}
          >
            🔬
          </Animated.Text>
        </View>

        <Text style={styles.heroTitle}>Welcome to your STEMM mission</Text>
        <Text style={styles.heroText}>
          Complete real-world science challenges using sensors, GPS, timers and
          saved results.
        </Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{workingActivities}</Text>
            <Text style={styles.heroStatLabel}>Ready Activities</Text>
          </View>

          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{isAvailable ? "ON" : "OFF"}</Text>
            <Text style={styles.heroStatLabel}>Motion Sensor</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.challengeFolder}
        onPress={() => navigation.navigate("ChallengesFolder")}
      >
        <View style={styles.folderIconBox}>
          <Text style={styles.folderIcon}>📁</Text>
        </View>

        <View style={styles.folderTextBox}>
          <Text style={styles.folderTitle}>STEMM Challenges</Text>
          <Text style={styles.folderSubtitle}>
            Open folder to view all activities
          </Text>

          <View style={styles.badgeRow}>
            <Text style={styles.readyBadge}>{workingActivities} Ready</Text>
            <Text style={styles.readMoreBadge}>Open Folder →</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Lab Tools</Text>

      <View style={styles.toolsGrid}>
        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={styles.toolEmoji}>📋</Text>
          <Text style={styles.toolText}>Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Progress")}
        >
          <Text style={styles.toolEmoji}>📊</Text>
          <Text style={styles.toolText}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Accelerometer")}
        >
          <Text style={styles.toolEmoji}>📱</Text>
          <Text style={styles.toolText}>Motion</Text>
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
          onPress={() => navigation.navigate("Reminder")}
        >
          <Text style={styles.toolEmoji}>⏱️</Text>
          <Text style={styles.toolText}>Timer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Battery")}
        >
          <Text style={styles.toolEmoji}>🔋</Text>
          <Text style={styles.toolText}>Battery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolCard}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.toolEmoji}>👥</Text>
          <Text style={styles.toolText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepsCard}>
        <Text style={styles.stepsTitle}>Live Movement Data</Text>
        <Text style={styles.stepsNumber}>{steps}</Text>
        <Text style={styles.stepsText}>
          steps detected while exploring STEMM activities
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAF7FF",
    padding: 20,
    paddingTop: 58,
    paddingBottom: 40,
    overflow: "hidden",
  },

  backgroundCircleOne: {
    position: "absolute",
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "#BDEBFF",
    top: -90,
    right: -90,
    opacity: 0.8,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "#DCFCE7",
    bottom: 80,
    left: -90,
    opacity: 0.85,
  },

  backgroundCircleThree: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "#DBEAFE",
    top: 300,
    left: -60,
    opacity: 0.75,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  appName: {
    color: "#0F172A",
    fontSize: 38,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#0284C7",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },

  profileBubble: {
    backgroundColor: "#FFFFFF",
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D8EEF8",
    elevation: 4,
  },

  profileEmoji: {
    fontSize: 26,
  },

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 24,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#D8EEF8",
    shadowColor: "#0F172A",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },

  floatingEmojiBox: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginBottom: 14,
  },

  floatingEmoji: {
    fontSize: 38,
  },

  heroTitle: {
    color: "#0F172A",
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  heroText: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  heroStatsRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 22,
  },

  heroStat: {
    flex: 1,
    backgroundColor: "#F1F7FB",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8E7EF",
  },

  heroStatValue: {
    color: "#16A34A",
    fontSize: 24,
    fontWeight: "bold",
  },

  heroStatLabel: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center",
  },

  challengeFolder: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
    shadowColor: "#0F172A",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  folderIconBox: {
    backgroundColor: "#1E293B",
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  folderIcon: {
    fontSize: 42,
  },

  folderTextBox: {
    flex: 1,
  },

  folderTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "bold",
  },

  folderSubtitle: {
    color: "#CBD5E1",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 12,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  readyBadge: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "bold",
  },

  readMoreBadge: {
    backgroundColor: "#E0F2FE",
    color: "#0369A1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "bold",
  },

  sectionTitle: {
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },

  toolCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8EEF8",
    elevation: 4,
  },

  toolEmoji: {
    fontSize: 31,
    marginBottom: 8,
  },

  toolText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },

  stepsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#D8EEF8",
    alignItems: "center",
  },

  stepsTitle: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "700",
  },

  stepsNumber: {
    color: "#0F172A",
    fontSize: 42,
    fontWeight: "bold",
    marginTop: 6,
  },

  stepsText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },
});