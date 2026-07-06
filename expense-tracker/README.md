# 💰 Expense Tracker — MERN Stack

A full-featured personal finance tracker built with **MongoDB, Express, React, and Node.js**.

## Features

- **Authentication** — JWT-based register/login/logout
- **Transactions** — Add, edit, delete income & expenses
- **Categories** — 16 categories (food, transport, salary, freelance, etc.)
- **Filtering** — Filter by type, category, and date range with pagination
- **Analytics** — Monthly income vs expense bar chart, category doughnut chart
- **Stats API** — Aggregated summaries via MongoDB aggregation pipeline
- **Responsive** — Works on desktop and mobile

---

## Project Structure

```
expense-tracker/
├── package.json            ← Root scripts (concurrently)
├── server/
│   ├── index.js            ← Express app entry
│   ├── .env.example        ← Copy to .env and fill in values
│   ├── models/
│   │   ├── User.js         ← Mongoose user schema (bcrypt, JWT)
│   │   └── Transaction.js  ← Mongoose transaction schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   └── stats.js
│   └── middleware/
│       └── auth.js         ← JWT protect middleware
└── client/
    ├── package.json
    └── src/
        ├── App.js           ← Routing (react-router-dom v6)
        ├── context/
        │   ├── AuthContext.js
        │   └── TransactionContext.js
        ├── pages/
        │   ├── LoginPage.js / RegisterPage.js
        │   ├── DashboardPage.js
        │   ├── TransactionsPage.js
        │   ├── StatsPage.js
        │   └── ProfilePage.js
        ├── components/
        │   ├── Layout.js
        │   └── TransactionForm.js
        └── utils/
            ├── api.js        ← Axios instance with JWT interceptor
            └── categories.js ← Category constants
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a MongoDB Atlas URI

---

## Setup & Run

### 1. Clone and install dependencies

```bash
git clone <your-repo>
cd expense-tracker

# Install root, server, and client dependencies in one go
npm run install-all
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Run in development (both server + client)

```bash
# From project root
npm run dev
```

This starts:
- **Express API** on `http://localhost:5000`
- **React app** on `http://localhost:3000` (proxied to API)

### 4. Build for production

```bash
cd client
npm run build
```

Then serve the `build/` folder with Express or a static host.

---

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user (auth) |
| PUT | `/api/auth/me` | Update profile (auth) |

### Transactions (all require `Authorization: Bearer <token>`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/transactions` | List with filters & pagination |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions/:id` | Get single transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

Query params for GET: `type`, `category`, `startDate`, `endDate`, `page`, `limit`, `sort`

### Stats
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/stats/summary` | Total income, expense, balance |
| GET | `/api/stats/categories` | Breakdown by category |
| GET | `/api/stats/monthly` | Monthly trend (last N months) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | MongoDB + Mongoose |
| Backend | Node.js + Express |
| Auth | JWT + bcryptjs |
| Frontend | React 18 + React Router v6 |
| HTTP Client | Axios |
| Charts | Chart.js + react-chartjs-2 |
| Notifications | react-hot-toast |
| Dev Tools | nodemon + concurrently |
