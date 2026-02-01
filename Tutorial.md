Prisma + MERN Mini Project: User Management API
A compact, production-style walkthrough for building a User Management API with Express and Prisma, then connecting a React frontend. This guide targets intermediate developers who want a clean, end‑to‑end example.

What is Prisma?
Prisma is an ORM for Node.js and TypeScript that provides a type-safe database client and a streamlined workflow for schema definition and migrations.

Project Goals
Create user
List users
Delete user (optional extension)
Tech Stack
Backend: Node.js + Express
ORM: Prisma
Database: SQLite (local dev)
Frontend: React (Vite)
Auth: Not included
Project Structure
project-root/
├── backend/
│   ├── src/
│   │   └── index.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db
│   ├── package.json
│   └── .env
├── frontend/
│   ├── package.json
│   └── src/...
└── README.md
Backend Setup (Express + Prisma v6 + SQLite)
1) Initialize backend
mkdir backend && cd backend
npm init -y
npm install express cors dotenv
npm install prisma@6 @prisma/client@6
npx prisma init
This creates prisma/schema.prisma and .env.

2) Configure Prisma schema
backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
3) Configure environment
backend/.env

DATABASE_URL="file:./prisma/dev.db"
PORT=5000
4) Run migration
npx prisma migrate dev --name init
Creates the SQLite database, migrations, and Prisma Client.

To inspect the database:

npx prisma studio
5) Create the API
backend/src/index.js

import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post("/users", async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.json(user);
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});
Run the server:

node src/index.js
API Testing with Postman (before frontend)
Create a user
Method: POST
URL: http://localhost:5000/users
Body (JSON):
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
List users
Method: GET
URL: http://localhost:5000/users
If both requests succeed, the backend is working correctly.

Frontend Setup (Vite + React)
1) Create the frontend
mkdir frontend && cd frontend
npm create vite@latest . -- --template react
npm install
npm run dev
Vite starts at http://localhost:5173.

2) Install Axios
npm install axios
3) Configure environment variable (Vite)
Create frontend/.env:

VITE_API_URL=http://localhost:5000
4) Build components
frontend/src/components/UserForm.jsx

import { useState } from "react";
import axios from "axios";

export default function UserForm({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        name,
        email,
      });
      onUserAdded(res.data);
      setName("");
      setEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Add User</button>
    </form>
  );
}
frontend/src/components/UserList.jsx

import { useEffect, useState } from "react";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
frontend/src/App.jsx

import { useState } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="App">
      <h1>Prisma + React Demo</h1>
      <UserForm onUserAdded={() => setRefresh((r) => !r)} />
      <UserList key={refresh} />
    </div>
  );
}
CORS
Since your backend is on http://localhost:5000 and your frontend is on http://localhost:5173, CORS must be enabled:

import cors from "cors";
app.use(cors());
Notes: SQLite vs MongoDB with Prisma
SQLite (Prisma v6)
Best for local development and learning. Zero setup, full migrations, and fast iteration.

MongoDB
Requires more setup (Atlas cluster, IP whitelist, credentials). Prisma support is stable, but different migration semantics apply.

Next Steps
Add validation and error handling
Add DELETE endpoint and frontend delete button
Add pagination for large user lists