import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
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

export default function ParachuteDropScreen() {
  const navigation = useNavigation<any>();

  const [design, setDesign] = useState("");
  const [prediction, setPrediction] = useState("");
  const [height, setHeight] = useState("");
  const [mass, setMass] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [stopTime, setStopTime] = useState("");
  const [reflection, setReflection] = useState("");
  const [mediaUri, setMediaUri] = useState("");

  const heightValue = Number(height);
  const massValue = Number(mass);
  const dropTimeValue = Number(dropTime);
  const stopTimeValue = Number(stopTime);

  const canCalculate =
    heightValue > 0 && massValue > 0 && dropTimeValue > 0 && stopTimeValue > 0;

  const finalVelocity = canCalculate ? heightValue / dropTimeValue : 0;
  const acceleration = canCalculate ? finalVelocity / dropTimeValue : 0;
  const netForce = canCalculate ? massValue * acceleration : 0;
  const weight = canCalculate ? massValue * 9.8 : 0;
  const dragForce = canCalculate ? weight - netForce : 0;
  const gForce = canCalculate ? finalVelocity / stopTimeValue / 9.8 : 0;

  const recordVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Camera Permission",
        "Camera access is needed to record the parachute drop.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      Alert.alert("Video Added", "Drop video has been attached.");
    }
  };

  const saveResult = async () => {
    if (!design.trim() || !prediction.trim() || !dropTime.trim()) {
      Alert.alert(
        "Missing Details",
        "Please enter design, prediction, and drop time.",
      );
      return;
    }

    await insertActivityResult({
      activityId: "parachute",
      activityTitle: "Parachute Drop Challenge",
      area: "Engineering + Physics",
      design,
      prediction,
      height,
      mass,
      dropTime,
      stopTime,
      finalVelocity: canCalculate ? finalVelocity.toFixed(2) : "Not calculated",
      acceleration: canCalculate ? acceleration.toFixed(2) : "Not calculated",
      netForce: canCalculate ? netForce.toFixed(2) : "Not calculated",
      weight: canCalculate ? weight.toFixed(2) : "Not calculated",
      dragForce: canCalculate ? dragForce.toFixed(2) : "Not calculated",
      gForce: canCalculate ? gForce.toFixed(2) : "Not calculated",
      reflection,
      mediaUri,
      createdAt: new Date().toLocaleString(),
    });

    Alert.alert("Saved", "Parachute result saved successfully.");
    navigation.navigate("History");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.area}>Engineering + Physics</Text>
      <Text style={styles.title}>Parachute Drop</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Record Test</Text>

        <Text style={styles.label}>Parachute Design</Text>
        <TextInput
          style={styles.input}
          value={design}
          onChangeText={setDesign}
          placeholder="Example: Plastic parachute"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Prediction</Text>
        <TextInput
          style={styles.input}
          value={prediction}
          onChangeText={setPrediction}
          placeholder="Example: This design will fall slowly"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Drop Height in metres</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="decimal-pad"
          placeholder="Example: 1.0"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Toy Mass in kg</Text>
        <TextInput
          style={styles.input}
          value={mass}
          onChangeText={setMass}
          keyboardType="decimal-pad"
          placeholder="Example: 0.20"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Time to First Hit Ground in seconds</Text>
        <TextInput
          style={styles.input}
          value={dropTime}
          onChangeText={setDropTime}
          keyboardType="decimal-pad"
          placeholder="Example: 2.4"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Time From First Hit to Stop in seconds</Text>
        <TextInput
          style={styles.input}
          value={stopTime}
          onChangeText={setStopTime}
          keyboardType="decimal-pad"
          placeholder="Example: 0.4"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Reflection</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={reflection}
          onChangeText={setReflection}
          placeholder="Were you correct? What would you improve?"
          placeholderTextColor="#94A3B8"
          multiline
        />

        <TouchableOpacity style={styles.cameraButton} onPress={recordVideo}>
          <Text style={styles.buttonText}>
            {mediaUri ? "Video Attached" : "Record Drop Video"}
          </Text>
        </TouchableOpacity>
      </View>

      {canCalculate && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Calculated Results</Text>

          <Text style={styles.result}>
            Final velocity: {finalVelocity.toFixed(2)} m/s
          </Text>
          <Text style={styles.result}>
            Acceleration: {acceleration.toFixed(2)} m/s²
          </Text>
          <Text style={styles.result}>Net force: {netForce.toFixed(2)} N</Text>
          <Text style={styles.result}>Weight: {weight.toFixed(2)} N</Text>
          <Text style={styles.result}>
            Drag force: {dragForce.toFixed(2)} N
          </Text>
          <Text style={styles.result}>G-force: {gForce.toFixed(2)} g</Text>
        </View>
      )}

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
  result: {
    backgroundColor: "#334155",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  cameraButton: {
    backgroundColor: "#38BDF8",
    padding: 16,
    borderRadius: 16,
    marginTop: 18,
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
