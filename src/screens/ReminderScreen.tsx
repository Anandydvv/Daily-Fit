import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type ReminderItem = {
  identifier: string;
  time: string;
};

export default function ReminderScreen() {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  useEffect(() => {
    setupNotifications();
    loadReminders();
  }, []);

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow notifications.");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("stemm-reminders", {
        name: "STEMM Activity Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }
  };

  const loadReminders = async () => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();

    const reminderList = scheduled.map((item) => {
      const reminderTime = item.content.data?.time as string;

      return {
        identifier: item.identifier,
        time: reminderTime || "Unknown Time",
      };
    });

    setReminders(reminderList);
  };

  const scheduleReminder = async () => {
    if (!hour || !minute) {
      Alert.alert("Missing Time", "Please enter hour and minute.");
      return;
    }

    const reminderHour = Number(hour);
    const reminderMinute = Number(minute);

    if (
      Number.isNaN(reminderHour) ||
      Number.isNaN(reminderMinute) ||
      reminderHour < 0 ||
      reminderHour > 23 ||
      reminderMinute < 0 ||
      reminderMinute > 59
    ) {
      Alert.alert("Invalid Time", "Hour must be 0-23 and minute must be 0-59.");
      return;
    }

    const reminderDate = new Date();
    reminderDate.setHours(reminderHour);
    reminderDate.setMinutes(reminderMinute);
    reminderDate.setSeconds(0);
    reminderDate.setMilliseconds(0);

    if (reminderDate <= new Date()) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    const formattedTime = `${String(reminderHour).padStart(2, "0")}:${String(
      reminderMinute
    ).padStart(2, "0")}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧪 STEMM Lab Reminder",
        body: "Time to complete your STEMM activity challenge!",
        sound: true,
        data: {
          time: formattedTime,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });

    setHour("");
    setMinute("");

    await loadReminders();

    Alert.alert(
      "Reminder Set",
      `STEMM activity reminder scheduled for ${formattedTime}`
    );
  };

  const cancelReminder = async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    await loadReminders();

    Alert.alert("Cancelled", "Reminder removed successfully.");
  };

  const cancelAllReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await loadReminders();

    Alert.alert("All Cancelled", "All reminders removed.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STEMM Activity Reminder</Text>

      <Text style={styles.subtitle}>
        Set reminders for your STEMM learning activities
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="HH"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={hour}
          onChangeText={setHour}
          style={styles.input}
          maxLength={2}
        />

        <Text style={styles.colon}>:</Text>

        <TextInput
          placeholder="MM"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={minute}
          onChangeText={setMinute}
          style={styles.input}
          maxLength={2}
        />
      </View>

      <Text style={styles.hint}>Use 24-hour format like 07:30 or 18:00</Text>

      <TouchableOpacity style={styles.button} onPress={scheduleReminder}>
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your STEMM Reminders</Text>

      {reminders.length === 0 ? (
        <Text style={styles.emptyText}>No reminders set yet.</Text>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.identifier}
          renderItem={({ item }) => (
            <View style={styles.reminderCard}>
              <View>
                <Text style={styles.reminderTitle}>STEMM Activity</Text>
                <Text style={styles.reminderTime}>{item.time}</Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => cancelReminder(item.identifier)}
              >
                <Text style={styles.deleteText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {reminders.length > 0 && (
        <TouchableOpacity
          style={styles.cancelAllButton}
          onPress={cancelAllReminders}
        >
          <Text style={styles.cancelAllText}>Cancel All Reminders</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    paddingTop: 90,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 28,
  },

  inputRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  input: {
    width: 90,
    backgroundColor: "#F3F4F6",
    color: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  colon: {
    fontSize: 34,
    fontWeight: "bold",
    marginHorizontal: 12,
    color: "#000",
  },

  hint: {
    textAlign: "center",
    color: "#777",
    marginBottom: 24,
    fontSize: 13,
  },

  button: {
    backgroundColor: "#FF9800",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 14,
  },

  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 16,
  },

  reminderCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reminderTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
  },

  reminderTime: {
    marginTop: 4,
    fontSize: 16,
    color: "#555",
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },

  cancelAllButton: {
    backgroundColor: "#1E293B",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },

  cancelAllText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});