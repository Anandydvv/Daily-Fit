import { useNavigation } from "@react-navigation/native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const navigation = useNavigation<any>();

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

        <Text style={styles.tagline}>Stay Active. Stay Healthy. Stay You.</Text>

        <View style={styles.illustrationBox}>
          <Text style={styles.character}>🏃‍♂️</Text>
          <Text style={styles.healthIcon}>💚</Text>
          <Text style={styles.healthText}>Healthy habits start today</Text>
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>Let’s begin your</Text>
          <Text style={styles.cardTitleGreen}>health journey ♡</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#9E9E9E"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#9E9E9E"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={styles.buttonText}>Go for it →</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupText}>
              Don’t have an account?{" "}
              <Text style={styles.signupGreen}>Sign up</Text>
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
  },

  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#416D32",
  },

  tagline: {
    marginTop: 12,
    fontSize: 15,
    color: "#3F3F3F",
    fontWeight: "600",
    textAlign: "center",
  },

  illustrationBox: {
    width: "100%",
    height: 150,
    marginTop: 8,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  character: {
    fontSize: 74,
  },

  healthIcon: {
    fontSize: 26,
    marginTop: -8,
  },

  healthText: {
    fontSize: 14,
    color: "#4F7D3A",
    fontWeight: "700",
    marginTop: 4,
  },

  loginCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    marginTop: 4,
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

  forgotText: {
    color: "#4F7D3A",
    textAlign: "right",
    fontSize: 14,
    marginBottom: 14,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#4F7D3A",
    padding: 16,
    borderRadius: 16,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  signupText: {
    textAlign: "center",
    fontSize: 15,
    color: "#333",
    marginTop: 16,
  },

  signupGreen: {
    color: "#4F7D3A",
    fontWeight: "bold",
  },
});