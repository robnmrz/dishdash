import { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "@/services/api";
import type { User } from "@/services/api/types";

const TOKEN_KEY = "auth_token";

interface AuthState {
  isLoaded: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoaded: false,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then((token) => {
      setState({ isLoaded: true, isAuthenticated: !!token, user: null });
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await api.signIn(email, password);
    setState({ isLoaded: true, isAuthenticated: true, user: result.user });
    return result;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      const result = await api.signUp(email, password, name);
      setState({ isLoaded: true, isAuthenticated: true, user: result.user });
      return result;
    },
    []
  );

  const signOut = useCallback(async () => {
    await api.signOut();
    setState({ isLoaded: true, isAuthenticated: false, user: null });
  }, []);

  return { ...state, signIn, signUp, signOut };
}
