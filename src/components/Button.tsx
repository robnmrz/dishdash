import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "coral" | "sage";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  variant?: Variant;
  label: string;
  loading?: boolean;
}

const variantClasses: Record<
  Variant,
  { container: string; text: string; spinner: string }
> = {
  primary: {
    container: "bg-swish-ink",
    text: "text-swish-cream",
    spinner: "#F5F2EC",
  },
  secondary: {
    container: "bg-transparent border border-swish-ink",
    text: "text-swish-ink",
    spinner: "#1C1A17",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-swish-ink2",
    spinner: "#3A3631",
  },
  coral: {
    container: "bg-swish-coral",
    text: "text-white",
    spinner: "#FFFFFF",
  },
  sage: {
    container: "bg-swish-sage",
    text: "text-white",
    spinner: "#FFFFFF",
  },
};

export function Button({
  variant = "primary",
  label,
  loading = false,
  disabled = false,
  ...rest
}: ButtonProps) {
  const styles = variantClasses[variant];

  return (
    <TouchableOpacity
      className={`w-full h-14 rounded-full items-center justify-center ${styles.container} ${disabled || loading ? "opacity-50" : ""}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={styles.spinner} />
      ) : (
        <Text
          className={`text-base font-medium ${styles.text}`}
          style={{ fontFamily: "DMSans_500Medium" }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
