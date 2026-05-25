import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AccelerometerScreen() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    const subscription = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);
    });

    Accelerometer.setUpdateInterval(500);

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Motion Sensor</Text>

      <View style={styles.card}>
        <Text style={styles.label}>X Axis</Text>
        <Text style={styles.value}>{x.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Y Axis</Text>
        <Text style={styles.value}>{y.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Z Axis</Text>
        <Text style={styles.value}>{z.toFixed(2)}</Text>
      </View>

      <Text style={styles.footer}>
        Move your phone to see live accelerometer values.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 18,
  },

  label: {
    fontSize: 18,
    color: "#666",
  },

  value: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 15,
  },
});