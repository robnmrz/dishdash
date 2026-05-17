# SwishDish

## Overview

SwishDish is a mobile app for households to plan weekly meals together, vote on recipes
Tinder-style, and shop from a single shared grocery list. It removes the daily friction of
deciding what to eat by turning meal planning into a quick, fun group activity. The app
targets small households (couples, roommates, families) who cook regularly but struggle
to agree on what to make each week.

## Goals

1. Make weekly meal planning a 5-minute group activity instead of an ongoing negotiation
2. Ensure every household member has a voice in what gets cooked via swipe-based voting
3. Eliminate duplicate grocery runs by consolidating all recipe ingredients into one
   shared, interactive list

## Core User Flow

1. User signs up and creates (or joins) a household
2. User invites household members via email, phone, or invite link
3. User configures planning days (e.g. Mon + Thu) and a reminder time
4. On a planning day the app prompts: "Time to plan — start a swipe session?"
5. Each member swipes through recipe cards — right to like, left to skip
6. Recipes that get enough likes become the week's meal plan (matches)
7. Matched recipes auto-populate the shared grocery list
8. Members tap "Smart" to AI-consolidate the list by aisle (e.g. garlic × 3 recipes → 1 item)
9. Members shop and check off items interactively as they go

## Features

### Onboarding

- Create a named household ("The Patel–Kim House")
- Invite up to 8 members by email, phone, or shareable invite link
- Select planning cadence: which days of the week the household plans
- Set a reminder time: the app notifies everyone on planning days at this time
- Confirmation screen before entering the main app

### Planning

- Home screen shows the current week's plan with matched recipes
- Time-to-plan popup appears when a member opens the app on a planning day
- Swipe deck: browse recipe cards, swipe right to like, left to skip
- Each card shows recipe name, image, cook time, and a brief description
- Matches summary: recipes everyone (or enough members) agreed on, with vote counts and day assignments
- Recipe detail: full ingredients, method, serves count, dietary tags, author

### Shopping

- Grocery list view 1 — **By recipe**: ingredients grouped under each matched recipe
- Grocery list view 2 — **Smart list**: AI-consolidated, de-duplicated by aisle; merged items show "× N recipes" badges
- Interactive checkoff: tap any item to strike it through; state is shared and visible to all household members
- Manual add: add extra items to the list (item name, quantity, unit, category)
- Smart button triggers AI consolidation; raw list is always preserved underneath

### Recipes

- **Recipe library**: all recipes contributed by household members; filterable by All / Mine / Drafts / In deck / Cooked
- **Create from URL**: paste a recipe URL; AI parses ingredients, method, metadata; user reviews before saving
- **Create manually**: title, image URL, serves, cook time, dietary tags, ingredients table, numbered method steps
- **Manage recipes**: edit, delete, set status (draft / add to next swipe deck / mark as cooked)
- All recipes in the swipe deck come exclusively from the household's library

### Account

- Sign in / sign up with email + password
- JWT-based session stored securely on device
- User profile: display name, avatar color

## Scope

### In Scope (v1)

- iOS only
- Single household per user
- JWT email + password authentication
- Fetch-on-focus data sync (no WebSockets)
- Push notifications for planning reminders
- Offline grocery list (readable and checkoff-capable without internet)
- Recipe images stored as external URLs (no file upload)
- AI grocery consolidation and AI URL recipe parsing (via Go backend)

### Out of Scope (v1)

- Android
- Multiple households per user
- Recipe image file upload
- Social / OAuth sign-in (Google, Apple)
- Public recipe discovery outside the household library
- Real-time collaborative editing
- Meal plan history / analytics
- Dietary filtering on the swipe deck

## Success Criteria

1. A new user can complete onboarding (household → invite → cadence) and reach the Home screen
2. A household member can swipe through recipes and see matched results on the Matches screen
3. Matched recipes populate the grocery list; the Smart button consolidates items correctly
4. A household member can create a recipe from a URL and from scratch
5. The grocery list loads and remains interactive when the device is offline
6. The app sends a push notification at the configured reminder time on planning days
