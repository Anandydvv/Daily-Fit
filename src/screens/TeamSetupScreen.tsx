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

export default function TeamSetupScreen() {
  const navigation = useNavigation<any>();

  const [teamName, setTeamName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");

  const startApp = () => {
    if (!teamName.trim() || !studentName.trim() || !grade.trim()) {
      Alert.alert("Missing Details", "Please enter team name, student name, and grade level.");
      return;
    }

    navigation.navigate("Dashboard", {
      teamName,
      studentName,
      grade,
      discriminator: Math.floor(1000 + Math.random() * 9000),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>STEMM Lab</Text>
      <Text style={styles.subtitle}>Real-World STEMM Games</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Team Setup</Text>

        <TextInput
          style={styles.input}
          placeholder="Team Name"
          placeholderTextColor="#94A3B8"
          value={teamName}
          onChangeText={setTeamName}
        />

        <TextInput
          style={styles.input}
          placeholder="First Name of Team Member"
          placeholderTextColor="#94A3B8"
          value={studentName}
          onChangeText={setStudentName}
        />

        <TextInput
          style={styles.input}
          placeholder="Grade / Year Level"
          placeholderTextColor="#94A3B8"
          value={grade}
          onChangeText={setGrade}
        />

        <TouchableOpacity style={styles.button} onPress={startApp}>
          <Text style={styles.buttonText}>Start STEMM Challenge</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Use sensors, GPS, timers, and results to complete real-world learning challenges.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0F172A",
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#38BDF8",
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 35,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 28,
    padding: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#334155",
    color: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#22C55E",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  footer: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 28,
    fontSize: 14,
  },
});