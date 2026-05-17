import * as Notifications from "expo-notifications";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ReminderScreen() {

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "DailyFit Reminder",
        body: "Time to complete your daily fitness goal!",
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Reminder</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={sendNotification}
      >
        <Text style={styles.buttonText}>
          Send Reminder
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});