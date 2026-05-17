// ── Domain types ────────────────────────────────────────────────────────────

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

export interface AuthResult {
  token: string;
  user: User;
}

export interface Household {
  id: string;
  name: string;
  members: User[];
  planningDays: Weekday[];
  reminderTime: string; // "HH:MM"
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  cookTimeMinutes: number;
  serves: number;
  dietaryTags: string[];
  ingredients: Ingredient[];
  method: string[];
  authorId: string;
  status: "draft" | "deck" | "cooked";
}

export interface CreateRecipeInput {
  title: string;
  imageUrl: string;
  description: string;
  cookTimeMinutes: number;
  serves: number;
  dietaryTags: string[];
  ingredients: Ingredient[];
  method: string[];
}

export interface ParsedRecipePreview {
  title: string;
  imageUrl: string;
  description: string;
  cookTimeMinutes: number;
  serves: number;
  dietaryTags: string[];
  ingredients: Ingredient[];
  method: string[];
}

export interface Match {
  recipe: Recipe;
  likedBy: User[];
  assignedDay?: Weekday;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  checked: boolean;
  recipeIds: string[];
}

export interface GroceryItemInput {
  name: string;
  quantity: string;
  unit: string;
  category: string;
}

export interface GroceryList {
  items: GroceryItem[];
  consolidated: boolean;
}

// ── Adapter interface ────────────────────────────────────────────────────────

export interface ApiAdapter {
  // Auth
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(email: string, password: string, name: string): Promise<AuthResult>;
  signOut(): Promise<void>;

  // Household
  createHousehold(name: string): Promise<Household>;
  getHousehold(): Promise<Household>;
  inviteMember(emailOrPhone: string): Promise<void>;
  setPlannningCadence(days: Weekday[], reminderTime: string): Promise<void>;

  // Recipes
  listRecipes(): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe>;
  createRecipe(input: CreateRecipeInput): Promise<Recipe>;
  parseRecipeFromUrl(url: string): Promise<ParsedRecipePreview>;
  updateRecipe(id: string, input: Partial<CreateRecipeInput>): Promise<Recipe>;
  deleteRecipe(id: string): Promise<void>;

  // Plan / swipe
  getSwipeDeck(): Promise<Recipe[]>;
  recordSwipe(recipeId: string, liked: boolean): Promise<void>;
  getMatches(): Promise<Match[]>;

  // Grocery
  getGroceryList(): Promise<GroceryList>;
  addGroceryItem(item: GroceryItemInput): Promise<GroceryItem>;
  toggleGroceryItem(id: string, checked: boolean): Promise<void>;
  consolidateGroceryList(): Promise<GroceryList>;
}
