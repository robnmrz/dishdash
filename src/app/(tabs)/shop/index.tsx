import { View, Text } from "react-native";
import { ScreenShell } from "@/components/ScreenShell";

export default function ShopScreen() {
  return (
    <ScreenShell>
      <View className="flex-1 items-center justify-center">
        <Text
          className="text-swish-muted text-base"
          style={{ fontFamily: "DMSans_400Regular" }}
        >
          Shop — coming soon
        </Text>
      </View>
    </ScreenShell>
  );
}
