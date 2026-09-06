import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { RegionsScreen } from "../screens/RegionsScreen";
import { ExploreScreen } from "../screens/ExploreScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { EventDetailScreen } from "../screens/EventDetailScreen";

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Regions" component={RegionsScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}