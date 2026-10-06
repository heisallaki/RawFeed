import { useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { ACCENT_COLORS } from "../theme/theme";

const LINKS = [
  { name: "Home", label: "Home" },
  { name: "Regions", label: "Globe" },
  { name: "Explore", label: "Explore" },
  { name: "Settings", label: "Settings" },
];

interface HamburgerMenuProps {
  activeRoute: string;
  onNavigate: (name: string) => void;
}

export function HamburgerMenu({ activeRoute, onNavigate }: HamburgerMenuProps) {
  const { palette, accentColor } = useTheme();
  const accent = ACCENT_COLORS[accentColor];
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleSelect = (name: string) => {
    close();
    onNavigate(name);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.trigger, { backgroundColor: palette.surface, borderColor: palette.textMuted }]}
        accessibilityRole="button"
        accessibilityLabel="Open navigation menu"
      >
        <View style={[styles.bar, { backgroundColor: palette.text }]} />
        <View style={[styles.bar, { backgroundColor: palette.text }]} />
        <View style={[styles.bar, { backgroundColor: palette.text }]} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <View style={{ flex: 1 }}>
          <Pressable style={styles.backdrop} onPress={close} accessibilityLabel="Close navigation menu" />
          <View style={[styles.panel, { backgroundColor: palette.surface, borderColor: palette.textMuted }]}>
            <Text style={[styles.brand, { color: accent }]}>RawFeed</Text>
            {LINKS.map((link) => (
              <Pressable
                key={link.name}
                onPress={() => handleSelect(link.name)}
                style={({ pressed }) => [
                  styles.item,
                  {
                    backgroundColor:
                      activeRoute === link.name
                        ? `${accent}26`
                        : pressed
                        ? "rgba(128,128,128,0.12)"
                        : "transparent",
                  },
                ]}
              >
                <Text
                  style={{
                    color: activeRoute === link.name ? accent : palette.text,
                    fontWeight: activeRoute === link.name ? "700" : "500",
                    fontSize: 16,
                  }}
                >
                  {link.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 30,
    right: 16,
    zIndex: 50,
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  bar: {
    width: 20,
    height: 2,
    borderRadius: 2,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,12,26,0.45)",
  },
  panel: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 76,
    right: 16,
    left: 16,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  brand: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
});