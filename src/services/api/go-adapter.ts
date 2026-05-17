import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@/constants/config";
import type {
  ApiAdapter,
  AuthResult,
  CreateRecipeInput,
  GroceryItem,
  GroceryItemInput,
  GroceryList,
  Household,
  Match,
  ParsedRecipePreview,
  Recipe,
  Weekday,
} from "./types";

const TOKEN_KEY = "auth_token";

export class GoApiAdapter implements ApiAdapter {
  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText);
      throw new ApiError(response.status, message);
    }

    return response.json() as Promise<T>;
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async signIn(email: string, password: string): Promise<AuthResult> {
    const result = await this.request<AuthResult>("POST", "/auth/sign-in", {
      email,
      password,
    });
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    return result;
  }

  async signUp(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResult> {
    const result = await this.request<AuthResult>("POST", "/auth/sign-up", {
      email,
      password,
      name,
    });
    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    return result;
  }

  async signOut(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }

  // ── Household ─────────────────────────────────────────────────────────────

  async createHousehold(name: string): Promise<Household> {
    return this.request<Household>("POST", "/households", { name });
  }

  async getHousehold(): Promise<Household> {
    return this.request<Household>("GET", "/household");
  }

  async inviteMember(emailOrPhone: string): Promise<void> {
    await this.request("POST", "/household/invites", { emailOrPhone });
  }

  async setPlannningCadence(
    days: Weekday[],
    reminderTime: string
  ): Promise<void> {
    await this.request("PUT", "/household/cadence", { days, reminderTime });
  }

  // ── Recipes ───────────────────────────────────────────────────────────────

  async listRecipes(): Promise<Recipe[]> {
    return this.request<Recipe[]>("GET", "/recipes");
  }

  async getRecipe(id: string): Promise<Recipe> {
    return this.request<Recipe>("GET", `/recipes/${id}`);
  }

  async createRecipe(input: CreateRecipeInput): Promise<Recipe> {
    return this.request<Recipe>("POST", "/recipes", input);
  }

  async parseRecipeFromUrl(url: string): Promise<ParsedRecipePreview> {
    return this.request<ParsedRecipePreview>("POST", "/recipes/parse-url", {
      url,
    });
  }

  async updateRecipe(
    id: string,
    input: Partial<CreateRecipeInput>
  ): Promise<Recipe> {
    return this.request<Recipe>("PATCH", `/recipes/${id}`, input);
  }

  async deleteRecipe(id: string): Promise<void> {
    await this.request("DELETE", `/recipes/${id}`);
  }

  // ── Plan / swipe ──────────────────────────────────────────────────────────

  async getSwipeDeck(): Promise<Recipe[]> {
    return this.request<Recipe[]>("GET", "/plan/deck");
  }

  async recordSwipe(recipeId: string, liked: boolean): Promise<void> {
    await this.request("POST", "/plan/swipes", { recipeId, liked });
  }

  async getMatches(): Promise<Match[]> {
    return this.request<Match[]>("GET", "/plan/matches");
  }

  // ── Grocery ───────────────────────────────────────────────────────────────

  async getGroceryList(): Promise<GroceryList> {
    return this.request<GroceryList>("GET", "/grocery");
  }

  async addGroceryItem(item: GroceryItemInput): Promise<GroceryItem> {
    return this.request<GroceryItem>("POST", "/grocery/items", item);
  }

  async toggleGroceryItem(id: string, checked: boolean): Promise<void> {
    await this.request("PATCH", `/grocery/items/${id}`, { checked });
  }

  async consolidateGroceryList(): Promise<GroceryList> {
    return this.request<GroceryList>("POST", "/grocery/consolidate");
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}
