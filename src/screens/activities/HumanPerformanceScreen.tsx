import { useNavigation } from "@react-navigation/native";
import { Accelerometer, Gyroscope } from "expo-sensors";
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

type AttemptResult = {
  movementName: string;
  prediction: string;
  movementScore: string;
  smoothnessScore: string;
  coordinationRating: string;
  wasCorrect: string;
};

type SensorSample = {
  movement: number;
  rotation: number;
};

export default function HumanPerformanceScreen() {
  const navigation = useNavigation<any>();

  const [overallPrediction, setOverallPrediction] = useState("");
  const [reflection, setReflection] = useState("");

  const [activeAttemptIndex, setActiveAttemptIndex] = useState<number | null>(
    null,
  );
  const [timer, setTimer] = useState(15);
  const [currentMovement, setCurrentMovement] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const [showComparison, setShowComparison] = useState(false);
  const [bestAttempt, setBestAttempt] = useState<AttemptResult | null>(null);

  const [attempts, setAttempts] = useState<AttemptResult[]>([
    {
      movementName: "Slow arm stretch",
      prediction: "",
      movementScore: "",
      smoothnessScore: "",
      coordinationRating: "",
      wasCorrect: "",
    },
    {
      movementName: "Side bend stretch",
      prediction: "",
      movementScore: "",
      smoothnessScore: "",
      coordinationRating: "",
      wasCorrect: "",
    },
    {
      movementName: "Balance reach",
      prediction: "",
      movementScore: "",
      smoothnessScore: "",
      coordinationRating: "",
      wasCorrect: "",
    },
  ]);

  const sensorSamples = useRef<SensorSample[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accelerometerRef = useRef<any>(null);
  const gyroscopeRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      stopTest();
    };
  }, []);

  const resetComparison = () => {
    setShowComparison(false);
    setBestAttempt(null);
  };

  const updateAttempt = (
    index: number,
    field: keyof AttemptResult,
    value: string,
  ) => {
    const updatedAttempts = [...attempts];

    updatedAttempts[index] = {
      ...updatedAttempts[index],
      [field]: value,
    };

    setAttempts(updatedAttempts);
    resetComparison();
  };

  const getCoordinationRating = (
    movementScore: number,
    smoothnessScore: number,
  ) => {
    if (movementScore < 0.18 && smoothnessScore > 85) {
      return "Excellent control";
    }

    if (movementScore < 0.3 && smoothnessScore > 70) {
      return "Good control";
    }

    if (movementScore < 0.45 && smoothnessScore > 55) {
      return "Moderate control";
    }

    return "Needs improvement";
  };

  const startTest = (index: number) => {
    if (!overallPrediction.trim()) {
      Alert.alert(
        "Missing Prediction",
        "Please enter your overall prediction first.",
      );
      return;
    }

    if (!attempts[index].movementName.trim()) {
      Alert.alert(
        "Missing Movement",
        "Please enter the movement or stretch name.",
      );
      return;
    }

    stopTest();
    resetComparison();

    sensorSamples.current = [];
    setTimer(15);
    setCurrentMovement(0);
    setCurrentRotation(0);
    setActiveAttemptIndex(index);

    Accelerometer.setUpdateInterval(200);
    Gyroscope.setUpdateInterval(200);

    accelerometerRef.current = Accelerometer.addListener((data) => {
      const movement = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z,
      );

      const adjustedMovement = Math.abs(movement - 1);
      setCurrentMovement(adjustedMovement);

      sensorSamples.current.push({
        movement: adjustedMovement,
        rotation: currentRotation,
      });
    });

    gyroscopeRef.current = Gyroscope.addListener((data) => {
      const rotation = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z,
      );

      setCurrentRotation(rotation);
    });

    intervalRef.current = setInterval(() => {
      setTimer((previous) => {
        if (previous <= 1) {
          finishTest(index);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  const stopTest = () => {
    if (accelerometerRef.current) {
      accelerometerRef.current.remove();
      accelerometerRef.current = null;
    }

    if (gyroscopeRef.current) {
      gyroscopeRef.current.remove();
      gyroscopeRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setActiveAttemptIndex(null);
  };

  const finishTest = (index: number) => {
    const samples = sensorSamples.current;

    if (samples.length === 0) {
      stopTest();
      Alert.alert("No Data", "No movement data was recorded.");
      return;
    }

    const movementValues = samples.map((item) => item.movement);
    const rotationValues = samples.map((item) => item.rotation);

    const averageMovement =
      movementValues.reduce((sum, value) => sum + value, 0) /
      movementValues.length;

    const maxRotation = Math.max(...rotationValues);

    const movementVariation =
      movementValues.reduce(
        (sum, value) => sum + Math.abs(value - averageMovement),
        0,
      ) / movementValues.length;

    const smoothnessScore = Math.max(0, 100 - movementVariation * 250);
    const coordinationRating = getCoordinationRating(
      averageMovement,
      smoothnessScore,
    );

    const updatedAttempts = [...attempts];

    updatedAttempts[index] = {
      ...updatedAttempts[index],
      movementScore: averageMovement.toFixed(3),
      smoothnessScore: smoothnessScore.toFixed(1),
      coordinationRating,
    };

    setAttempts(updatedAttempts);
    resetComparison();
    stopTest();

    Alert.alert(
      "Test Complete",
      `Movement score: ${averageMovement.toFixed(
        3,
      )}\nSmoothness score: ${smoothnessScore.toFixed(
        1,
      )}/100\nRotation peak: ${maxRotation.toFixed(
        3,
      )}\nRating: ${coordinationRating}`,
    );
  };

  const compareAttempts = () => {
    const completedAttempts = attempts
      .map((item, index) => ({
        ...item,
        index,
        scoreValue: Number(item.movementScore),
        smoothnessValue: Number(item.smoothnessScore),
      }))
      .filter((item) => item.scoreValue > 0 && item.smoothnessValue > 0);

    if (completedAttempts.length === 0) {
      Alert.alert(
        "No Results",
        "Please complete at least one movement test before comparing attempts.",
      );
      return;
    }

    const best = completedAttempts.reduce((currentBest, current) => {
      if (current.smoothnessValue > currentBest.smoothnessValue) {
        return current;
      }

      if (
        current.smoothnessValue === currentBest.smoothnessValue &&
        current.scoreValue < currentBest.scoreValue
      ) {
        return current;
      }

      return currentBest;
    });

    setBestAttempt(best);
    setShowComparison(true);
  };

  const saveResult = async () => {
    const completedAttempts = attempts.filter(
      (item) => Number(item.movementScore) > 0,
    );

    if (!overallPrediction.trim() || completedAttempts.length === 0) {
      Alert.alert(
        "Missing Details",
        "Please enter a prediction and complete at least one movement test.",
      );
      return;
    }

    if (!showComparison || !bestAttempt) {
      Alert.alert(
        "Compare First",
        "Please press Compare Attempts before saving the result.",
      );
      return;
    }

    const attemptSummary = attempts
      .map(
        (item, index) =>
          `Attempt ${index + 1}: ${
            item.movementName || "Not entered"
          } | Prediction: ${
            item.prediction || "Not entered"
          } | Movement score: ${item.movementScore || "N/A"} | Smoothness: ${
            item.smoothnessScore || "N/A"
          }/100 | Rating: ${
            item.coordinationRating || "N/A"
          } | Correct: ${item.wasCorrect || "Not entered"}`,
      )
      .join("\n");

    const bestSummary = `Best movement: ${bestAttempt.movementName} (${bestAttempt.smoothnessScore}/100 smoothness, ${bestAttempt.coordinationRating})`;

    await insertActivityResult({
      activityId: "human-performance",
      activityTitle: "Human Performance Lab",
      area: "Medical Science + Biomechanics",
      design: bestSummary,
      prediction: overallPrediction,
      height: "",
      mass: "",
      dropTime: attemptSummary,
      stopTime: `Best smoothness score: ${bestAttempt.smoothnessScore}/100`,
      finalVelocity: bestAttempt.coordinationRating,
      acceleration:
        "Accelerometer and gyroscope used to measure movement control, smoothness, and coordination during 15-second movement attempts",
      netForce: "Not applicable",
      weight: "Not applicable",
      dragForce: "Not applicable",
      gForce: "Not applicable",
      reflection,
      mediaUri: "",
      createdAt: new Date().toLocaleString(),
    });

    Alert.alert("Saved", "Human performance result saved successfully.");
    navigation.navigate("History");
  };

  const isTesting = activeAttemptIndex !== null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.area}>Medical Science + Biomechanics</Text>
      <Text style={styles.title}>Human Performance Lab</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>
          Hold the phone safely while completing a slow controlled movement or
          stretch. The app records movement for 15 seconds and estimates
          smoothness, coordination, and control.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Prediction</Text>
        <Text style={styles.label}>
          Which movement will be hardest to keep smooth and controlled?
        </Text>

        <TextInput
          style={styles.input}
          value={overallPrediction}
          onChangeText={(value) => {
            setOverallPrediction(value);
            resetComparison();
          }}
          placeholder="Example: Balance reach will be the hardest"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Movement Timer</Text>

        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>
            {isTesting
              ? `Testing Attempt ${(activeAttemptIndex ?? 0) + 1}`
              : "Ready to test"}
          </Text>

          <Text style={styles.timerValue}>{timer}s</Text>

          <Text style={styles.sensorText}>
            Movement: {currentMovement.toFixed(3)}
          </Text>
          <Text style={styles.sensorText}>
            Rotation: {currentRotation.toFixed(3)}
          </Text>
        </View>
      </View>

      {attempts.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.sectionTitle}>Attempt {index + 1}</Text>

          <Text style={styles.label}>Movement / Stretch</Text>
          <TextInput
            style={styles.input}
            value={item.movementName}
            onChangeText={(value) =>
              updateAttempt(index, "movementName", value)
            }
            placeholder="Example: Slow arm stretch"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Attempt Prediction</Text>
          <TextInput
            style={styles.input}
            value={item.prediction}
            onChangeText={(value) => updateAttempt(index, "prediction", value)}
            placeholder="Example: This attempt will be smooth"
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity
            style={styles.recordButton}
            onPress={() => startTest(index)}
            disabled={isTesting}
          >
            <Text style={styles.buttonText}>
              {item.movementScore
                ? `Retest Attempt ${index + 1}`
                : "Start 15 Second Test"}
            </Text>
          </TouchableOpacity>

          {item.movementScore ? (
            <View style={styles.outcomeBox}>
              <Text style={styles.outcomeLabel}>Outcome</Text>
              <Text style={styles.outcomeValue}>
                Movement: {item.movementScore}
              </Text>
              <Text style={styles.outcomeValue}>
                Smoothness: {item.smoothnessScore}/100
              </Text>
              <Text style={styles.outcomeValue}>
                Rating: {item.coordinationRating}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Were You Right?</Text>
          <TextInput
            style={styles.input}
            value={item.wasCorrect}
            onChangeText={(value) => updateAttempt(index, "wasCorrect", value)}
            placeholder="Yes / No / Partly"
            placeholderTextColor="#94A3B8"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.compareButton} onPress={compareAttempts}>
        <Text style={styles.buttonText}>Compare Attempts</Text>
      </TouchableOpacity>

      {showComparison && bestAttempt && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Best Performance</Text>

          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>Smoothest Movement</Text>
            <Text style={styles.highlightValue}>
              {bestAttempt.movementName}
            </Text>
            <Text style={styles.highlightSubValue}>
              {bestAttempt.smoothnessScore}/100
            </Text>
            <Text style={styles.highlightSmallText}>
              {bestAttempt.coordinationRating}
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
          placeholder="Were you right? Any surprises? What would you improve?"
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
    marginTop: 14,
  },
  outcomeBox: {
    backgroundColor: "#334155",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },
  outcomeLabel: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  outcomeValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  compareButton: {
    backgroundColor: "#38BDF8",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  highlightSubValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 4,
  },
  highlightSmallText: {
    color: "#DCFCE7",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
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
