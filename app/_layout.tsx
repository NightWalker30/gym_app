import { Stack } from "expo-router";
import './globals.css';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* StatusBar en style light pour la première page */}
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <Stack
        screenOptions={{
          headerShown: false, // On cache tous les headers
          contentStyle: { backgroundColor: 'black' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="welcome" /> {/* ta page vidéo */}
      </Stack>
    </SafeAreaProvider>
  );
}
