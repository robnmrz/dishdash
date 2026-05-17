import { Text, View } from "react-native";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-4xl",
  md: "text-5xl",
  lg: "text-6xl",
};

export function Logo({ size = "md" }: LogoProps) {
  return (
    <View className="flex-row items-baseline">
      <Text
        className={`${sizeClasses[size]} text-swish-ink`}
        style={{ fontFamily: "InstrumentSerif_400Regular_Italic" }}
      >
        Swish
      </Text>
      <Text
        className={`${sizeClasses[size]} text-swish-ink`}
        style={{ fontFamily: "InstrumentSerif_400Regular" }}
      >
        Dish
      </Text>
    </View>
  );
}
