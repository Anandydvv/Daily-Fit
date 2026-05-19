import * as Battery from "expo-battery";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BatteryScreen() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    const getBattery = async () => {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(level);
    };

    getBattery();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Battery Status</Text>

      <Text style={styles.level}>
        {batteryLevel !== null
          ? `${Math.round(batteryLevel * 100)}%`
          : "Loading..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },

  level: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});