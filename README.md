# MERN Auth App

A full-stack authentication app built with the MERN stack. Uses JWT tokens stored in HTTP-only cookies for auth.

## Screenshots

**Register**
![Register](screenshots/register.png)

**Login**
![Login](screenshots/login.png)

**Dashboard**
![Dashboard](screenshots/dashboard.png)

**Profile**
![Profile](screenshots/profile.png)

## Features

- Register, login, logout
- JWT stored in HTTP-only cookie
- Protected routes (redirect to /login if not authenticated)
- Edit your name, email, bio and password from the profile page

## Tech used

- React, React Router, Context API
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs, JWT, react-toastify

## How to run

You'll need Node.js and MongoDB installed.

```bash
npm run install-all

cd backend
cp .env.example .env
```

Edit `.env`:
```
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/mernauth
JWT_SECRET=your_secret_here
```

```bash
npm run dev
```

Frontend → http://localhost:3000  
Backend → http://localhost:5001

