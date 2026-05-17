# Code Standards

## General

- Keep modules small and single-purpose; a file that does two unrelated things should
  be two files
- Fix root causes; do not layer conditional workarounds around broken behavior
- Do not mix feature logic (swipe voting) with infrastructure concerns (API calls, auth)
  in the same component or hook

## TypeScript

- Strict mode is required throughout the project (`"strict": true` in tsconfig)
- Avoid `any` — use explicit interfaces, discriminated unions, or `unknown` with narrowing
- Define response types for every API endpoint in `services/api/types.ts`
- Validate API responses at the adapter boundary before returning them to feature code

## React Native / Expo SDK 55

- Use **expo-router** file-based routing; route files live in `app/`
- All navigation is done via `expo-router` `Link`, `router.push()`, or `useRouter()` —
  never use React Navigation APIs directly
- Follow the Expo SDK 55 docs (https://docs.expo.dev/versions/v55.0.0/) before writing
  any platform-specific code
- Prefer functional components and hooks; no class components
- Keep screen components thin — extract business logic into feature hooks
  (`features/<name>/hooks/use<Name>.ts`)

## Styling

- Use NativeWind `className` for all styles — no inline `style` objects for visual
  properties (color, spacing, typography)
- `StyleSheet.create` is allowed only for properties that NativeWind cannot express,
  specifically animated `transform` arrays and `Animated.Value` bindings
- Never hardcode hex values in component files — use NativeWind classes (`text-swish-ink`)
  or, when a dynamic color is unavoidable, import the token from `constants/theme.ts`
- Use tokens from `constants/theme.ts` (e.g. `COLORS.ink`) only in cases where a JS
  value is needed (e.g. react-native-reanimated, chart libraries)

## File Organization

```
app/                      expo-router route files (screens)
  (auth)/                 unauthenticated routes (welcome, sign-in, sign-up)
  (tabs)/                 authenticated tab routes (plan, shop, recipes)
    plan/
    shop/
    recipes/
components/               shared UI primitives used across features
  Button.tsx
  Avatar.tsx
  ScreenShell.tsx
  Logo.tsx
constants/
  theme.ts                COLORS, FONTS design tokens (JS values)
  config.ts               BASE_URL and other env-driven config
features/                 one folder per product feature
  auth/
    hooks/
    types.ts
  household/
    hooks/
    types.ts
  plan/
    hooks/
    types.ts
  shop/
    hooks/
    types.ts
  recipes/
    hooks/
    types.ts
services/
  api/
    types.ts              ApiAdapter interface + all request/response types
    go-adapter.ts         Concrete GoApiAdapter implementation
    index.ts              Exports the active adapter instance
store/
  grocery.ts              Offline-capable grocery list state
```

## API Adapter Pattern

Define a single `ApiAdapter` interface in `services/api/types.ts`. Every API operation
the app needs must appear as a method on this interface. The concrete `GoApiAdapter`
implements it against the real Go backend. Feature code imports the adapter from
`services/api/index.ts` and calls interface methods — it never knows which concrete
adapter is in use.

```typescript
// services/api/types.ts (abbreviated)
export interface ApiAdapter {
  // Auth
  signIn(email: string, password: string): Promise<AuthResult>
  signUp(email: string, password: string, name: string): Promise<AuthResult>
  signOut(): Promise<void>

  // Household
  createHousehold(name: string): Promise<Household>
  getHousehold(): Promise<Household>
  inviteMember(emailOrPhone: string): Promise<void>
  setPlannningCadence(days: Weekday[], reminderTime: string): Promise<void>

  // Recipes
  listRecipes(): Promise<Recipe[]>
  getRecipe(id: string): Promise<Recipe>
  createRecipe(input: CreateRecipeInput): Promise<Recipe>
  parseRecipeFromUrl(url: string): Promise<ParsedRecipePreview>
  updateRecipe(id: string, input: Partial<CreateRecipeInput>): Promise<Recipe>
  deleteRecipe(id: string): Promise<void>

  // Plan / swipe
  getSwipeDeck(): Promise<Recipe[]>
  recordSwipe(recipeId: string, liked: boolean): Promise<void>
  getMatches(): Promise<Match[]>

  // Grocery
  getGroceryList(): Promise<GroceryList>
  addGroceryItem(item: GroceryItemInput): Promise<GroceryItem>
  toggleGroceryItem(id: string, checked: boolean): Promise<void>
  consolidateGroceryList(): Promise<GroceryList>
}
```

## Data and Storage

- All application data lives in the Go API's PostgreSQL database
- Recipe images are stored as `imageUrl: string` — the app renders them from the URL;
  no binary data is passed through the app
- The JWT token lives only in Expo SecureStore, retrieved through `services/api/go-adapter.ts`
- Grocery list items are additionally cached in the offline store (`store/grocery.ts`)
  so checkoff works without internet; the store syncs on next focus

## API Routes

- All requests go through the `GoApiAdapter` — no `fetch()` calls in feature code
- Attach the JWT automatically in the adapter's request layer, not at call sites
- Parse and validate API responses in the adapter before returning typed results
- Throw typed errors (not raw `Error` strings) so feature code can display meaningful
  messages to the user
