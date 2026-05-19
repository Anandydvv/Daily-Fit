import { useNavigation } from "@react-navigation/native";
import {
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
    <ScrollView contentContainerStyle={styles.container}>
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

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}>
            Don’t have an account? <Text style={styles.signupGreen}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EEF8EC",
    padding: 22,
    alignItems: "center",
  },

  logoBox: {
    width: "92%",
    marginTop: 34,
    paddingVertical: 22,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: "#7EA66A",
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
  },

  logoText: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#416D32",
  },

  tagline: {
    marginTop: 18,
    fontSize: 17,
    color: "#3F3F3F",
    fontWeight: "600",
    textAlign: "center",
  },

  illustrationBox: {
    width: "100%",
    height: 250,
    marginTop: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  character: {
    fontSize: 105,
  },

  healthIcon: {
    fontSize: 36,
    marginTop: -10,
  },

  healthText: {
    fontSize: 16,
    color: "#4F7D3A",
    fontWeight: "700",
    marginTop: 8,
  },

  loginCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    padding: 26,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7,
  },

  cardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2A2A2A",
  },

  cardTitleGreen: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5C8F45",
    marginBottom: 24,
  },

  input: {
    backgroundColor: "#FBFCFA",
    borderWidth: 1,
    borderColor: "#DDE8D8",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    fontSize: 17,
  },

  forgotText: {
    color: "#4F7D3A",
    textAlign: "right",
    fontSize: 15,
    marginBottom: 20,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#4F7D3A",
    padding: 18,
    borderRadius: 18,
    shadowColor: "#4F7D3A",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },

  orText: {
    marginHorizontal: 12,
    color: "#999",
    fontWeight: "600",
  },

  signupText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },

  signupGreen: {
    color: "#4F7D3A",
    fontWeight: "bold",
  },
});