import { ReactNode } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HamburgerMenu } from "./HamburgerMenu";

interface AppShellProps {
  children: ReactNode;
  active: string;
}

export function AppShell({ children, active }: AppShellProps) {
  const navigation = useNavigation<any>();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{children}</View>
      <HamburgerMenu activeRoute={active} onNavigate={(name) => navigation.navigate(name)} />
    </View>
  );
}