# 🚀 Quick Startup Guide

## The Problem You Were Having
- **Frontend** was running on port 3000
- **Backend** was also trying to run on port 3000
- **Port conflict** caused the backend to fail
- Frontend couldn't connect to backend API

## ✅ Solution: Fixed Port Configuration

### Backend Port: 5000
### Frontend Port: 3000
### API Proxy: Automatically configured

## 🎯 How to Run (Choose One Method)

### Method 1: One-Command Setup (Recommended)
```bash
npm run dev
```
This will:
1. Build the React app
2. Start backend on port 5000
3. Start frontend on port 3000
4. Handle all the setup automatically

### Method 2: Manual Setup
```bash
# Terminal 1: Start Backend
npm start
# Backend runs on http://localhost:5000

# Terminal 2: Start Frontend
cd client
npm start
# Frontend runs on http://localhost:3000
```

## 🌐 Access Your App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔧 What Changed

1. **Backend port**: 3000 → 5000
2. **Added proxy**: Frontend automatically forwards `/api/*` to backend
3. **Updated scripts**: `npm run dev` now handles everything
4. **Better logging**: Clear port information in console

## 🚨 Troubleshooting

### If you still see "Backend Disconnected":
1. Make sure backend is running on port 5000
2. Check that frontend is running on port 3000
3. Verify no other services are using these ports
4. Try `npm run dev` for automatic setup

### Port Already in Use:
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :5000
lsof -i :3000
```

## 🎉 You're All Set!
The frontend will now automatically connect to the backend, and you should see "Backend Connected" in the UI!
