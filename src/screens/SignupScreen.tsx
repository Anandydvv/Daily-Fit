import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

export default function SignupScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupUser = async () => {
    if (!email || !password) {
      Alert.alert("Missing Details", "Please enter email and password.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Account Created", "Your STEMM Lab account has been created.");
      navigation.replace("Login");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
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
          Start your STEMM learning journey today.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create your</Text>
          <Text style={styles.cardTitleGreen}>STEMM Lab account 🚀</Text>

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

          <TouchableOpacity style={styles.signupButton} onPress={signupUser}>
            <Text style={styles.signupButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Already have an account? Login</Text>
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
    fontSize: 16,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#2A2A2A",
    textAlign: "center",
  },

  cardTitleGreen: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 22,
  },

  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 14,
    padding: 15,
    fontSize: 16,
    marginBottom: 13,
    color: "#111",
  },

  signupButton: {
    backgroundColor: "#4F7D3A",
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },

  signupButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  loginText: {
    marginTop: 18,
    textAlign: "center",
    color: "#2E7D32",
    fontSize: 15,
    fontWeight: "600",
  },
});