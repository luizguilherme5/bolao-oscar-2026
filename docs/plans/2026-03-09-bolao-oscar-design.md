# Bolão do Oscar 2026 - Design Document

## Overview
Web app for the group "Amigos da Rua" to predict Oscar winners. Users register with name/email/password, pick "will win" and "want to win" for each of 24 categories. Admin mode to mark actual winners and auto-update rankings.

## Stack
- **Next.js 14** (App Router) + TypeScript
- **Vercel KV** (Redis) for persistence
- **Tailwind CSS** + **Framer Motion** for UI/animations
- **bcryptjs** for password hashing
- Deploy on **Vercel**

## Data Model (Vercel KV)
- `user:{id}` → `{ id, name, email, passwordHash, createdAt }`
- `user:email:{email}` → `userId` (email lookup)
- `votes:{userId}` → `{ [categoryId]: { willWin: nomineeId, wantToWin: nomineeId } }`
- `winners` → `{ [categoryId]: nomineeId }`
- `users:list` → Redis Set of all userIds

## Pages
1. `/` — Landing (countdown, confetti, mini ranking, CTA)
2. `/entrar` — Login/register (name, email, password)
3. `/votar` — All 24 categories, two picks each (will win / want to win)
4. `/ranking` — Two tabs: "Vai Ganhar" / "Quero que Ganhe", expandable per-user detail
5. `/apuracao` — Admin mode (password: WagnerMoura123), mark winners

## Visual Theme
- Festa Colorida: vibrant colors (yellow, pink, purple, blue)
- Animated confetti, cinema emojis
- Mobile-first, fun and irreverent

## Key Decisions
- Users can edit votes until Oscar ceremony
- 1 point per correct pick, tiebreak by earliest vote
- Admin password hardcoded (it's among friends)
- Session via HTTP-only cookie
- Two independent rankings: "vai ganhar" and "quero que ganhe"
- After results: show per-category who got it right/wrong
