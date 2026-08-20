# Pyramid — API Reference

REST API served by the NestJS backend in [`backend/`](backend/).

- **Base URL (local):** `http://localhost:4000` (`PORT` in `backend/.env`)
- **Frontend config:** `NEXT_PUBLIC_API_URL` in `my-app/.env`
- **Content type:** `application/json` everywhere
- **Auth:** JWT bearer token on every route except `/health` and the login routes

## Contents

- [Authentication](#authentication)
- [Conventions](#conventions)
- [Errors](#errors)
- [Auth & profile](#auth--profile)
- [Projects](#projects)
- [Tasks](#tasks)
- [Subtasks](#subtasks)
- [Comments](#comments)
- [Models](#models)
- [Environment reference](#environment-reference)

---

## Authentication

Stateless JWT bearer tokens — no sessions, no refresh tokens, no auth cookies.

1. Get a token from [`POST /auth/guest`](#post-authguest) or the
   [Google OAuth flow](#get-authgoogle).
2. Send it on every protected request:

   ```http
   Authorization: Bearer <token>
   ```

Token payload (HS256, signed with `JWT_SECRET`):

```json
{ "sub": "<user id>", "provider": "guest", "iat": 1787075986, "exp": 1787680786 }
```

Lifetime is `JWT_EXPIRES_IN` (default `7d`). Expired or unknown-user tokens are
rejected; there is no refresh endpoint, so the client logs in again.

## Conventions

| Aspect | Behaviour |
| ------ | --------- |
| Ownership | Every project and task belongs to the user who created it. Reads and writes are scoped by owner, so another user's id returns **404**, never someone else's data. |
| IDs | MongoDB ObjectId as a 24-char hex string, exposed as `id` (never `_id`). |
| Dates | Accepted as ISO 8601 strings, returned as ISO 8601 strings (`2026-09-12T00:00:00.000Z`). |
| Partial updates | Updates are `PATCH`; send only the fields that changed. Fields you omit keep their stored value. |
| Validation | Global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, `transform`. **Unknown body properties are a 400**, not silently dropped. |
| CORS | One allowed origin: `FRONTEND_URL` (default `http://localhost:3000`). |
| Rate limiting | None. |

**Enumerations** — shared by tasks, subtasks and projects
([`common/task-fields.ts`](backend/src/common/task-fields.ts)):

- `priority`: `none` · `urgent` · `high` · `medium` · `low`
- `status` (board column): `todo` · `doing` · `completed`

## Errors

Standard NestJS shape:

```json
{ "statusCode": 404, "message": "Task not found", "error": "Not Found" }
```

Validation failures return `message` as an **array**:

```json
{
  "statusCode": 400,
  "message": ["priority must be one of the following values: none, urgent, high, medium, low"],
  "error": "Bad Request"
}
```

| Status | When |
| ------ | ---- |
| `400` | Body failed validation, or carried a property not on the DTO. |
| `401` | Missing, malformed, expired or wrongly-signed token. |
| `404` | Unknown route, or a project/task/subtask/comment the caller doesn't own. Also `/auth/google*` when Google OAuth isn't configured. |
| `500` | Unhandled failure (e.g. MongoDB unreachable). |

---

## Auth & profile

### `GET /health`

Liveness probe, no auth. Reports the process only — it does not check MongoDB.

```json
{ "status": "ok", "timestamp": "2026-08-18T17:43:06.178Z" }
```

### `POST /auth/guest`

Creates a **new** anonymous user and returns a session. No body.

> Each call creates a new account — it is not "log in as the guest". Clients
> call it once and persist the token.

Generated users get a name like `Guest 4821` and a random `avatarColor` from a
fixed six-colour palette.

**`200`** (not 201, despite the POST) — `{ token, user }`, see [`PublicUser`](#publicuser).

### `GET /auth/google`

Starts Google OAuth (scopes `email`, `profile`). A **browser redirect**
endpoint — point the browser at it, don't fetch it. Only registered when
`GOOGLE_CLIENT_ID` is set; otherwise it 404s and guest login still works.

### `GET /auth/google/callback`

Google's redirect target. Finds or creates the user by `googleId` (refreshing
their profile photo), then redirects to
`{FRONTEND_URL}/auth/callback?token=<jwt>`.

> The token travels in a query parameter, so it can land in history and access
> logs. Acceptable for this build; production should use a one-time code or an
> httpOnly cookie.

### `GET /auth/me` 🔒

Returns the authenticated [`PublicUser`](#publicuser).

### `PATCH /auth/me` 🔒

Updates the editable profile fields.

| Field | Type | Constraints |
| ----- | ---- | ----------- |
| `name` | string | max 60 |
| `title` | string | max 60 |
| `username` | string | max 30 |

Anything else (`email`, `provider`, `avatarUrl`, …) is rejected with 400 — those
are server-owned. `username` is not checked for uniqueness.

---

## Projects

All routes require a bearer token and only ever touch the caller's own projects.

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `GET` | `/projects` | List the caller's projects, oldest first |
| `GET` | `/projects/:id` | One project |
| `POST` | `/projects` | Create → `201` |
| `PATCH` | `/projects/:id` | Update the fields sent |
| `DELETE` | `/projects/:id` | Delete → `204`, empty body |

**Body** (`POST` requires `name`; every field is optional on `PATCH`)

| Field | Type | Constraints |
| ----- | ---- | ----------- |
| `name` | string | 1–120 chars |
| `priority` | enum | one of the priority values, defaults to `none` |
| `dueDate` | ISO date string | — |
| `lead` | string | max 60 |

```bash
curl -X POST http://localhost:4000/projects -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"name\":\"Design Homepage\",\"priority\":\"high\",\"dueDate\":\"2026-09-12\",\"lead\":\"Admin\"}"
```

```json
{
  "id": "6a849d933459185dde128dfc",
  "name": "Design Homepage",
  "priority": "high",
  "dueDate": "2026-09-12T00:00:00.000Z",
  "lead": "Admin"
}
```

---

## Tasks

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `GET` | `/tasks` | List the caller's tasks. `?projectId=<id>` narrows to one project |
| `GET` | `/tasks/:id` | One task, with its subtasks and comments |
| `POST` | `/tasks` | Create → `201` |
| `PATCH` | `/tasks/:id` | Update the fields sent — this is also how a task moves board column (`status`) |
| `DELETE` | `/tasks/:id` | Delete → `204`, empty body |

**Body** (`POST` requires `title`; every field is optional on `PATCH`)

| Field | Type | Constraints |
| ----- | ---- | ----------- |
| `title` | string | 1–200 chars |
| `description` | string | max 2000 |
| `status` | enum | board column, defaults to `todo` |
| `priority` | enum | defaults to `none` |
| `assignee` | string | max 60 |
| `dueDate` | ISO date string | — |
| `labels` | string[] | max 20 items, each max 40 chars |
| `projectId` | ObjectId string | optional — tasks can stand alone |

A task response always includes its `subtasks` and `comments` arrays; see
[`PublicTask`](#publictask).

---

## Subtasks

Subtasks live **inside** their task, so they're addressed through it and every
response is the **updated task** (not the subtask alone).

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `POST` | `/tasks/:id/subtasks` | Add one → `201` |
| `PATCH` | `/tasks/:id/subtasks/:subtaskId` | Update title / priority / dueDate / done |
| `DELETE` | `/tasks/:id/subtasks/:subtaskId` | Remove it |

| Field | Type | Constraints |
| ----- | ---- | ----------- |
| `title` | string | 1–200 chars (required on create) |
| `priority` | enum | defaults to `none` |
| `dueDate` | ISO date string | — |
| `done` | boolean | `PATCH` only, defaults to `false` |

---

## Comments

Same arrangement as subtasks — nested under the task, responses return the task.

| Method | Path | Purpose |
| ------ | ---- | ------- |
| `POST` | `/tasks/:id/comments` | Add one → `201`. Body: `{ "body": "…" }`, 1–2000 chars |
| `DELETE` | `/tasks/:id/comments/:commentId` | Remove it |

The author's name and avatar are **copied onto the comment** when it's written,
so reading a task never needs a second lookup. A later profile rename doesn't
rewrite old comments.

---

## Models

### `PublicUser`

Internal fields (`_id`, `googleId`, timestamps, `__v`) are stripped.

| Field | Type | Always | Notes |
| ----- | ---- | ------ | ----- |
| `id` | string | yes | |
| `name` | string | yes | `Guest NNNN`, or the Google display name |
| `email` | string | no | Google accounts only |
| `avatarColor` | string | yes | one of `#F59E0B`, `#3B82F6`, `#EC4899`, `#F43F5E`, `#10B981`, `#8B5CF6` |
| `avatarUrl` | string | no | Google photo; guests have none — render the coloured initial |
| `title` | string | no | user-editable |
| `username` | string | no | user-editable, not unique |
| `provider` | `"guest"` \| `"google"` | yes | cannot change |

### `PublicTask`

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id`, `title` | string | |
| `description` | string? | |
| `status` | enum | board column |
| `priority` | enum | |
| `assignee` | string? | |
| `dueDate` | string? | ISO |
| `labels` | string[] | |
| `projectId` | string? | absent for standalone tasks |
| `subtasks` | [`PublicSubtask`](#publicsubtask)[] | |
| `comments` | [`PublicComment`](#publiccomment)[] | |
| `createdAt` | string | ISO |

### `PublicSubtask`

`id`, `title`, `priority`, `dueDate?`, `done`.

### `PublicComment`

`id`, `body`, `createdAt`, and `author: { id, name, avatarColor?, avatarUrl? }`.

---

## Not part of the API

- **Theme, accent colour and layout preferences** are persisted to
  `localStorage` by the frontend, not to the server.
- **No logout endpoint** — the client discards the token; the JWT stays valid
  until it expires.
- **No account deletion or linking** — a guest account can't be upgraded to a
  Google one.
- **No team/member management** — a project's `lead` and a task's `assignee` are
  free text, matching how far the design goes.

## Environment reference

Backend variables (`backend/.env`, see `.env.example`):

| Variable | Default | Effect |
| -------- | ------- | ------ |
| `PORT` | `4000` | Listening port |
| `MONGODB_URI` | — | **Required**; the app won't boot without it |
| `JWT_SECRET` | — | **Required**; rotating it invalidates every issued token |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `FRONTEND_URL` | `http://localhost:3000` | Sole CORS origin and OAuth redirect target |
| `GOOGLE_CLIENT_ID` | — | If unset, `/auth/google*` isn't registered |
| `GOOGLE_CLIENT_SECRET` | — | Required alongside the client ID |
| `GOOGLE_CALLBACK_URL` | `http://localhost:4000/auth/google/callback` | Must match the URI registered in Google Cloud Console |
