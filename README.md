# 📊 Polling App

A modern, real-time **MERN stack polling platform** developed by **Rahul Prakash**. Polling App allows users to create diverse poll formats (Single-choice, Image-based, Open-ended, Yes/No, Rating), participate in interactive voting, bookmark favorite polls, track voting history, and visualize live analytics.

---

## 👨‍💻 Author & Attribution

- **Creator & Developer**: **Rahul Prakash**
- **Project**: Polling App (Full Stack MERN Application)
- **License**: MIT

---

## 📌 Problem Statement

- Traditional static polling tools lack diverse question formats and user engagement layers (such as history tracking, bookmarking, and instant feedback).
- Limited accessibility for casual users needing quick image-based comparisons or open-ended public discussions.
- Polling App solves these challenges by combining multiple interactive poll formats, user profile analytics, and seamless state management powered by **Redux Toolkit**.

---

## 🎯 Goals & Objectives

| Goal | Objective |
|---|---|
| **Real-Time Engagement** | Instant vote updates and dynamic percentage calculations for all users. |
| **Poll Diversity** | Comprehensive support for 4+ specialized poll types with custom options. |
| **User Personalization** | Dedicated sections for **My Polls**, **Voted Polls**, and **Bookmarks**. |
| **Accessibility** | Modern responsive dashboard with category filters and unified navigation. |

---

## 🚀 Key Features

### 1. 🗳️ 4+ Specialized Poll Types
- **Single-Choice Polls**: Classic multiple-choice questions with 2 to 4 custom options.
- **Image-Based Polls**: Visual voting with direct image uploads powered by Cloudinary.
- **Open-Ended Polls**: Public discussion prompt accepting rich text feedback and real-time response streams.
- **Yes / No Polls**: Rapid binary decision polls with automated option generation.
- **Rating Polls**: 5-star interactive rating breakdowns with aggregated metrics.

### 2. 📱 Dashboard & User Profile
- **Explore Feed**: Infinite-scroll feed of all public community polls.
- **Filter Bar**: Instant filtering by poll format (Single Choice, Yes/No, Image Based, Open Ended, Rating).
- **My Polls**: Manage created polls, close active polls, or delete completed polls.
- **Voted Polls**: Dedicated history tracking of all polls in which the user has participated.
- **Bookmarks**: Save interesting polls to your personal bookmarks for future review.
- **User Stats Card**: Real-time counters showing total polls created, voted, and saved.

### 3. 🔐 Secure Authentication & Storage
- JWT (JSON Web Token) authentication with secure password hashing via `bcryptjs`.
- Protected backend API routes with middleware validation.
- Cloudinary cloud storage integration for profile pictures and poll images.
- Complete state management using **Redux Toolkit (`@reduxjs/toolkit`)**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Redux Toolkit (`@reduxjs/toolkit`, `react-redux`), React Router v7, Tailwind CSS, React Icons, React Hot Toast, Axios |
| **Backend** | Node.js, Express.js 5, Mongoose 8 |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (jsonwebtoken) & bcryptjs |
| **Media Storage** | Cloudinary & Multer |
| **Deployment** | Vercel (Frontend & Backend Serverless) / Render |

---

## 📂 Database Schema Overview

### User Schema
```javascript
{
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImageUrl: { type: String, default: "" },
  bookmarkedPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }]
}
```

### Poll Schema
```javascript
{
  question: { type: String, required: true },
  type: {
    type: String,
    enum: ['single-choice', 'image-based', 'open-ended', 'yes/no', 'rating'],
    required: true
  },
  options: [{
    optionText: String,
    votes: { type: Number, default: 0 }
  }],
  response: [{
    voterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    responseText: String,
    createdAt: { type: Date, default: Date.now }
  }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  closed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 📡 API Endpoints

### 🔑 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | No |
| `POST` | `/api/v1/auth/login` | Login user & receive JWT token | No |
| `GET` | `/api/v1/auth/getUser` | Get current logged-in user profile & stats | Yes |

### 🗳️ Polls (`/api/v1/poll`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/poll/create` | Create a new poll (all 4+ types) | Yes |
| `GET` | `/api/v1/poll/getAllPolls` | Fetch public polls with pagination & filtering | Yes |
| `GET` | `/api/v1/poll/votedPolls` | Fetch polls voted by current user | Yes |
| `GET` | `/api/v1/poll/user/bookmarked` | Fetch bookmarked polls | Yes |
| `GET` | `/api/v1/poll/:id` | Fetch specific poll details | Yes |
| `POST` | `/api/v1/poll/:id/vote` | Submit a vote or open-ended response | Yes |
| `POST` | `/api/v1/poll/:id/bookmark` | Toggle bookmark status for a poll | Yes |
| `POST` | `/api/v1/poll/:id/close` | Mark poll as closed (creator only) | Yes |
| `DELETE` | `/api/v1/poll/:id/delete` | Delete a poll (creator only) | Yes |

### 🖼️ Media (`/api/upload`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/upload` | Upload image to Cloudinary & return secure URL | No |

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Database (Local or MongoDB Atlas connection string)
- Cloudinary Account (for image uploads)

### 2. Clone the Repository
```bash
git clone <your-repository-url>
cd Polling-App-main
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (refer to `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder (refer to `frontend/.env.example`):
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
# App will run on http://localhost:5173
```

---

## 🚀 Vercel Deployment Guide

### Deploying Frontend to Vercel
1. Import the repository into your Vercel Dashboard.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Configure Environment Variable:
   - `VITE_API_URL`: `https://your-backend-api-url.vercel.app` (or your Render URL)
5. Deploy! Client-side routing is handled automatically via `frontend/vercel.json`.

### Deploying Backend to Vercel
1. In Vercel, import the repository and set **Root Directory** to `backend`.
2. Configure Environment Variables in Vercel Project Settings:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your frontend Vercel domain)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Deploy! `backend/vercel.json` and `backend/server.js` export the Express serverless handler.

---

## 🔒 Security Best Practices
- All `.env` environment files and secret keys are protected by `.gitignore`.
- No sensitive credentials or secrets are committed to version control.
- Passwords are salted and hashed using bcrypt before database persistence.
- CORS policies ensure authorized access between frontend and backend origins.

---

## 📄 License
This project is licensed under the MIT License — created with ❤️ by **Rahul Prakash**.
