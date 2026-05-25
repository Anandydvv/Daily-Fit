import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signupUser = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Missing Details", "Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });

      Alert.alert(
        "Account Created",
        "Your account has been created successfully.",
      );

      navigation.replace("Dashboard");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>DailyFit</Text>
        </View>

        <Text style={styles.tagline}>Create your fitness account</Text>

        <View style={styles.signupCard}>
          <Text style={styles.cardTitle}>Start your</Text>
          <Text style={styles.cardTitleGreen}>health journey ♡</Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#9E9E9E"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#9E9E9E"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#9E9E9E"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={signupUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginGreen}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#EEF8EC",
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#EEF8EC",
    padding: 18,
    paddingBottom: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  logoBox: {
    width: "92%",
    paddingVertical: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#7EA66A",
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    marginBottom: 12,
  },

  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#416D32",
  },

  tagline: {
    fontSize: 16,
    color: "#3F3F3F",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },

  signupCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2A2A2A",
  },

  cardTitleGreen: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5C8F45",
    marginBottom: 18,
  },

  input: {
    backgroundColor: "#FBFCFA",
    borderWidth: 1,
    borderColor: "#DDE8D8",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#4F7D3A",
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  loginText: {
    textAlign: "center",
    fontSize: 15,
    color: "#333",
    marginTop: 16,
  },

  loginGreen: {
    color: "#4F7D3A",
    fontWeight: "bold",
  },
});
