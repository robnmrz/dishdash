import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { COLORS } from "@/constants/theme";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password) return;
    setError(null);
    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
      router.replace("/(tabs)/plan");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell>
      <View className="px-8 pt-4">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-swish-card border border-swish-hairline items-center justify-center"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={16} color={COLORS.ink} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-8 pt-10">
        <Text
          className="text-4xl text-swish-ink mb-8"
          style={{ fontFamily: "InstrumentSerif_400Regular" }}
        >
          Create your{"\n"}
          <Text style={{ fontFamily: "InstrumentSerif_400Regular_Italic" }}>
            account
          </Text>
        </Text>

        <View className="gap-3 mb-4">
          <TextInput
            className="h-14 px-4 rounded-2xl border border-swish-hairline bg-swish-paper text-swish-ink text-base"
            style={{ fontFamily: "DMSans_400Regular" }}
            placeholder="Name"
            placeholderTextColor={COLORS.muted}
            autoCapitalize="words"
            autoComplete="name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="h-14 px-4 rounded-2xl border border-swish-hairline bg-swish-paper text-swish-ink text-base"
            style={{ fontFamily: "DMSans_400Regular" }}
            placeholder="Email"
            placeholderTextColor={COLORS.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="h-14 px-4 rounded-2xl border border-swish-hairline bg-swish-paper text-swish-ink text-base"
            style={{ fontFamily: "DMSans_400Regular" }}
            placeholder="Password"
            placeholderTextColor={COLORS.muted}
            secureTextEntry
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && (
          <Text
            className="text-sm text-swish-coral mb-4"
            style={{ fontFamily: "DMSans_400Regular" }}
          >
            {error}
          </Text>
        )}

        <Button
          label="Create account"
          variant="primary"
          loading={loading}
          onPress={handleSignUp}
        />

        <View className="flex-row justify-center mt-6">
          <Text
            className="text-sm text-swish-muted"
            style={{ fontFamily: "DMSans_400Regular" }}
          >
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
            <Text
              className="text-sm text-swish-ink"
              style={{ fontFamily: "DMSans_500Medium" }}
            >
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenShell>
  );
}
