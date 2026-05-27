import { useNavigation } from "@react-navigation/native";
import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
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

type RecordingMode = "rest" | "jogging" | "star-jumps" | null;

export default function BreathingTrainerScreen() {
  const navigation = useNavigation<any>();

  const [prediction, setPrediction] = useState("");
  const [reflection, setReflection] = useState("");

  const [recordingMode, setRecordingMode] = useState<RecordingMode>(null);
  const [timer, setTimer] = useState(30);

  const [restBreaths, setRestBreaths] = useState<number | null>(null);
  const [joggingBreaths, setJoggingBreaths] = useState<number | null>(null);
  const [starJumpBreaths, setStarJumpBreaths] = useState<number | null>(null);

  const [movementValue, setMovementValue] = useState(0);

  const movementSamples = useRef<number[]>([]);
  const lastPeakTime = useRef<number>(0);
  const breathCount = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const subscriptionRef = useRef<any>(null);

  const joggingChange =
    restBreaths !== null && joggingBreaths !== null
      ? joggingBreaths - restBreaths
      : 0;

  const starJumpChange =
    restBreaths !== null && starJumpBreaths !== null
      ? starJumpBreaths - restBreaths
      : 0;

  useEffect(() => {
    return () => {
      stopSensor();
    };
  }, []);

  const stopSensor = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setRecordingMode(null);
  };

  const startRecording = async (mode: RecordingMode) => {
    if (!prediction.trim()) {
      Alert.alert("Missing Prediction", "Please enter your prediction first.");
      return;
    }

    stopSensor();

    movementSamples.current = [];
    lastPeakTime.current = 0;
    breathCount.current = 0;

    setTimer(30);
    setRecordingMode(mode);

    Accelerometer.setUpdateInterval(250);

    subscriptionRef.current = Accelerometer.addListener((data) => {
      const movement = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z,
      );

      setMovementValue(movement);

      movementSamples.current.push(movement);

      if (movementSamples.current.length > 6) {
        movementSamples.current.shift();
      }

      const average =
        movementSamples.current.reduce((sum, value) => sum + value, 0) /
        movementSamples.current.length;

      const now = Date.now();
      const isPeak = movement > average + 0.035;
      const enoughTimePassed = now - lastPeakTime.current > 1800;

      if (isPeak && enoughTimePassed) {
        breathCount.current += 1;
        lastPeakTime.current = now;
      }
    });

    intervalRef.current = setInterval(() => {
      setTimer((previous) => {
        if (previous <= 1) {
          finishRecording(mode);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  const finishRecording = (mode: RecordingMode) => {
    const estimatedBreathsPerMinute = breathCount.current * 2;

    if (mode === "rest") {
      setRestBreaths(estimatedBreathsPerMinute);
    }

    if (mode === "jogging") {
      setJoggingBreaths(estimatedBreathsPerMinute);
    }

    if (mode === "star-jumps") {
      setStarJumpBreaths(estimatedBreathsPerMinute);
    }

    stopSensor();

    Alert.alert(
      "Recording Complete",
      `Estimated breathing rate: ${estimatedBreathsPerMinute} breaths/min`,
    );
  };

  const saveResult = async () => {
    if (
      !prediction.trim() ||
      restBreaths === null ||
      joggingBreaths === null ||
      starJumpBreaths === null
    ) {
      Alert.alert(
        "Missing Details",
        "Please enter a prediction and record all three breathing tests.",
      );
      return;
    }

    await insertActivityResult({
      activityId: "breathing",
      activityTitle: "Breathing Pace Trainer",
      area: "Medical Science",
      design: "At rest, after jogging, and after star jumps",
      prediction,
      height: "",
      mass: "",
      dropTime: `${restBreaths} breaths/min`,
      stopTime: `${joggingBreaths} breaths/min`,
      finalVelocity: `${starJumpBreaths} breaths/min`,
      acceleration: `Jogging change: ${
        joggingChange >= 0 ? "+" : ""
      }${joggingChange} breaths/min | Star jumps change: ${
        starJumpChange >= 0 ? "+" : ""
      }${starJumpChange} breaths/min`,
      netForce: "Not applicable",
      weight: "Not applicable",
      dragForce: "Not applicable",
      gForce: "Not applicable",
      reflection,
      mediaUri: "",
      createdAt: new Date().toLocaleString(),
    });

    Alert.alert("Saved", "Breathing result saved successfully.");
    navigation.navigate("History");
  };

  const isRecording = recordingMode !== null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.area}>Medical Science</Text>
      <Text style={styles.title}>Breathing Pace Trainer</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>
          Place the phone gently on your chest while lying down or sitting
          still. The app records chest movement for 30 seconds and estimates
          breaths per minute.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Prediction</Text>

        <Text style={styles.label}>What do you expect?</Text>
        <TextInput
          style={styles.input}
          value={prediction}
          onChangeText={setPrediction}
          placeholder="Example: My breathing will increase after exercise"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Chest Movement Recording</Text>

        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>
            {isRecording
              ? recordingMode === "rest"
                ? "Recording breathing at rest"
                : recordingMode === "jogging"
                  ? "Recording after jogging"
                  : "Recording after star jumps"
              : "Ready to record"}
          </Text>

          <Text style={styles.timerValue}>{timer}s</Text>

          <Text style={styles.sensorText}>
            Movement: {movementValue.toFixed(3)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => startRecording("rest")}
          disabled={isRecording}
        >
          <Text style={styles.buttonText}>
            {restBreaths === null
              ? "Record Breathing at Rest"
              : `At Rest: ${restBreaths} breaths/min`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => startRecording("jogging")}
          disabled={isRecording}
        >
          <Text style={styles.buttonText}>
            {joggingBreaths === null
              ? "Record After Jogging"
              : `After Jogging: ${joggingBreaths} breaths/min`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => startRecording("star-jumps")}
          disabled={isRecording}
        >
          <Text style={styles.buttonText}>
            {starJumpBreaths === null
              ? "Record After Star Jumps"
              : `After Star Jumps: ${starJumpBreaths} breaths/min`}
          </Text>
        </TouchableOpacity>

        {isRecording && (
          <TouchableOpacity style={styles.stopButton} onPress={stopSensor}>
            <Text style={styles.buttonText}>Stop Recording</Text>
          </TouchableOpacity>
        )}
      </View>

      {restBreaths !== null &&
        joggingBreaths !== null &&
        starJumpBreaths !== null && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Result Summary</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Breathing at rest</Text>
              <Text style={styles.resultValue}>{restBreaths} breaths/min</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>After jogging</Text>
              <Text style={styles.resultValue}>
                {joggingBreaths} breaths/min
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>After star jumps</Text>
              <Text style={styles.resultValue}>
                {starJumpBreaths} breaths/min
              </Text>
            </View>

            <View style={styles.highlightBox}>
              <Text style={styles.highlightLabel}>Change from rest</Text>
              <Text style={styles.highlightValue}>
                Jogging: {joggingChange >= 0 ? "+" : ""}
                {joggingChange} | Star jumps: {starJumpChange >= 0 ? "+" : ""}
                {starJumpChange}
              </Text>
            </View>
          </View>
        )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Reflection</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={reflection}
          onChangeText={setReflection}
          placeholder="Were you right? Any surprises?"
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
  instructions: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
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
  timerBox: {
    backgroundColor: "#334155",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  timerLabel: {
    color: "#CBD5E1",
    fontSize: 15,
    marginBottom: 4,
    textAlign: "center",
  },
  timerValue: {
    color: "#FFFFFF",
    fontSize: 46,
    fontWeight: "bold",
  },
  sensorText: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 4,
  },
  recordButton: {
    backgroundColor: "#38BDF8",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  stopButton: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  resultRow: {
    backgroundColor: "#334155",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  resultLabel: {
    color: "#CBD5E1",
    fontSize: 14,
    marginBottom: 4,
  },
  resultValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  highlightBox: {
    backgroundColor: "#22C55E",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  highlightLabel: {
    color: "#DCFCE7",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  highlightValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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
