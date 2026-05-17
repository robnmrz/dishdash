# AI Workflow Rules

## Approach

Build SwishDish incrementally using a spec-driven workflow. The context files define what
to build, how to build it, and the current state of progress. Always implement against
these specs — do not infer or invent behavior from scratch. If a behavior is ambiguous,
resolve it in the relevant context file before writing code.

Read https://docs.expo.dev/versions/v55.0.0/ before writing any Expo-specific code —
the Expo API changes between SDK versions and training data may be stale.

## Scoping Rules

- Work on one feature unit at a time
- Prefer small, verifiable increments over large speculative changes
- Do not combine unrelated system boundaries in a single implementation step
- A "feature unit" is: one screen, one hook, one adapter method group, or one shared
  component — not a whole feature section

## When to Split Work

Split an implementation step if it combines any of:

- Screen UI changes and API adapter changes
- Multiple unrelated screens in the same commit
- Behavior not clearly defined in the context files
- Changes to both the offline store and the API layer

If a change cannot be verified end to end on the simulator quickly, the scope is too
broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files
- If a requirement is ambiguous, add an open question to `progress-tracker.md` and
  resolve it with the user before implementing
- If a decision changes the architecture or storage model, update `architecture.md`
  before writing the code

## Protected Files

Do not modify the following unless explicitly instructed:

- `services/api/types.ts` — the `ApiAdapter` interface is the contract; changes affect
  the whole app
- `constants/theme.ts` — design tokens are defined once from `ui-context.md`; no ad-hoc
  color additions
- `tailwind.config.js` — custom color definitions mirror `constants/theme.ts`; keep them
  in sync when either changes

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- New API methods → `architecture.md` (invariants) + `code-standards.md` (adapter interface)
- New screens or navigation changes → `progress-tracker.md`
- New design patterns discovered → `ui-context.md`
- Scope changes (in or out) → `project-overview.md`

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope on the iOS simulator
2. No invariant defined in `architecture.md` was violated
3. `progress-tracker.md` is updated to reflect completed work and the next unit
4. `npx expo export` (or `npx expo start` with no errors) passes cleanly
5. TypeScript reports no errors (`npx tsc --noEmit`)
