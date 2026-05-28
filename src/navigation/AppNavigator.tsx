import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import AccelerometerScreen from "../screens/AccelerometerScreen";
import ActivityDetailScreen from "../screens/ActivityDetailScreen";
import BatteryScreen from "../screens/BatteryScreen";
import ChallengesFolderScreen from "../screens/ChallengesFolderScreen";
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
import EarthquakeStructureScreen from "../screens/activities/EarthquakeStructureScreen";
import ParachuteDropScreen from "../screens/activities/ParachuteDropScreen";
import ReactionBoardScreen from "../screens/activities/ReactionBoardScreen";
import SoundPollutionScreen from "../screens/activities/SoundPollutionScreen";

const Stack = createNativeStackNavigator();

const darkHeader = {
  headerStyle: { backgroundColor: "#0F172A" },
  headerTintColor: "#FFFFFF",
  headerTitleStyle: {
    fontWeight: "bold" as const,
  },
};

const dashboardBackOptions = (navigation: any, title: string) => ({
  title,
  ...darkHeader,
  headerBackVisible: false,
  headerLeft: () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.navigate("Dashboard")}
    >
      <Text style={styles.backButtonText}>‹ Dashboard</Text>
    </TouchableOpacity>
  ),
});

const challengesBackOptions = (navigation: any, title: string) => ({
  title,
  ...darkHeader,
  headerBackVisible: false,
  headerLeft: () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.navigate("ChallengesFolder")}
    >
      <Text style={styles.backButtonText}>‹ Challenges</Text>
    </TouchableOpacity>
  ),
});

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
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ChallengesFolder"
        component={ChallengesFolderScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "STEMM Challenges")
        }
      />

      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={({ navigation }) =>
          challengesBackOptions(navigation, "Read More")
        }
      />

      <Stack.Screen
        name="ParachuteDrop"
        component={ParachuteDropScreen}
        options={({ navigation }) =>
          challengesBackOptions(navigation, "Parachute Drop")
        }
      />

      <Stack.Screen
        name="SoundPollution"
        component={SoundPollutionScreen}
        options={({ navigation }) =>
          challengesBackOptions(navigation, "Sound Pollution")
        }
      />

      <Stack.Screen
        name="EarthquakeStructure"
        component={EarthquakeStructureScreen}
        options={({ navigation }) =>
          challengesBackOptions(navigation, "Earthquake Structure")
        }
      />

      <Stack.Screen
        name="ReactionBoard"
        component={ReactionBoardScreen}
        options={({ navigation }) =>
          challengesBackOptions(navigation, "Reaction Board")
        }
      />

      <Stack.Screen
        name="BreathingTrainer"
        component={BreathingTrainerScreen}
        options={({ navigation }) =>
          challengesBackOptions(navigation, "Breathing Trainer")
        }
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Login")
        }
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Sign Up")
        }
      />

      <Stack.Screen
        name="Goals"
        component={GoalsScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Challenge Goals")
        }
      />

      <Stack.Screen
        name="Location"
        component={LocationScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "GPS Tag")
        }
      />

      <Stack.Screen
        name="Reminder"
        component={ReminderScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Timed Challenge")
        }
      />

      <Stack.Screen
        name="Battery"
        component={BatteryScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Battery Monitor")
        }
      />

      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Activity Results")
        }
      />

      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Analytics")
        }
      />

      <Stack.Screen
        name="Accelerometer"
        component={AccelerometerScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Motion Sensor")
        }
      />

      <Stack.Screen
        name="Gyroscope"
        component={GyroscopeScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Gyroscope Sensor")
        }
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) =>
          dashboardBackOptions(navigation, "Team Profile")
        }
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingVertical: 8,
    paddingRight: 14,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});