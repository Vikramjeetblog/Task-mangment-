# Pyramid — Task Management System

A task management dashboard built for the assessment brief, matched against the
provided [Figma design](https://www.figma.com/design/obONCFmoTFN27V5H9PHS2X/Assessment-Task).

## Tech stack

| Layer     | Choice                                   |
| --------- | ----------------------------------------- |
| Frontend  | Next.js 16 (App Router), React 19, TypeScript |
| Styling   | Tailwind CSS 4                            |
| Frontend state | Zustand (persisted stores for auth + theme), TanStack Query |
| Backend   | NestJS, TypeScript                        |
| Database  | MongoDB (Mongoose)                        |
| Auth      | Guest login + Google OAuth 2.0, JWT bearer tokens |

## Repo structure

```
my-app/      Next.js frontend
backend/     NestJS backend (REST API)
```

## Local setup

### Prerequisites
- Node.js 20+
- A MongoDB connection string (local `mongod` or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster)
- (Optional, for Google login) a Google OAuth 2.0 Client ID/Secret from the
  [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI at minimum
npm run start:dev      # http://localhost:4000
```

### Frontend
```bash
cd my-app
npm install
cp .env.example .env   # defaults to http://localhost:4000
npm run dev            # http://localhost:3000
```

Guest login works with just `MONGODB_URI` set. Google login additionally
needs `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL`
in `backend/.env` — until those are set, the Google strategy isn't
registered and `/auth/google` isn't available, but guest login and the rest
of the app work normally.

## Architecture notes

- **Auth tokens**: the backend issues a JWT on guest/Google login. The
  frontend stores it in a persisted Zustand store (localStorage) and attaches
  it as a `Bearer` token via an axios interceptor, rather than an httpOnly
  cookie. This avoids cross-site cookie configuration between the separately
  deployed frontend (Vercel) and backend (Render/Railway) origins.
- **Theme**: a single persisted Zustand store (`useThemeStore`) is the source
  of truth for light/dark mode and accent color, applied via `data-theme` /
  `data-accent` attributes on `<html>`. A blocking inline script in the root
  layout applies the persisted value before first paint to avoid a flash of
  the wrong theme.

## Known deviations from the Figma design

_Updated as more screens are implemented — see individual PRs/commits for
per-screen notes._

- The dark-mode color palette in `globals.css` is a reasonable placeholder;
  it will be tuned to match the design once the theme/color Figma screens are
  reviewed against the live implementation.
- The login screen's presence avatars are plain colored circles (no avatar
  photo assets were provided).

## Deployment

_Frontend: Vercel. Backend: Render/Railway. Database: MongoDB Atlas._
Live URLs will be added here once deployed.

## Part 2 — Product understanding

See `PART2.md` (added separately) for the AbleSpace "Take Data" workflow
write-up and suggested improvements.
