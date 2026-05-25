import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { stemmActivities } from "../data/stemmActivities";

type RouteParams = {
  ActivityDetail: {
    activityId: string;
  };
};

export default function ActivityDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "ActivityDetail">>();

  const activity = stemmActivities.find(
    (item) => item.id === route.params.activityId
  );

  if (!activity) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Activity not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.area}>{activity.area}</Text>
      <Text style={styles.title}>{activity.title}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.text}>{activity.overview}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Equipment</Text>
        {activity.equipment.map((item) => (
          <Text key={item} style={styles.listItem}>• {item}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {activity.instructions.map((item, index) => (
          <Text key={item} style={styles.listItem}>
            {index + 1}. {item}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App Feature Used</Text>
        <Text style={styles.text}>{activity.sensorUse}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Accelerometer")}
      >
        <Text style={styles.buttonText}>Open Motion Sensor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Gyroscope")}
      >
        <Text style={styles.buttonText}>Open Gyroscope</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Location")}
      >
        <Text style={styles.buttonText}>Add GPS Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("History")}
      >
        <Text style={styles.secondaryButtonText}>View Saved Results</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0F172A",
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  area: {
    color: "#38BDF8",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "bold",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
  },
  listItem: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
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
    textAlign: "center",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});