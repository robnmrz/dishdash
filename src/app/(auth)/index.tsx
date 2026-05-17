import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { ScreenShell } from "@/components/ScreenShell";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenShell>
      <View className="flex-1 px-8 justify-between py-16">
        <View className="flex-1 items-center justify-center gap-6">
          <Logo size="lg" />
          <Text
            className="text-3xl text-swish-ink text-center leading-snug"
            style={{ fontFamily: "InstrumentSerif_400Regular" }}
          >
            Plan meals.{" "}
            <Text style={{ fontFamily: "InstrumentSerif_400Regular_Italic" }}>
              Together.
            </Text>
          </Text>
          <Text
            className="text-base text-swish-muted text-center"
            style={{ fontFamily: "DMSans_400Regular" }}
          >
            Swipe, match, and shop from one shared list — every week.
          </Text>
        </View>

        <View className="gap-3">
          <Button
            label="Get started"
            variant="primary"
            onPress={() => router.push("/(auth)/sign-up")}
          />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => router.push("/(auth)/sign-in")}
          />
        </View>
      </View>
    </ScreenShell>
  );
}
