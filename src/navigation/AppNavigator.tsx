import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AccelerometerScreen from "../screens/AccelerometerScreen";
import ActivityDetailScreen from "../screens/ActivityDetailScreen";
import BatteryScreen from "../screens/BatteryScreen";
import DashboardScreen from "../screens/DashboardScreen";
import GoalsScreen from "../screens/GoalsScreen";
import GyroscopeScreen from "../screens/GyroscopeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import LocationScreen from "../screens/LocationScreen";
import LoginScreen from "../screens/loginscreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProgressScreen from "../screens/ProgressScreen";
import ReminderScreen from "../screens/ReminderScreen";
import SignupScreen from "../screens/SignupScreen";
import TeamSetupScreen from "../screens/TeamSetupScreen";

import BreathingTrainerScreen from "../screens/activities/BreathingTrainerScreen";
import ParachuteDropScreen from "../screens/activities/ParachuteDropScreen";
import ReactionBoardScreen from "../screens/activities/ReactionBoardScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="TeamSetup">
      <Stack.Screen
        name="TeamSetup"
        component={TeamSetupScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Login",
        }}
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: "Sign Up",
        }}
      />

      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "STEMM Lab",
          headerBackTitle: "Team Setup",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{
          title: "STEMM Activity",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="ParachuteDrop"
        component={ParachuteDropScreen}
        options={{
          title: "Parachute Drop",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="ReactionBoard"
        component={ReactionBoardScreen}
        options={{
          title: "Reaction Board",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="BreathingTrainer"
        component={BreathingTrainerScreen}
        options={{
          title: "Breathing Trainer",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          title: "Challenge Goals",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={{
          title: "GPS Tag",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="Reminder"
        component={ReminderScreen}
        options={{
          title: "Timed Challenge",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="Battery"
        component={BatteryScreen}
        options={{
          title: "Battery Monitor",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Activity Results",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: "Analytics",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="Accelerometer"
        component={AccelerometerScreen}
        options={{
          title: "Motion Sensor",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="Gyroscope"
        component={GyroscopeScreen}
        options={{
          title: "Gyroscope Sensor",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Team Profile",
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#FFFFFF",
        }}
      />
    </Stack.Navigator>
  );
}
