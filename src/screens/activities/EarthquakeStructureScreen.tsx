import { useNavigation } from "@react-navigation/native";
import { Gyroscope } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View,
} from "react-native";
import { insertActivityResult } from "../../database/database";

type DesignResult = {
  designName: string;
  phoneMoves: string;
  outcomeDegrees: string;
  wasCorrect: string;
};

type BestDesign = DesignResult & {
  index: number;
  degreeValue: number;
};

export default function EarthquakeStructureScreen() {
  const navigation = useNavigation<any>();

  const [prediction, setPrediction] = useState("");
  const [reflection, setReflection] = useState("");

  const [activeDesignIndex, setActiveDesignIndex] = useState<number | null>(
    null,
  );
  const [timer, setTimer] = useState(10);
  const [currentRotation, setCurrentRotation] = useState(0);

  const [showComparison, setShowComparison] = useState(false);
  const [bestDesign, setBestDesign] = useState<BestDesign | null>(null);

  const [designs, setDesigns] = useState<DesignResult[]>([
    {
      designName: "4 folds + 4 pillars",
      phoneMoves: "",
      outcomeDegrees: "",
      wasCorrect: "",
    },
    {
      designName: "10 folds + 4 pillars",
      phoneMoves: "",
      outcomeDegrees: "",
      wasCorrect: "",
    },
    {
      designName: "3 folds + 6 pillars",
      phoneMoves: "",
      outcomeDegrees: "",
      wasCorrect: "",
    },
  ]);

  const rotationSamples = useRef<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      stopTest();
    };
  }, []);

  const resetComparison = () => {
    setShowComparison(false);
    setBestDesign(null);
  };

  const updateDesign = (
    index: number,
    field: keyof DesignResult,
    value: string,
  ) => {
    const updatedDesigns = [...designs];
    updatedDesigns[index] = {
      ...updatedDesigns[index],
      [field]: value,
    };

    setDesigns(updatedDesigns);
    resetComparison();
  };

  const startTest = (index: number) => {
    if (!prediction.trim()) {
      Alert.alert("Missing Prediction", "Please enter your prediction first.");
      return;
    }

    if (!designs[index].designName.trim()) {
      Alert.alert("Missing Design", "Please enter the structure design.");
      return;
    }

    stopTest();
    resetComparison();

    rotationSamples.current = [];
    setTimer(10);
    setCurrentRotation(0);
    setActiveDesignIndex(index);

    Gyroscope.setUpdateInterval(200);

    Vibration.vibrate([300, 150, 300, 150, 300], false);

    subscriptionRef.current = Gyroscope.addListener((data) => {
      const rotationSpeed = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z,
      );

      const degrees = rotationSpeed * (180 / Math.PI);

      setCurrentRotation(degrees);
      rotationSamples.current.push(degrees);
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
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    Vibration.cancel();
    setActiveDesignIndex(null);
  };

  const finishTest = (index: number) => {
    const samples = rotationSamples.current;

    if (samples.length === 0) {
      stopTest();
      Alert.alert("No Data", "No gyroscope data was recorded.");
      return;
    }

    const maxDegrees = Math.max(...samples);
    const roundedDegrees = maxDegrees.toFixed(2);

    const updatedDesigns = [...designs];
    updatedDesigns[index] = {
      ...updatedDesigns[index],
      outcomeDegrees: roundedDegrees,
    };

    setDesigns(updatedDesigns);
    resetComparison();
    stopTest();

    Alert.alert(
      "Test Complete",
      `Design ${index + 1} outcome: ${roundedDegrees} degrees`,
    );
  };

  const compareDesigns = () => {
    const completedDesigns = designs
      .map((item, index) => ({
        ...item,
        index,
        degreeValue: Number(item.outcomeDegrees),
      }))
      .filter((item) => item.degreeValue > 0);

    if (completedDesigns.length === 0) {
      Alert.alert(
        "No Results",
        "Please run at least one vibration test before comparing designs.",
      );
      return;
    }

    const best = completedDesigns.reduce((lowest, current) =>
      current.degreeValue < lowest.degreeValue ? current : lowest,
    );

    setBestDesign(best);
    setShowComparison(true);
  };

  const saveResult = async () => {
    const completedDesigns = designs.filter(
      (item) => Number(item.outcomeDegrees) > 0,
    );

    if (!prediction.trim() || completedDesigns.length === 0) {
      Alert.alert(
        "Missing Details",
        "Please enter a prediction and complete at least one design test.",
      );
      return;
    }

    if (!showComparison || !bestDesign) {
      Alert.alert(
        "Compare First",
        "Please press Compare Designs before saving the result.",
      );
      return;
    }

    const designSummary = designs
      .map(
        (item, index) =>
          `Design ${index + 1}: ${item.designName || "Not entered"} | Phone moves: ${
            item.phoneMoves || "Not entered"
          } | Outcome: ${item.outcomeDegrees || "N/A"} degrees | Correct: ${
            item.wasCorrect || "Not entered"
          }`,
      )
      .join("\n");

    const bestSummary = `Best design: Design ${bestDesign.index + 1} - ${
      bestDesign.designName
    } (${bestDesign.outcomeDegrees} degrees)`;

    await insertActivityResult({
      activityId: "earthquake",
      activityTitle: "Earthquake-Resistant Structure",
      area: "Engineering + Earth Science",
      design: bestSummary,
      prediction,
      height: "",
      mass: "",
      dropTime: designSummary,
      stopTime: "Outcome measured in degrees using phone gyroscope",
      finalVelocity: bestSummary,
      acceleration:
        "Gyroscope used to measure phone rotation during vibration testing",
      netForce: "Not applicable",
      weight: "Not applicable",
      dragForce: "Not applicable",
      gForce: "Not applicable",
      reflection,
      mediaUri: "",
      createdAt: new Date().toLocaleString(),
    });

    Alert.alert("Saved", "Earthquake structure results saved successfully.");
    navigation.navigate("History");
  };

  const isTesting = activeDesignIndex !== null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.area}>Engineering + Earth Science</Text>
      <Text style={styles.title}>Earthquake-Resistant Structure</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>
          Build an anti-vibration layer using folded paper or cardboard. Place a
          flat cardboard platform on top, then place the phone in the centre.
          Start the vibration test and compare which structure design makes the
          phone move the least.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Prediction</Text>
        <Text style={styles.label}>
          Which fold design will make the phone move the least?
        </Text>

        <TextInput
          style={styles.input}
          value={prediction}
          onChangeText={(value) => {
            setPrediction(value);
            resetComparison();
          }}
          placeholder="Example: 10 folds + 4 pillars will move the least"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Vibration Timer</Text>

        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>
            {isTesting
              ? `Testing Design ${(activeDesignIndex ?? 0) + 1}`
              : "Ready to test"}
          </Text>

          <Text style={styles.timerValue}>{timer}s</Text>

          <Text style={styles.sensorText}>
            Rotation: {currentRotation.toFixed(2)} degrees
          </Text>
        </View>
      </View>

      {designs.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.sectionTitle}>Design {index + 1}</Text>

          <Text style={styles.label}>Design Details</Text>
          <TextInput
            style={styles.input}
            value={item.designName}
            onChangeText={(value) => updateDesign(index, "designName", value)}
            placeholder="Example: 4 folds + 4 pillars"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Phone Moves</Text>
          <TextInput
            style={styles.input}
            value={item.phoneMoves}
            onChangeText={(value) => updateDesign(index, "phoneMoves", value)}
            placeholder="Example: +/- 1 cm"
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity
            style={styles.recordButton}
            onPress={() => startTest(index)}
            disabled={isTesting}
          >
            <Text style={styles.buttonText}>
              {item.outcomeDegrees
                ? `Retest Design ${index + 1}`
                : "Start Vibration Test"}
            </Text>
          </TouchableOpacity>

          {item.outcomeDegrees ? (
            <View style={styles.outcomeBox}>
              <Text style={styles.outcomeLabel}>Outcome</Text>
              <Text style={styles.outcomeValue}>
                {item.outcomeDegrees} degrees
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Were You Right?</Text>
          <TextInput
            style={styles.input}
            value={item.wasCorrect}
            onChangeText={(value) => updateDesign(index, "wasCorrect", value)}
            placeholder="Yes / No / Partly"
            placeholderTextColor="#94A3B8"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.compareButton} onPress={compareDesigns}>
        <Text style={styles.buttonText}>Compare Designs</Text>
      </TouchableOpacity>

      {showComparison && bestDesign && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Best Structure</Text>

          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>Least Phone Movement</Text>
            <Text style={styles.highlightValue}>{bestDesign.designName}</Text>
            <Text style={styles.highlightSubValue}>
              {bestDesign.outcomeDegrees} degrees
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
    fontSize: 18,
    fontWeight: "bold",
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
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
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
