import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { stemmActivities } from "../data/stemmActivities";

const activityIcons: Record<string, string> = {
  parachute: "🪂",
  sound: "🔊",
  "human-performance": "🏃",
  reaction: "⚡",
  breathing: "🫁",
  earthquake: "🏗️",
};

const activityBackgrounds: Record<string, string> = {
  parachute: "#172554",
  sound: "#312E81",
  "human-performance": "#064E3B",
  reaction: "#7C2D12",
  breathing: "#164E63",
  earthquake: "#3F1D1D",
};

export default function ChallengesFolderScreen() {
  const navigation = useNavigation<any>();

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backgroundCircleOne} />
      <View style={styles.backgroundCircleTwo} />

      <View style={styles.header}>
        <Animated.Text
          style={[
            styles.folderEmoji,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          📁
        </Animated.Text>

        <Text style={styles.title}>STEMM Challenges</Text>
        <Text style={styles.subtitle}>
          Pick a challenge, read the task, then start your experiment.
        </Text>
      </View>

      {stemmActivities.map((activity) => {
        const isReady = Boolean(activity.screenName);

        return (
          <View
            key={activity.id}
            style={[
              styles.activityCard,
              {
                backgroundColor:
                  activityBackgrounds[activity.id] || "#0F172A",
              },
            ]}
          >
            <View style={styles.cardTopRow}>
              <Text style={styles.activityIcon}>
                {activityIcons[activity.id] || "🧪"}
              </Text>

              <View style={styles.tagBox}>
                <Text style={styles.tagText}>
                  {isReady ? "Ready" : "Coming Soon"}
                </Text>
              </View>
            </View>

            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityArea}>{activity.area}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() =>
                  navigation.navigate("ActivityDetail", {
                    activityId: activity.id,
                  })
                }
              >
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.startButton,
                  !isReady && styles.disabledButton,
                ]}
                disabled={!isReady}
                onPress={() => navigation.navigate(activity.screenName)}
              >
                <Text style={styles.startButtonText}>
                  {isReady ? "Start" : "Soon"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAF7FF",
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
    overflow: "hidden",
  },

  backgroundCircleOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#BDEBFF",
    top: -90,
    right: -80,
    opacity: 0.85,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "#DCFCE7",
    bottom: 40,
    left: -90,
    opacity: 0.9,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  folderEmoji: {
    fontSize: 52,
    marginBottom: 8,
  },

  title: {
    color: "#0F172A",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: "#475569",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
    paddingHorizontal: 10,
  },

  activityCard: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityIcon: {
    fontSize: 42,
  },

  tagBox: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  tagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  activityTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },

  activityArea: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 18,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },

  readMoreButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  readMoreText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "bold",
  },

  startButton: {
    flex: 1,
    backgroundColor: "#22C55E",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#64748B",
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});