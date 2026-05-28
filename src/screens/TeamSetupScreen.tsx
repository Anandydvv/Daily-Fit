import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
      Alert.alert(
        "Missing Details",
        "Please enter team name, student name, and grade level."
      );
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
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backgroundCircleOne} />
        <View style={styles.backgroundCircleTwo} />
        <View style={styles.backgroundCircleThree} />

        <View style={styles.heroSection}>
          <View style={styles.iconRow}>
            <Text style={styles.heroIcon}>🧪</Text>
            <Text style={styles.heroIcon}>🚀</Text>
            <Text style={styles.heroIcon}>🔬</Text>
            <Text style={styles.heroIcon}>⚙️</Text>
          </View>

          <Text style={styles.logo}>STEMM Lab</Text>
          <Text style={styles.subtitle}>Real-World STEMM Games</Text>

          <Text style={styles.description}>
            Explore science, technology, engineering, maths and medicine through
            real-world challenges.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardEmoji}>👥</Text>
          <Text style={styles.title}>Team Setup</Text>
          <Text style={styles.cardSubtitle}>
            Enter your team details to begin the challenge.
          </Text>

          <Text style={styles.label}>Team Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Logicloop"
            placeholderTextColor="#8A9AAD"
            value={teamName}
            onChangeText={setTeamName}
          />

          <Text style={styles.label}>Student Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Navteg"
            placeholderTextColor="#8A9AAD"
            value={studentName}
            onChangeText={setStudentName}
          />

          <Text style={styles.label}>Grade / Year Level</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Year 7"
            placeholderTextColor="#8A9AAD"
            value={grade}
            onChangeText={setGrade}
          />

          <TouchableOpacity style={styles.button} onPress={startApp}>
            <Text style={styles.buttonText}>Start STEMM Challenge 🚀</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featureRow}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Sensors</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📍</Text>
            <Text style={styles.featureText}>GPS</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Results</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Built for hands-on STEMM learning using phone sensors, timers, GPS and
          activity results.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#EAF7FF",
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#EAF7FF",
    padding: 24,
    paddingTop: 70,
    paddingBottom: 40,
    justifyContent: "center",
    overflow: "hidden",
  },

  backgroundCircleOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#BDEBFF",
    top: -80,
    right: -90,
    opacity: 0.8,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#DCFCE7",
    bottom: 80,
    left: -90,
    opacity: 0.9,
  },

  backgroundCircleThree: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#DBEAFE",
    top: 250,
    left: -55,
    opacity: 0.8,
  },

  heroSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  iconRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },

  heroIcon: {
    fontSize: 28,
  },

  logo: {
    color: "#0F172A",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  subtitle: {
    color: "#0284C7",
    fontSize: 19,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "700",
  },

  description: {
    color: "#475569",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 14,
    paddingHorizontal: 8,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 32,
    padding: 24,
    shadowColor: "#0F172A",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "#D8EEF8",
  },

  cardEmoji: {
    fontSize: 36,
    textAlign: "center",
    marginBottom: 8,
  },

  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },

  cardSubtitle: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 20,
  },

  label: {
    color: "#1E293B",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 7,
    marginLeft: 4,
  },

  input: {
    backgroundColor: "#F1F7FB",
    color: "#0F172A",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D8E7EF",
  },

  button: {
    backgroundColor: "#22C55E",
    padding: 17,
    borderRadius: 18,
    marginTop: 10,
    shadowColor: "#16A34A",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },

  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    gap: 12,
  },

  featureCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8EEF8",
  },

  featureIcon: {
    fontSize: 24,
    marginBottom: 6,
  },

  featureText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "700",
  },

  footer: {
    color: "#475569",
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
    lineHeight: 19,
  },
});