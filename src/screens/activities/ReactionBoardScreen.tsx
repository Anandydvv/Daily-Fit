import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { insertActivityResult } from "../../database/database";

type GameState = "idle" | "waiting" | "ready" | "done";

export default function ReactionBoardScreen() {
  const navigation = useNavigation<any>();

  const [handUsed, setHandUsed] = useState("Dominant hand");
  const [prediction, setPrediction] = useState("");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [gameState, setGameState] = useState<GameState>("idle");

  const readyTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTest = () => {
    setReactionTime(null);
    setGameState("waiting");

    const randomDelay = Math.floor(Math.random() * 3000) + 2000;

    timeoutRef.current = setTimeout(() => {
      readyTimeRef.current = Date.now();
      setGameState("ready");
    }, randomDelay);
  };

  const handleTap = () => {
    if (gameState === "waiting") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setGameState("idle");
      Alert.alert("Too Early", "Wait until the button turns green.");
      return;
    }

    if (gameState === "ready") {
      const result = Date.now() - readyTimeRef.current;
      setReactionTime(result);
      setGameState("done");
    }
  };

  const resetTest = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setReactionTime(null);
    setGameState("idle");
  };

  const saveResult = async () => {
    if (!prediction.trim() || reactionTime === null) {
      Alert.alert(
        "Missing Details",
        "Please enter a prediction and complete the reaction test before saving.",
      );
      return;
    }

    await insertActivityResult({
      activityId: "reaction",
      activityTitle: "Reaction Board Challenge",
      area: "Neuroscience + Mathematics",
      design: handUsed,
      prediction,
      height: "",
      mass: "",
      dropTime: `${reactionTime} ms`,
      stopTime: "",
      finalVelocity: "Not applicable",
      acceleration: "Not applicable",
      netForce: "Not applicable",
      weight: "Not applicable",
      dragForce: "Not applicable",
      gForce: "Not applicable",
      reflection,
      mediaUri: "",
      createdAt: new Date().toLocaleString(),
    });

    Alert.alert("Saved", "Reaction result saved successfully.");
    navigation.navigate("History");
  };

  const getButtonText = () => {
    if (gameState === "idle") return "Start Reaction Test";
    if (gameState === "waiting") return "Wait...";
    if (gameState === "ready") return "TAP NOW";
    return "Test Complete";
  };

  const getButtonStyle = () => {
    if (gameState === "ready") return styles.readyButton;
    if (gameState === "waiting") return styles.waitingButton;
    return styles.actionButton;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.area}>Neuroscience + Mathematics</Text>
      <Text style={styles.title}>Reaction Board</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Record Test</Text>

        <Text style={styles.label}>Hand Used</Text>

        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              handUsed === "Dominant hand" && styles.selectedOption,
            ]}
            onPress={() => setHandUsed("Dominant hand")}
          >
            <Text style={styles.optionText}>Dominant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              handUsed === "Non-dominant hand" && styles.selectedOption,
            ]}
            onPress={() => setHandUsed("Non-dominant hand")}
          >
            <Text style={styles.optionText}>Non-dominant</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Prediction</Text>
        <TextInput
          style={styles.input}
          value={prediction}
          onChangeText={setPrediction}
          placeholder="Example: I think I will react under 500 ms"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Reaction Test</Text>

        <Text style={styles.instructions}>
          Press start, wait for the button to turn green, then tap as quickly as
          possible.
        </Text>

        <TouchableOpacity style={getButtonStyle()} onPress={handleTap}>
          <Text style={styles.bigButtonText}>{getButtonText()}</Text>
        </TouchableOpacity>

        {gameState === "idle" && (
          <TouchableOpacity style={styles.startButton} onPress={startTest}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}

        {gameState !== "idle" && (
          <TouchableOpacity style={styles.resetButton} onPress={resetTest}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        )}

        {reactionTime !== null && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Reaction Time</Text>
            <Text style={styles.resultValue}>{reactionTime} ms</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Reflection</Text>

        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={reflection}
          onChangeText={setReflection}
          placeholder="Was your reaction faster or slower than expected?"
          placeholderTextColor="#94A3B8"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveResult}>
        <Text style={styles.buttonText}>Save Result</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("History")}
      >
        <Text style={styles.secondaryButtonText}>View Saved Results</Text>
      </TouchableOpacity>
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
  area: {
    color: "#38BDF8",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "bold",
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  instructions: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#334155",
    color: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#334155",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#38BDF8",
  },
  optionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#334155",
    height: 130,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  waitingButton: {
    backgroundColor: "#F59E0B",
    height: 130,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  readyButton: {
    backgroundColor: "#22C55E",
    height: 130,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  bigButtonText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#38BDF8",
    padding: 16,
    borderRadius: 16,
  },
  resetButton: {
    backgroundColor: "#64748B",
    padding: 16,
    borderRadius: 16,
  },
  resultBox: {
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
    alignItems: "center",
  },
  resultLabel: {
    color: "#CBD5E1",
    fontSize: 14,
    marginBottom: 4,
  },
  resultValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#22C55E",
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
  },
  secondaryButton: {
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
