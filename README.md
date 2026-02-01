# Prisma + Express + React (Vite) — Mini User Manager

Small full‑stack demo:

- Backend: Express + Prisma + SQLite
- Frontend: React (Vite) + Axios
- Features: create user, list users

## Project structure

```
prisma-mern-mini/
  backend/
    src/index.js
    prisma/schema.prisma
    prisma/migrations/
    prisma.config.ts
    package.json
    .env
  frontend/
    src/App.jsx
    src/components/UserForm.jsx
    src/components/UserList.jsx
    vite.config.js
    package.json
    .env
```

## API

Backend exposes:

- `POST /users`  (body: `{ "name": string, "email": string }`)
- `GET /users`

Default backend port is `5000` (or `PORT` if set in the environment).

## Setup

### 1) Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 2) Configure Prisma + SQLite

Create `backend/.env` (values shown are examples):

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=5000
```

Run migrations:

```bash
cd backend
npx prisma migrate dev --name init
```

Optional:

```bash
npx prisma studio
```

### 3) Run the backend

This repo’s backend code uses ESM `import ... from ...` syntax in `backend/src/index.js`.

To run it, Node must treat the backend as ESM. Pick one option:

- Recommended: add `"type": "module"` to `backend/package.json`, then run:

```bash
cd backend
npm run dev
```

- Alternative: rename `backend/src/index.js` to `index.mjs`
- Alternative: convert imports to CommonJS (`require`)

Also note: `backend/src/index.js` currently does not load `dotenv`, so `PORT` in `backend/.env` won’t be read unless you add `import "dotenv/config";` (or set `PORT` in your shell).

### 4) Run the frontend

```bash
cd frontend
npm run dev
```

Vite serves on `http://localhost:5173` by default.

## Frontend API base URL (important)

Current frontend code calls:

- `process.env.API_URL` in `frontend/src/components/UserForm.jsx` and `frontend/src/components/UserList.jsx`

In Vite, browser code should use `import.meta.env.VITE_...` instead of `process.env...`.

Recommended fix:

1) Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

2) Update the frontend code to use `import.meta.env.VITE_API_URL`.

## Scripts (what actually exists)

Backend (`backend/package.json`):

- `npm run dev` (nodemon)

Frontend (`frontend/package.json`):

- `npm run dev` (Vite)
- `npm run build`
- `npm run preview`

