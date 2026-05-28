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

type SoundAction = {
  actionName: string;
  location: string;
  prediction: string;
  outcomeDb: string;
  wasCorrect: string;
};

export default function SoundPollutionScreen() {
  const navigation = useNavigation<any>();

  const [predictedLoudest, setPredictedLoudest] = useState("");
  const [surprises, setSurprises] = useState("");
  const [earMuffsNeeded, setEarMuffsNeeded] = useState("Not sure");

  const [actions, setActions] = useState<SoundAction[]>([
    {
      actionName: "Dropping a book on the table",
      location: "Front table",
      prediction: "",
      outcomeDb: "",
      wasCorrect: "",
    },
    {
      actionName: "Talking",
      location: "Middle of classroom",
      prediction: "",
      outcomeDb: "",
      wasCorrect: "",
    },
    {
      actionName: "Stamping feet",
      location: "Back of classroom",
      prediction: "",
      outcomeDb: "",
      wasCorrect: "",
    },
  ]);

  const updateAction = (
    index: number,
    field: keyof SoundAction,
    value: string,
  ) => {
    const updatedActions = [...actions];
    updatedActions[index] = {
      ...updatedActions[index],
      [field]: value,
    };
    setActions(updatedActions);
  };

  const getRiskLevel = (db: number) => {
    if (db <= 30) return "No risk";
    if (db <= 60) return "Safe for long periods";
    if (db <= 85) return "Generally safe, but may cause fatigue";
    if (db <= 90) return "Hearing damage possible after long exposure";
    if (db <= 100) return "Hearing damage likely after short exposure";
    if (db <= 110) return "Serious hearing damage possible in minutes";
    if (db <= 120) return "Painful; immediate damage possible";
    if (db <= 130) return "Immediate and severe hearing damage";
    return "Instant, permanent hearing damage risk";
  };

  const getZoneType = (db: number) => {
    if (db <= 60) return "Quiet Zone";
    if (db <= 85) return "Moderate Zone";
    if (db <= 100) return "Loud Zone";
    return "High Risk Zone";
  };

  const validResults = actions
    .map((item) => ({
      ...item,
      dbValue: Number(item.outcomeDb),
    }))
    .filter((item) => item.dbValue > 0);

  const loudestAction =
    validResults.length > 0
      ? validResults.reduce((highest, current) =>
          current.dbValue > highest.dbValue ? current : highest,
        )
      : null;

  const quietestAction =
    validResults.length > 0
      ? validResults.reduce((lowest, current) =>
          current.dbValue < lowest.dbValue ? current : lowest,
        )
      : null;

  const saveResult = async () => {
    if (!predictedLoudest.trim() || validResults.length === 0) {
      Alert.alert(
        "Missing Details",
        "Please enter your predicted loudest action and at least one dB result.",
      );
      return;
    }

    const actionSummary = actions
      .map((item, index) => {
        const dbValue = Number(item.outcomeDb);
        const zoneType = dbValue > 0 ? getZoneType(dbValue) : "Not classified";

        return `Action ${index + 1}: ${
          item.actionName || "Not entered"
        } | Location: ${item.location || "Not entered"} | Prediction: ${
          item.prediction || "Not entered"
        } | Outcome: ${item.outcomeDb || "N/A"} dB | Zone: ${zoneType} | Correct: ${
          item.wasCorrect || "Not entered"
        }`;
      })
      .join("\n");

    const zoneSummary =
      loudestAction && quietestAction
        ? `Loudest zone: ${loudestAction.location} (${loudestAction.dbValue} dB, ${getZoneType(
            loudestAction.dbValue,
          )}) | Quietest zone: ${quietestAction.location} (${
            quietestAction.dbValue
          } dB, ${getZoneType(quietestAction.dbValue)})`
        : "Zone summary not calculated.";

    const riskSummary = loudestAction
      ? `Loudest action: ${loudestAction.actionName} at ${loudestAction.location} (${loudestAction.dbValue} dB). Risk: ${getRiskLevel(
          loudestAction.dbValue,
        )}`
      : "No loudest action calculated.";

    await insertActivityResult({
      activityId: "sound",
      activityTitle: "Sound Pollution Hunter",
      area: "Environmental Science",
      design: zoneSummary,
      prediction: predictedLoudest,
      height: "",
      mass: "",
      dropTime: actionSummary,
      stopTime: riskSummary,
      finalVelocity: earMuffsNeeded,
      acceleration:
        "Classroom loud and quiet zones mapped using recorded dB results",
      netForce: "Not applicable",
      weight: "Not applicable",
      dragForce: "Not applicable",
      gForce: "Not applicable",
      reflection: surprises,
      mediaUri: "",
      createdAt: new Date().toLocaleString(),
    });

    Alert.alert("Saved", "Sound pollution results saved successfully.");
    navigation.navigate("History");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.area}>Environmental Science</Text>
      <Text style={styles.title}>Sound Pollution Hunter</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Prediction</Text>

        <Text style={styles.label}>
          Which action will create the loudest sound?
        </Text>
        <TextInput
          style={styles.input}
          value={predictedLoudest}
          onChangeText={setPredictedLoudest}
          placeholder="Example: Dropping a book"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {actions.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.sectionTitle}>Action {index + 1}</Text>

          <Text style={styles.label}>Action Tested</Text>
          <TextInput
            style={styles.input}
            value={item.actionName}
            onChangeText={(value) => updateAction(index, "actionName", value)}
            placeholder="Example: Dropping a pen"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Location / Zone</Text>
          <TextInput
            style={styles.input}
            value={item.location}
            onChangeText={(value) => updateAction(index, "location", value)}
            placeholder="Example: Front table / back corner"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Prediction</Text>
          <TextInput
            style={styles.input}
            value={item.prediction}
            onChangeText={(value) => updateAction(index, "prediction", value)}
            placeholder="Example: Louder than talking"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Outcome in dB</Text>
          <TextInput
            style={styles.input}
            value={item.outcomeDb}
            onChangeText={(value) => updateAction(index, "outcomeDb", value)}
            keyboardType="decimal-pad"
            placeholder="Example: 78"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Were You Right?</Text>
          <TextInput
            style={styles.input}
            value={item.wasCorrect}
            onChangeText={(value) => updateAction(index, "wasCorrect", value)}
            placeholder="Yes / No / Partly"
            placeholderTextColor="#94A3B8"
          />

          {Number(item.outcomeDb) > 0 && (
            <View style={styles.zoneBox}>
              <Text style={styles.zoneLabel}>Zone Classification</Text>
              <Text style={styles.zoneValue}>
                {getZoneType(Number(item.outcomeDb))}
              </Text>
            </View>
          )}
        </View>
      ))}

      {loudestAction && quietestAction && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Loud / Quiet Zone Map</Text>

          <View style={styles.highlightBox}>
            <Text style={styles.highlightLabel}>Loudest Zone</Text>
            <Text style={styles.highlightValue}>{loudestAction.location}</Text>
            <Text style={styles.highlightSubValue}>
              {loudestAction.dbValue} dB
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Quietest Zone</Text>
            <Text style={styles.value}>
              {quietestAction.location} ({quietestAction.dbValue} dB)
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Hearing Risk</Text>
            <Text style={styles.value}>
              {getRiskLevel(loudestAction.dbValue)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Reflection</Text>

        <Text style={styles.label}>Any surprises?</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={surprises}
          onChangeText={setSurprises}
          placeholder="Example: Stamping was louder than expected."
          placeholderTextColor="#94A3B8"
          multiline
        />

        <Text style={styles.label}>Should we wear ear muffs?</Text>
        <View style={styles.optionRow}>
          {["Yes", "No", "Not sure"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                earMuffsNeeded === option && styles.selectedOption,
              ]}
              onPress={() => setEarMuffsNeeded(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    marginTop: 8,
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
  infoBlock: {
    backgroundColor: "#334155",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },
  zoneBox: {
    backgroundColor: "#475569",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  zoneLabel: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  zoneValue: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  highlightBox: {
    backgroundColor: "#22C55E",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
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
