import { SafeAreaView } from "react-native-safe-area-context";
import type { ViewProps } from "react-native";

interface ScreenShellProps extends ViewProps {
  children: React.ReactNode;
}

export function ScreenShell({ children, className, ...rest }: ScreenShellProps) {
  return (
    <SafeAreaView
      className={`flex-1 bg-swish-cream ${className ?? ""}`}
      {...rest}
    >
      {children}
    </SafeAreaView>
  );
}
