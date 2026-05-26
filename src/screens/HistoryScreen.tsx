import { useFocusEffect } from "@react-navigation/native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityResult,
  clearActivityResults,
  getActivityResults,
} from "../database/database";

function SavedVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (playerInstance) => {
    playerInstance.loop = false;
  });

  return (
    <VideoView
      style={styles.video}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
      nativeControls
    />
  );
}

export default function HistoryScreen() {
  const [results, setResults] = useState<ActivityResult[]>([]);

  const loadResults = async () => {
    const data = await getActivityResults();
    setResults(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, []),
  );

  const clearHistory = async () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all saved STEMM activity records?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearActivityResults();
            setResults([]);
          },
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Activity History</Text>
      <Text style={styles.subtitle}>Saved STEMM activity results</Text>

      {results.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      )}

      {results.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No activity records yet.</Text>
          <Text style={styles.emptyText}>
            Start an activity, enter your result, record a video if needed, and
            save it to view it here.
          </Text>
        </View>
      ) : (
        results.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.area}>{item.area}</Text>
            <Text style={styles.activityTitle}>{item.activityTitle}</Text>
            <Text style={styles.date}>{item.createdAt}</Text>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Design</Text>
              <Text style={styles.value}>{item.design || "Not entered"}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Prediction</Text>
              <Text style={styles.value}>
                {item.prediction || "Not entered"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Height</Text>
              <Text style={styles.value}>{item.height || "N/A"} m</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Mass</Text>
              <Text style={styles.value}>{item.mass || "N/A"} kg</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Drop Time</Text>
              <Text style={styles.value}>{item.dropTime || "N/A"} sec</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Stop Time</Text>
              <Text style={styles.value}>{item.stopTime || "N/A"} sec</Text>
            </View>

            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Calculated Results</Text>
              <Text style={styles.resultText}>
                Final velocity: {item.finalVelocity} m/s
              </Text>
              <Text style={styles.resultText}>
                Acceleration: {item.acceleration} m/s²
              </Text>
              <Text style={styles.resultText}>
                Net force: {item.netForce} N
              </Text>
              <Text style={styles.resultText}>Weight: {item.weight} N</Text>
              <Text style={styles.resultText}>
                Drag force: {item.dragForce} N
              </Text>
              <Text style={styles.resultText}>G-force: {item.gForce} g</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Reflection</Text>
              <Text style={styles.value}>
                {item.reflection || "No reflection added"}
              </Text>
            </View>

            {item.mediaUri ? (
              <View style={styles.videoBlock}>
                <Text style={styles.label}>Recorded Drop Video</Text>
                <SavedVideo uri={item.mediaUri} />
              </View>
            ) : (
              <Text style={styles.noVideo}>No video attached.</Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0F172A",
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 22,
  },
  clearButton: {
    backgroundColor: "#DC2626",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyCard: {
    backgroundColor: "#1E293B",
    borderRadius: 22,
    padding: 24,
    marginTop: 30,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: {
    color: "#CBD5E1",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 22,
    marginBottom: 16,
  },
  area: {
    color: "#38BDF8",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  activityTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  date: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#334155",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  infoBlock: {
    backgroundColor: "#334155",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  label: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },
  resultBox: {
    backgroundColor: "#334155",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  resultTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultText: {
    color: "#CBD5E1",
    fontSize: 15,
    marginBottom: 4,
  },
  videoBlock: {
    backgroundColor: "#334155",
    padding: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  video: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginTop: 10,
    backgroundColor: "#000000",
  },
  noVideo: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 8,
  },
});
