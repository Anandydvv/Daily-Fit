import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { insertActivity } from "../database/database";

type LocationPoint = {
  latitude: number;
  longitude: number;
};

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [route, setRoute] = useState<LocationPoint[]>([]);
  const [distance, setDistance] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [startPoint, setStartPoint] = useState<LocationPoint | null>(null);

  const watcher = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    getCurrentLocation();

    return () => {
      if (watcher.current) {
        watcher.current.remove();
      }
    };
  }, []);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMsg("Location permission denied.");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setLocation(currentLocation);
  };

  const calculateDistance = (point1: LocationPoint, point2: LocationPoint) => {
    const earthRadius = 6371;

    const dLat = toRadians(point2.latitude - point1.latitude);
    const dLon = toRadians(point2.longitude - point1.longitude);

    const lat1 = toRadians(point1.latitude);
    const lat2 = toRadians(point2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  };

  const toRadians = (value: number) => {
    return (value * Math.PI) / 180;
  };

  const estimateSteps = (walkDistanceKm: number) => {
    return Math.round(walkDistanceKm * 1312);
  };

  const estimateCalories = (walkDistanceKm: number) => {
    return Math.round(walkDistanceKm * 60);
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow location access.");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const firstPoint = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    setLocation(currentLocation);
    setTracking(true);
    setRoute([firstPoint]);
    setDistance(0);
    setStartTime(new Date());
    setStartPoint(firstPoint);

    watcher.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (newLocation) => {
        setLocation(newLocation);

        const newPoint = {
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
        };

        setRoute((previousRoute) => {
          if (previousRoute.length > 0) {
            const lastPoint = previousRoute[previousRoute.length - 1];
            const addedDistance = calculateDistance(lastPoint, newPoint);

            setDistance((previousDistance) => previousDistance + addedDistance);
          }

          return [...previousRoute, newPoint];
        });
      },
    );
  };

  const stopTracking = async () => {
    if (watcher.current) {
      watcher.current.remove();
      watcher.current = null;
    }

    setTracking(false);

    if (!location || !startTime || !startPoint) {
      Alert.alert("No Session", "No walking session was recorded.");
      return;
    }

    const steps = estimateSteps(distance);

    if (distance < 0.01 || steps < 10) {
      Alert.alert(
        "Walk Too Short",
        "Walk a little longer before saving the session.",
      );
      return;
    }

    const finishTime = new Date();
    const calories = estimateCalories(distance);

    await insertActivity(
      finishTime.toISOString().split("T")[0],
      startTime.toLocaleTimeString(),
      finishTime.toLocaleTimeString(),
      steps,
      calories,
      Number(distance.toFixed(2)),
      startPoint.latitude,
      startPoint.longitude,
      location.coords.latitude,
      location.coords.longitude,
    );

    Alert.alert(
      "Walk Saved",
      `Distance: ${distance.toFixed(2)} km\nSteps: ${steps}\nCalories: ${calories}`,
    );
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Getting location...</Text>
      </View>
    );
  }

  const currentPoint = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPS Walk Tracker</Text>

      <View style={styles.mapCard}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentPoint.latitude,
            longitude: currentPoint.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          region={{
            latitude: currentPoint.latitude,
            longitude: currentPoint.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
        >
          <Marker coordinate={currentPoint} title="Current Location" />

          {route.length > 1 && (
            <Polyline
              coordinates={route}
              strokeWidth={5}
              strokeColor="#22C55E"
            />
          )}
        </MapView>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Tracking Status</Text>

        <Text style={tracking ? styles.active : styles.inactive}>
          {tracking ? "ACTIVE" : "NOT ACTIVE"}
        </Text>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statValue}>{distance.toFixed(2)} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>

          <View>
            <Text style={styles.statValue}>{estimateSteps(distance)}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
        </View>

        <Text style={styles.coords}>
          Lat: {currentPoint.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coords}>
          Lng: {currentPoint.longitude.toFixed(6)}
        </Text>
      </View>

      <TouchableOpacity
        style={tracking ? styles.stopButton : styles.startButton}
        onPress={tracking ? stopTracking : startTracking}
      >
        <Text style={styles.buttonText}>
          {tracking ? "Stop & Save Walk" : "Start Tracking"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
    paddingTop: 70,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },

  mapCard: {
    height: 330,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#1E293B",
  },

  map: {
    flex: 1,
  },

  infoCard: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },

  label: {
    color: "#94A3B8",
    fontSize: 15,
    marginBottom: 4,
  },

  active: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
  },

  inactive: {
    color: "#EF4444",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#94A3B8",
    fontSize: 15,
    marginTop: 4,
  },

  coords: {
    color: "#CBD5E1",
    fontSize: 14,
    marginTop: 4,
  },

  startButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  stopButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  loading: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginTop: 120,
  },

  error: {
    color: "#EF4444",
    fontSize: 18,
    textAlign: "center",
    marginTop: 120,
  },
});
