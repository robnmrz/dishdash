# UI Context

## Theme

Light only — no dark mode. The design language is a warm editorial cookbook: cream
backgrounds, ink text, and two accent colors (sage green for agreement/success, coral
for action/enthusiasm). The feel is calm and minimal, like a well-designed recipe book,
not a SaaS dashboard.

## Colors

All color values come from the SwishDish design system. In NativeWind, these are defined
as custom colors in `tailwind.config.js` under the `swish` namespace. Never use hardcoded
hex values in components — reference design tokens from `constants/theme.ts` for any
non-NativeWind usage (e.g. `style` props that must be dynamic).

| Role                    | NativeWind class prefix | Hex value   |
| ----------------------- | ----------------------- | ----------- |
| Page background         | `bg-swish-cream`        | `#F5F2EC`   |
| Surface / paper         | `bg-swish-paper`        | `#FBF9F4`   |
| Card / panel            | `bg-swish-card`         | `#FFFFFF`   |
| Primary text            | `text-swish-ink`        | `#1C1A17`   |
| Secondary text          | `text-swish-ink2`       | `#3A3631`   |
| Muted / placeholder     | `text-swish-muted`      | `#8B857B`   |
| Border / hairline       | `border-swish-hairline` | `#E8E2D4`   |
| Sage (success / agreed) | `bg-swish-sage`         | `#6B8E5A`   |
| Sage soft background    | `bg-swish-sage-soft`    | `#E4ECDB`   |
| Coral (CTA / yes)       | `bg-swish-coral`        | `#D67A5F`   |
| Coral soft background   | `bg-swish-coral-soft`   | `#F4DDD2`   |
| Butter (3rd avatar)     | `bg-swish-butter`       | `#E8C16A`   |

## Typography

Two fonts, two jobs. Never use a serif font for UI controls; never use the sans font for
editorial headlines.

| Role                        | Font              | When to use                                              |
| --------------------------- | ----------------- | -------------------------------------------------------- |
| Editorial / wordmark        | Instrument Serif  | Screen hero headlines, the app wordmark, italic key nouns in headings |
| UI / body / buttons / labels | DM Sans          | All controls, body copy, labels, tab bars, list items    |

**Italic accent pattern:** Headlines use Instrument Serif with select nouns in italic to
create editorial warmth — e.g. "Name your *kitchen*", "When do you *plan*?", "*Swish*Dish".
Body text and UI labels are never italic.

**Font size reference (design values, use NativeWind text- classes):**

| Context              | Approx size |
| -------------------- | ----------- |
| Hero / wordmark      | 56–64pt     |
| Screen heading       | 40–42pt     |
| Section heading      | 22–28pt     |
| Body / list items    | 15–17pt     |
| Labels / caps        | 11–13pt     |
| Tiny / meta          | 9–11pt      |

## Border Radius

| Context            | NativeWind class   |
| ------------------ | ------------------ |
| Buttons (pill)     | `rounded-full`     |
| Cards / panels     | `rounded-2xl`      |
| Input fields       | `rounded-2xl`      |
| Tag chips / pills  | `rounded-full`     |
| Avatar             | `rounded-full`     |
| Small accents      | `rounded-xl`       |

## Button Variants

Five button variants from the design. Implement as a shared `Button` component in
`components/Button.tsx`:

| Variant     | Background      | Text         | Use case                       |
| ----------- | --------------- | ------------ | ------------------------------ |
| `primary`   | `swish-ink`     | `swish-cream`| Primary CTA (Continue, Save)   |
| `secondary` | transparent     | `swish-ink`  | Secondary action, hairline border |
| `ghost`     | transparent     | `swish-ink2` | Tertiary / skip actions        |
| `coral`     | `swish-coral`   | white        | Swipe yes, positive action     |
| `sage`      | `swish-sage`    | white        | Confirmed / agreed state       |

All buttons are full-width with height 56pt and `rounded-full`. Font: DM Sans 500 weight.

## Icons

`@expo/vector-icons` — use the **Feather** icon set. Stroke-based, consistent weight.

| Context          | Size |
| ---------------- | ---- |
| Tab bar icons    | 24px |
| Button icons     | 20px |
| Inline / labels  | 16px |

## Layout Patterns

- **ScreenShell**: every screen wraps its content in a `View` with `flex-1 bg-swish-cream`.
  Top padding accounts for the status bar via `SafeAreaView` from `react-native-safe-area-context`.
- **Back button**: small circle button (36pt, white fill, hairline border) at the top-left
  of onboarding and detail screens.
- **Step dots**: progress indicator for multi-step onboarding flows; the active dot
  stretches to 18pt wide, inactive dots are 6pt, all 6pt tall, `rounded-full`.
- **Bottom sheet / modal**: used for the time-to-plan popup. Dark overlay + bottom-anchored
  card with `rounded-t-3xl`. Implemented with a gesture-dismissible sheet.
- **Tab bar**: three tabs — Plan, Shop, Recipes. Feather icons + DM Sans labels.
  Active tab uses `swish-ink`; inactive uses `swish-muted`.
- **FAB (Floating Action Button)**: used on the grocery list and recipe library for
  primary create actions. Pinned bottom-right, `rounded-full`, `bg-swish-ink`, white icon.
