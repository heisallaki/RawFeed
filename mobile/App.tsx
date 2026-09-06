import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

function StatusBarWrapper() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <StatusBarWrapper />
      <RootNavigator />
    </ThemeProvider>
  );
}