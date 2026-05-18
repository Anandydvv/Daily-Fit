import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BatteryScreen from "../screens/BatteryScreen";
import DashboardScreen from "../screens/DashboardScreen";
import GoalsScreen from "../screens/GoalsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import LocationScreen from "../screens/LocationScreen";
import LoginScreen from "../screens/LoginScreen";
import ProgressScreen from "../screens/ProgressScreen";
import ReminderScreen from "../screens/ReminderScreen";
import SignupScreen from "../screens/SignupScreen";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="Reminder" component={ReminderScreen} />
      <Stack.Screen name="Battery" component={BatteryScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
    </Stack.Navigator>
  );
}