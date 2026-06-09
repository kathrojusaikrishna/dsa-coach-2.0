# DSA Coach 2.0

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## Overview

DSA Coach 2.0 is a full-stack MERN application that helps developers improve their Data Structures and Algorithms (DSA) preparation through personalized recommendations, memory-retention tracking, revision scheduling, and LeetCode analytics.

The platform analyzes a user's LeetCode progress, identifies weak topics, recommends relevant problems, tracks solved questions, and estimates interview readiness.

---

## Features

### Authentication

- User Registration & Login
- JWT-based Authentication
- Protected Routes

### LeetCode Integration

- Connect LeetCode Profile
- Fetch and Store User Statistics
- Sync Progress Anytime

### Personalized Recommendations

- Difficulty-Based Recommendations
- Weak Topic Detection
- Recommendation History
- Mark Problems as Solved or Skipped

### Revision System

- Forgotten Problem Detection
- Revision Queue
- Retention Classification

### Analytics Dashboard

- Interview Readiness Score
- Memory Strength Score
- Weak Topics Analysis
- Memory Retention Visualization
- Progress Tracking

---

## Highlights

- 500+ LeetCode Problems Dataset
- Personalized Recommendation Engine
- Weak Topic Detection
- Memory Retention Analytics
- Interview Readiness Scoring
- Full MERN Stack Architecture

## Tech Stack

### Frontend

- React.js
- React Router
- Axios
- Recharts
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## Architecture

User
→ React Frontend
→ Express Backend
→ MongoDB Atlas

LeetCode Profile
→ Analytics Engine
→ Recommendation System
→ Revision Queue

---

## Screenshots

### Dashboard

![Dashboard](screenshots/dashboard-top.png)
![Dashboard](screenshots/dashboard-bottom.png)

### Recommendations

![Recommendations](screenshots/Recommendations.png)

### Revision Queue

![Revision](screenshots/revision.png)

### Profile

![Profile](screenshots/Profile.png)

---

## Installation

### Clone Repository

```bash
git clone https://github.com/kathrojusaikrishna/dsa-coach-2.0.git
cd dsa-coach-2.0
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Backend `.env`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Frontend `.env`

```env
VITE_API_URL=your_backend_url
```

---

## Future Enhancements

- Codeforces Integration
- GeeksForGeeks Integration
- Contest Tracking
- Spaced-Repetition Revision System
- AI-Powered Problem Recommendations

---

## Author

**Saikrishna Kathroju**

GitHub: https://github.com/kathrojusaikrishna

LinkedIn: https://www.linkedin.com/in/kathroju-saikrishna/
