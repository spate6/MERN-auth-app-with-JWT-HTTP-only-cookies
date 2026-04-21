# MERN Authentication App

Full-stack authentication app built with **MongoDB, Express, React, Node.js** and **JWT via HTTP-only cookies**.

## Features

- Register / Login / Logout
- JWT stored in HTTP-only cookie (not accessible via JavaScript)
- Protected routes — unauthenticated users redirected to `/login`
- View & update profile (name, email, bio, password)
- Global auth state via React Context
- Toast notifications
- Responsive dark UI

## Project Structure

```
mern-auth/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route logic
│   ├── middleware/     # auth + error handlers
│   ├── models/         # Mongoose User model
│   ├── routes/         # Express routes
│   ├── utils/          # JWT cookie helper
│   ├── server.js
│   └── .env.example
├── frontend/
│   └── src/
│       ├── context/    # AuthContext (global user state)
│       ├── hooks/      # useApi fetch wrapper
│       ├── components/ # Navbar, PrivateRoute
│       ├── pages/      # Login, Register, Dashboard, Profile
│       ├── App.jsx
│       └── index.css
└── package.json        # root scripts with concurrently
```

## API Endpoints

| Method | Route                  | Access  | Description          |
|--------|------------------------|---------|----------------------|
| POST   | /api/users/register    | Public  | Register new user    |
| POST   | /api/users/login       | Public  | Login + set cookie   |
| POST   | /api/users/logout      | Public  | Clear cookie         |
| GET    | /api/users/profile     | Private | Get user profile     |
| PUT    | /api/users/profile     | Private | Update user profile  |

## Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) **or** a [MongoDB Atlas](https://cloud.mongodb.com) URI

### 1. Clone / unzip the project

### 2. Install all dependencies
```bash
npm run install-all
```

### 3. Configure environment
```bash
cd backend
cp .env.example .env
```
Edit `.env`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/mernauth
JWT_SECRET=change_this_to_a_long_random_string
```

### 4. Run both servers (from root)
```bash
npm run dev
```
- Backend → http://localhost:5000
- Frontend → http://localhost:3000

The frontend `proxy` in `package.json` forwards `/api/*` calls to the backend automatically.

## Security Notes

- Passwords are hashed with **bcryptjs** (salt rounds: 10)
- JWT is set as an **HTTP-only, SameSite=Strict** cookie
- In production, set `NODE_ENV=production` so the cookie is also `Secure` (HTTPS only)
- Change `JWT_SECRET` to a long random string before deploying
