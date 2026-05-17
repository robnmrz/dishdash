# Architecture Context

## Stack

| Layer        | Technology                           | Role                                               |
| ------------ | ------------------------------------ | -------------------------------------------------- |
| Framework    | React Native + Expo SDK 55           | Cross-platform mobile runtime (iOS v1)             |
| Routing      | expo-router (file-based)             | Screen navigation and deep links                   |
| Styling      | NativeWind v4                        | Tailwind utility classes for React Native          |
| Language     | TypeScript (strict)                  | Type safety across the entire app                  |
| API layer    | `GoApiAdapter` (adapter pattern)     | Concrete adapter for the custom Go backend         |
| Backend      | Go + PostgreSQL                      | Data storage, auth, AI features, business logic    |
| Auth storage | Expo SecureStore                     | Secure JWT persistence on device                   |
| Offline      | Async offline store (TBD library)    | Grocery list checkoff state survives offline       |
| Push         | Expo Notifications                   | Planning reminder push notifications               |
| Fonts        | expo-google-fonts (DM Sans + Instrument Serif) | Custom typography from Google Fonts       |

## System Boundaries

- `features/` — One folder per product feature (auth, household, plan, shop, recipes).
  Each feature owns its screens, components, hooks, and types. No cross-feature imports
  except through `services/` or `store/`.
- `services/api/` — The API adapter lives here. `types.ts` defines the `ApiAdapter`
  interface; `go-adapter.ts` is the concrete implementation. All API calls go through
  the adapter — no raw `fetch()` calls in feature code.
- `constants/` — Design tokens (`theme.ts`), app-wide config (`config.ts`). Read-only
  at runtime.
- `store/` — Global state and offline persistence. Grocery list checkoff state is
  persisted here so it survives offline and app restarts.
- `navigation/` — Tab bar configuration and root layout. Route guards (auth check)
  live here.
- `components/` — Shared UI primitives (Button, Avatar, ScreenShell, Logo) that are
  used across multiple features.

## Storage Model

- **PostgreSQL (via Go API)**: all application data — users, households, memberships,
  recipes, ingredients, meal plans, grocery lists, swipe votes
- **Expo SecureStore**: JWT token for the authenticated session. Never store the JWT
  in AsyncStorage.
- **External URLs**: recipe images are stored as `image_url` strings in PostgreSQL.
  The app renders them with `Image` from a URL. No binary image data is stored anywhere
  in the mobile app or database.
- **Offline store (device)**: grocery list items and their checked/unchecked state are
  cached locally so they remain readable and interactable without internet. The store
  syncs with the API on next focus.

## Auth and Access Model

- Every user signs up and signs in with email + password
- The Go backend validates credentials and returns a signed JWT
- The JWT is stored in Expo SecureStore under the key `auth_token`
- Every API request attaches the JWT as `Authorization: Bearer <token>`
- The API adapter handles token injection — feature code never touches the token directly
- Household membership is enforced server-side; all household resources are scoped to
  the authenticated user's household
- A user belongs to exactly one household in v1; the concept of a "current household"
  does not need to be UI-managed

## Invariants

1. All network calls go through the `ApiAdapter` interface — no raw `fetch()` or `axios`
   calls in feature code
2. The JWT is never stored in AsyncStorage — only in Expo SecureStore
3. NativeWind `className` is the only styling mechanism; `StyleSheet.create` is reserved
   for cases that NativeWind cannot express (e.g. animated `transform` arrays)
4. No hardcoded hex color values anywhere in component code — use tokens from
   `constants/theme.ts`
5. Feature folders do not import from each other — shared logic lives in `services/`,
   `store/`, or `components/`
6. The `ApiAdapter` interface in `services/api/types.ts` must not be changed without
   updating this file — it is the contract between the frontend and any backend
