# Prisma + Express + React (Vite) Mini Project (Intermediate Tutorial)

This repo is a small but real full‑stack project you can use to learn Prisma in a practical way:

- **Backend:** Express + Prisma Client
- **Database:** SQLite (local file)
- **Frontend:** React (Vite) + Axios
- **What you can do:** create users, list users

If you already know basic Node/React, this guide focuses on the “why” and the details that usually trip people up: Prisma migrations, environment variables, Vite env conventions, and ESM vs CommonJS.

---

## 0) Prerequisites

- Node.js 18+ (20+ recommended)
- Basic familiarity with HTTP (GET/POST), JSON, and React state

---

## 1) Project tour (what’s already in the repo)

```
prisma-mern-mini/
	backend/
		src/index.js                 # Express API
		prisma/schema.prisma         # Prisma schema (User model)
		prisma/migrations/...        # Migration history
		prisma.config.ts             # Prisma config (generated)
		package.json                 # backend scripts/deps
		.env                         # ignored by git (you create this)
	frontend/
		src/App.jsx
		src/components/UserForm.jsx
		src/components/UserList.jsx
		package.json                 # frontend scripts/deps
		vite.config.js
		.env                         # ignored by git (you create this)
```

**Backend endpoints implemented (today):**

- `POST /users` — create user
- `GET /users` — list users

There is **no delete endpoint** yet in the current codebase.

---

## 2) Prisma: what it is (in one paragraph)

Prisma is an ORM that gives you a **type-safe API** (Prisma Client) to query your database using JavaScript/TypeScript. Instead of writing SQL by hand for common operations, you describe your data model in `schema.prisma`, generate a client, and use that client in your app.

In this repo Prisma is used with **SQLite**, which is perfect for learning because it’s “zero setup”: your database is just a local file.

---

## 3) Backend setup (Express + Prisma + SQLite)

### 3.1 Install backend dependencies

```bash
cd backend
npm install
```

### 3.2 Create `backend/.env`

Create a file named `backend/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=5000
```

**What this means:**

- `DATABASE_URL` points Prisma to a SQLite file.
- `PORT` is the HTTP port for Express.

### 3.3 Run migrations (create/update the database)

```bash
cd backend
npx prisma migrate dev --name init
```

This will:

- create the SQLite DB file (usually `backend/prisma/dev.db`)
- apply your migrations
- generate Prisma Client

Optional: open Prisma Studio (a UI to view/edit data):

```bash
cd backend
npx prisma studio
```

### 3.4 Read the schema (what’s in the database)

Your schema is already defined in `backend/prisma/schema.prisma` and includes:

- `User` with `id`, `name`, `email` (unique), and `createdAt`

If you change the schema, you typically run another migration:

```bash
npx prisma migrate dev --name add_something
```

---

## 4) Backend code walkthrough (how Prisma is used)

Open `backend/src/index.js`.

Key things to notice:

1) **Prisma Client is created once**:

```js
const prisma = new PrismaClient();
```

2) **Create user** uses `prisma.user.create(...)`:

```js
app.post("/users", async (req, res) => {
	const user = await prisma.user.create({ data: req.body });
	res.json(user);
});
```

3) **List users** uses `prisma.user.findMany()`:

```js
app.get("/users", async (req, res) => {
	const users = await prisma.user.findMany();
	res.json(users);
});
```

### 4.1 Important: validation + error handling (what you should add next)

Right now the backend accepts whatever JSON you send and does not catch errors.

For example, if you POST a duplicate email, SQLite/Prisma will throw a unique constraint error.
In a real API, you’d catch that and respond with a friendly status code/message.

You’ll learn more by adding:

- input validation (`name` and `email` required)
- try/catch for Prisma errors
- `res.status(400/409/500)` codes

---

## 5) Running the backend (ESM + dotenv gotchas)

This repo’s backend file uses ESM imports:

```js
import express from "express";
```

### 5.1 Make sure Node treats backend as ESM

To run ESM files with Node, you typically need one of:

- `"type": "module"` in `backend/package.json` (recommended)
- or rename the entry file to `.mjs`
- or rewrite imports to CommonJS (`require`)

### 5.2 Load `.env` values in the backend

Even though `dotenv` is installed, `backend/src/index.js` currently **does not load it**.
That means `PORT` in `backend/.env` won’t be picked up automatically.

Recommended improvement:

```js
import "dotenv/config";
```

Place that at the top of `backend/src/index.js`.

### 5.3 Start the backend

Backend `package.json` provides:

- `npm run dev` (runs nodemon)

So run:

```bash
cd backend
npm run dev
```

Server will be at `http://localhost:5000` by default.

---

## 6) Test the API (before touching React)

### 6.1 Create a user

```bash
curl -X POST http://localhost:5000/users \
	-H "Content-Type: application/json" \
	-d "{\"name\":\"Ada\",\"email\":\"ada@example.com\"}"
```

### 6.2 List users

```bash
curl http://localhost:5000/users
```

If those work, your DB + Prisma + API are wired correctly.

---

## 7) Frontend setup (React + Vite)

### 7.1 Install frontend dependencies

```bash
cd frontend
npm install
```

### 7.2 Start the frontend

```bash
cd frontend
npm run dev
```

Vite runs on `http://localhost:5173` by default.

---

## 8) Frontend code walkthrough (UserForm + UserList)

The UI is intentionally simple:

- `UserForm.jsx` submits a POST request
- `UserList.jsx` fetches and displays users
- `App.jsx` toggles a `refresh` state to re-mount `UserList`

### 8.1 Important: environment variables in Vite

In this repo, the components currently call:

```js
process.env.API_URL
```

That pattern is typical in some setups, but **Vite browser code uses**:

```js
import.meta.env.VITE_API_URL
```

Recommended approach:

1) Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

2) Update your axios calls to:

```js
const apiBaseUrl = import.meta.env.VITE_API_URL;
await axios.get(`${apiBaseUrl}/users`);
```

This makes your frontend portable (dev/staging/prod) without editing source code.

---

## 9) CORS (why it matters here)

Your frontend and backend are on different origins during development:

- frontend: `http://localhost:5173`
- backend: `http://localhost:5000`

The backend enables CORS via:

```js
app.use(cors());
```

That’s why the browser is allowed to call your API.

---

## 10) What to build next (good intermediate exercises)

If you want to level this project up without adding a ton of files, here are high-value improvements:

1) **Add delete user** endpoint (and a delete button in the UI)
2) Add **basic validation** and return proper status codes
3) Add a **unique email** error message (409) when Prisma rejects duplicates
4) Add an **API base URL helper** on the frontend (one place to configure axios)
5) Add a simple **loading + error state** for fetching users

---

## 11) Quick command reference

Backend:

- Install: `cd backend && npm install`
- Migrate: `cd backend && npx prisma migrate dev --name init`
- Run: `cd backend && npm run dev`
- Studio: `cd backend && npx prisma studio`

Frontend:

- Install: `cd frontend && npm install`
- Run: `cd frontend && npm run dev`

