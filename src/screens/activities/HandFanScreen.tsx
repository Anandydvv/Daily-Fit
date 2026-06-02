import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
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

type FanDesign = {
  designName: string;
  material: string;
  distanceCm: string;
  predictedBend: string;
  outcomeDegrees: string;
  observation: string;
  wasCorrect: string;
};

type BestDesign = FanDesign & {
  index: number;
  degreeValue: number;
  forceValue: number;
};

export default function HandFanScreen() {
  const navigation = useNavigation<any>();

  const [overallPrediction, setOverallPrediction] = useState("");
  const [reflection, setReflection] = useState("");

  const [showComparison, setShowComparison] = useState(false);
  const [bestDesign, setBestDesign] = useState<BestDesign | null>(null);

  const [designs, setDesigns] = useState<FanDesign[]>([
    {
      designName: "1cm back and forward folds",
      material: "Thin printer paper",
      distanceCm: "30",
      predictedBend: "",
      outcomeDegrees: "",
      observation: "",
      wasCorrect: "",
    },
    {
      designName: "No folds",
      material: "Thin printer paper",
      distanceCm: "30",
      predictedBend: "",
      outcomeDegrees: "",
      observation: "",
      wasCorrect: "",
    },
    {
      designName: "Cardboard vertical sheet",
      material: "Thin cardboard",
      distanceCm: "30",
      predictedBend: "",
      outcomeDegrees: "",
      observation: "",
      wasCorrect: "",
    },
  ]);

  const resetComparison = () => {
    setShowComparison(false);
    setBestDesign(null);
  };

  const updateDesign = (
    index: number,
    field: keyof FanDesign,
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

  const getStiffnessCoefficient = (material: string) => {
    const lowerMaterial = material.toLowerCase();

    if (lowerMaterial.includes("corrugated")) {
      return 2.5;
    }

    if (lowerMaterial.includes("cardboard")) {
      return 0.5;
    }

    if (lowerMaterial.includes("card")) {
      return 0.2;
    }

    return 0.05;
  };

  const degreesToRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

  const calculateForce = (material: string, degrees: string) => {
    const bendDegrees = Number(degrees);

    if (bendDegrees <= 0) {
      return 0;
    }

    const stiffness = getStiffnessCoefficient(material);
    const radians = degreesToRadians(bendDegrees);

    return stiffness * radians;
  };

  const compareDesigns = () => {
    const completedDesigns = designs
      .map((item, index) => ({
        ...item,
        index,
        degreeValue: Number(item.outcomeDegrees),
        forceValue: calculateForce(item.material, item.outcomeDegrees),
      }))
      .filter((item) => item.degreeValue > 0);

    if (completedDesigns.length === 0) {
      Alert.alert(
        "No Results",
        "Please enter at least one bend outcome before comparing designs.",
      );
      return;
    }

    const best = completedDesigns.reduce((highest, current) =>
      current.degreeValue > highest.degreeValue ? current : highest,
    );

    setBestDesign(best);
    setShowComparison(true);
  };

  const saveResult = async () => {
    const completedDesigns = designs.filter(
      (item) => Number(item.outcomeDegrees) > 0,
    );

    if (!overallPrediction.trim() || completedDesigns.length === 0) {
      Alert.alert(
        "Missing Details",
        "Please enter your prediction and at least one design outcome.",
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
      .map((item, index) => {
        const force = calculateForce(item.material, item.outcomeDegrees);
        const stiffness = getStiffnessCoefficient(item.material);

        return `Design ${index + 1}: ${
          item.designName || "Not entered"
        } | Material: ${item.material || "Not entered"} | Distance: ${
          item.distanceCm || "N/A"
        } cm | Predicted bend: ${
          item.predictedBend || "Not entered"
        } | Outcome: ${item.outcomeDegrees || "N/A"} degrees | k: ${stiffness} N/rad | Estimated force: ${force.toFixed(
          3,
        )} N | Correct: ${item.wasCorrect || "Not entered"} | Notes: ${
          item.observation || "No notes"
        }`;
      })
      .join("\n");

    const bestSummary = `Most movement: Design ${bestDesign.index + 1} - ${
      bestDesign.designName
    } (${bestDesign.outcomeDegrees} degrees, ${bestDesign.forceValue.toFixed(
      3,
    )} N estimated force)`;

    await insertActivityResult({
      activityId: "hand-fan",
      activityTitle: "Hand Fan Challenge",
      area: "Physics - Air Movement",
      design: bestSummary,
      prediction: overallPrediction,
      height: "",
      mass: "",
      dropTime: designSummary,
      stopTime: `Best bend angle: ${bestDesign.outcomeDegrees} degrees`,
      finalVelocity: `${bestDesign.forceValue.toFixed(3)} N estimated force`,
      acceleration:
        "Approximate force calculated using F ≈ k × θ, where θ is bend angle in radians and k is material stiffness",
      netForce: "Not applicable",
      weight: "Not applicable",
      dragForce: "Not applicable",
      gForce: "Not applicable",
      reflection,
      mediaUri: "",
      createdAt: new Date().toLocaleString(),
    });

    Alert.alert("Saved", "Hand fan challenge result saved successfully.");
    navigation.navigate("History");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.area}>Physics - Air Movement</Text>
      <Text style={styles.title}>Hand Fan Challenge</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>
          Stand paper upright on a table and fan air from different distances.
          Record how much the paper or cardboard bends. Compare fan designs,
          material stiffness, and distance from the fan.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Prediction</Text>
        <Text style={styles.label}>
          Which fan design will make the paper move the most?
        </Text>

        <TextInput
          style={styles.input}
          value={overallPrediction}
          onChangeText={(value) => {
            setOverallPrediction(value);
            resetComparison();
          }}
          placeholder="Example: 1cm folded fan at 15cm distance"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {designs.map((item, index) => {
        const stiffness = getStiffnessCoefficient(item.material);
        const force = calculateForce(item.material, item.outcomeDegrees);

        return (
          <View key={index} style={styles.card}>
            <Text style={styles.sectionTitle}>Design {index + 1}</Text>

            <Text style={styles.label}>Fan Design</Text>
            <TextInput
              style={styles.input}
              value={item.designName}
              onChangeText={(value) => updateDesign(index, "designName", value)}
              placeholder="Example: 1cm back and forward folds"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Material</Text>
            <TextInput
              style={styles.input}
              value={item.material}
              onChangeText={(value) => updateDesign(index, "material", value)}
              placeholder="Thin printer paper / card stock / cardboard"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Fan Distance in cm</Text>
            <TextInput
              style={styles.input}
              value={item.distanceCm}
              onChangeText={(value) => updateDesign(index, "distanceCm", value)}
              keyboardType="decimal-pad"
              placeholder="15 / 30 / 45"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Predicted Bend</Text>
            <TextInput
              style={styles.input}
              value={item.predictedBend}
              onChangeText={(value) =>
                updateDesign(index, "predictedBend", value)
              }
              placeholder="Example: 30 degrees"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Outcome Bend in Degrees</Text>
            <TextInput
              style={styles.input}
              value={item.outcomeDegrees}
              onChangeText={(value) =>
                updateDesign(index, "outcomeDegrees", value)
              }
              keyboardType="decimal-pad"
              placeholder="Example: 30"
              placeholderTextColor="#94A3B8"
            />

            {Number(item.outcomeDegrees) > 0 && (
              <View style={styles.outcomeBox}>
                <Text style={styles.outcomeLabel}>Calculated Result</Text>
                <Text style={styles.outcomeValue}>
                  Bend angle: {item.outcomeDegrees} degrees
                </Text>
                <Text style={styles.outcomeValue}>
                  Stiffness k: {stiffness} N/rad
                </Text>
                <Text style={styles.outcomeValue}>
                  Estimated force: {force.toFixed(3)} N
                </Text>
              </View>
            )}

            <Text style={styles.label}>Observation Notes</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={item.observation}
              onChangeText={(value) =>
                updateDesign(index, "observation", value)
              }
              placeholder="Example: Paper bent quickly then returned upright"
              placeholderTextColor="#94A3B8"
              multiline
            />

            <Text style={styles.label}>Were You Right?</Text>
            <TextInput
              style={styles.input}
              value={item.wasCorrect}
              onChangeText={(value) => updateDesign(index, "wasCorrect", value)}
              placeholder="Yes / No / Partly"
              placeholderTextColor="#94A3B8"
            />
          </View>
        );
      })}

      <TouchableOpacity style={styles.compareButton} onPress={compareDesigns}>
        <Text style={styles.buttonText}>Compare Designs</Text>
      </TouchableOpacity>

      {showComparison && bestDesign && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Most Movement</Text>

          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>Highest Bend Angle</Text>
            <Text style={styles.highlightValue}>{bestDesign.designName}</Text>
            <Text style={styles.highlightSubValue}>
              {bestDesign.outcomeDegrees} degrees
            </Text>
            <Text style={styles.highlightSmallText}>
              Estimated force: {bestDesign.forceValue.toFixed(3)} N
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
          placeholder="Any surprises? How did material stiffness, fan design, or distance affect bending?"
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
