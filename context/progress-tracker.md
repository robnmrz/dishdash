# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

Feature Spec 02 — complete. Ready for Spec 03 (onboarding flow UI).

## Current Goal

Onboarding flow UI: Create household → Invite → Cadence → Done

## Completed

- Context files populated from design (SwishDish.html + chat transcripts)
- Design decisions clarified with user (auth, sync, platforms, v1 scope)
- **Feature Spec 01**: folder structure, NativeWind swish tokens, tab navigation shell,
  auth screens (Welcome / Sign In / Sign Up), GoApiAdapter skeleton, JWT in SecureStore
- **Feature Spec 02**: `swishdish-api/` Go backend — JWT auth (sign-up/sign-in),
  household endpoints (create/get/invite/cadence), PostgreSQL migrations, Dockerfile,
  docker-compose.yaml

## In Progress

- None.

## Next Up

1. Onboarding flow UI: Create household → Invite → Cadence → Done
2. Home screen (Plan tab)
9. Swipe deck screen
10. Matches summary screen
11. Recipe detail screen
12. Grocery list (by-recipe view)
13. Smart list (AI-consolidated view)
14. Add item manually screen
15. Recipe library screen
16. New recipe – pick source screen
17. From URL – parsing preview screen
18. Manual create recipe screen
19. Push notification setup (Expo Notifications + backend registration)
20. Offline grocery list (store + sync on focus)

## Open Questions

- **API base URL**: user will provide the Go backend URL. Use `BASE_URL` env variable
  placeholder in `constants/config.ts` for now.
- **Deep link / invite scheme**: invite links show `swishdish.app/j/<code>` in the design.
  The universal link and deep link scheme for the app need to be confirmed before
  implementing the invite join flow.

## Architecture Decisions

- **Adapter pattern for API**: all network calls go through the `ApiAdapter` interface
  so the Go backend can be replaced or mocked without touching feature code.
  Decided up front to enforce clean separation.
- **Fetch-on-focus sync**: no WebSockets in v1. The grocery list and plan data are
  refetched when the user returns to the screen. Simplest approach for v1.
- **JWT in SecureStore**: rejected AsyncStorage for token storage due to security
  requirements. SecureStore is encrypted on-device.
- **Image URLs not uploads**: recipe images are sourced from external URLs (e.g. from
  a recipe website). The URL is saved in the database; no file upload infrastructure
  is needed in v1.
- **Single household in v1**: each user belongs to exactly one household. The UI does
  not need a household switcher. Revisit in v2.

## Session Notes

- Design source: SwishDish.html from Claude Design export (18 screens, 5 sections)
- Color system: warm cream `#F5F2EC` base, sage `#6B8E5A` + coral `#D67A5F` accents
- Fonts: Instrument Serif (editorial) + DM Sans (UI) via expo-google-fonts
- Tech decisions confirmed: Expo SDK 55 / expo-router / NativeWind v4 / TypeScript strict
