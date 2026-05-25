import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user = auth.currentUser;

  const logoutUser = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error: any) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.avatar}>👤</Text>

        <Text style={styles.name}>{user?.displayName || "DailyFit User"}</Text>

        <Text style={styles.email}>{user?.email || "No email found"}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Account Status</Text>
          <Text style={styles.infoValue}>Active</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Fitness Goal</Text>
          <Text style={styles.infoValue}>Stay active daily</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF8EC",
    padding: 24,
    justifyContent: "center",
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7,
  },

  avatar: {
    fontSize: 70,
    marginBottom: 12,
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2A2A2A",
    marginBottom: 6,
  },

  email: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
  },

  infoBox: {
    width: "100%",
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  infoTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4F7D3A",
  },

  logoutButton: {
    backgroundColor: "#E53935",
    width: "100%",
    padding: 16,
    borderRadius: 16,
    marginTop: 14,
  },

  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
