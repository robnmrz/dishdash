import "./global.css";
import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";
import * as SecureStore from "expo-secure-store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
  });

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    const init = async () => {
      const token = await SecureStore.getItemAsync("auth_token");
      await SplashScreen.hideAsync();
      if (token) {
        router.replace("/(tabs)/plan");
      } else {
        router.replace("/(auth)");
      }
    };

    init();
  }, [fontsLoaded, fontError, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
