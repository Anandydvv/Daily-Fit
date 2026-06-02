import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { auth } from "../firebaseConfig";

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [grade, setGrade] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!name || !teamName || !grade || !email || !password) {
      Alert.alert("Missing Details", "Please fill in all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
     navigation.replace("TeamSetup");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.logo}>🧪</Text>

        <Text style={styles.title}>STEMM Lab</Text>

        <Text style={styles.subtitle}>
          Explore science through real-world STEMM challenges
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Student Login</Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Team Name"
            placeholderTextColor="#888"
            value={teamName}
            onChangeText={setTeamName}
            style={styles.input}
          />

          <TextInput
            placeholder="Grade"
            placeholderTextColor="#888"
            value={grade}
            onChangeText={setGrade}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupText}>
              Don’t have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF8EC",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    fontSize: 64,
    textAlign: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2E7D32",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    marginTop: 8,
    marginBottom: 28,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 7,
  },

  cardTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2A2A2A",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 14,
    padding: 15,
    fontSize: 16,
    marginBottom: 13,
    color: "#111",
  },

  loginButton: {
    backgroundColor: "#4F7D3A",
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },

  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  signupText: {
    marginTop: 18,
    textAlign: "center",
    color: "#2E7D32",
    fontSize: 15,
    fontWeight: "600",
  },
});