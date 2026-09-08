# 🚀 How to Start the Servers

## ✅ asyncHandler Error - FIXED!

The asyncHandler utility has been fixed and verified. All syntax errors are resolved.

---

## 📝 How to Run the Backend Server

### Option 1: Production Mode (Recommended for deployment)
```bash
cd "/Users/nabiullahhayat/Desktop/Systems/Journalism Faculty Website/back"
npm start
```

### Option 2: Development Mode (Recommended for development)
```bash
cd "/Users/nabiullahhayat/Desktop/Systems/Journalism Faculty Website/back"
npm run dev
```

**The difference:**
- `npm start` → Runs with `node server.js` (no auto-reload)
- `npm run dev` → Runs with `nodemon server.js` (auto-reload on file changes)

**✅ Backend runs on:** `http://localhost:3000`

---

## 📝 How to Run the Frontend Server

```bash
cd "/Users/nabiullahhayat/Desktop/Systems/Journalism Faculty Website/user"
npm run dev
```

**✅ Frontend runs on:** `http://localhost:5173`

---

## 🔄 Complete Startup Process

### Step 1: Start MongoDB (if not running)
```bash
# Check if MongoDB is running
brew services list

# If not running, start it:
brew services start mongodb-community

# Or start manually:
mongod --config /opt/homebrew/etc/mongod.conf
```

### Step 2: Seed the Database (First time only)
```bash
cd "/Users/nabiullahhayat/Desktop/Systems/Journalism Faculty Website/back"
npm run seed
```

This will create:
- 7 Academic Ranks
- 1 SuperAdmin account
- 2 Sample Departments

**Default SuperAdmin Credentials:**
```
Username: superadmin
Email: admin@journalism-faculty.edu
Password: Admin@123456
```

### Step 3: Start Backend Server
```bash
cd "/Users/nabiullahhayat/Desktop/Systems/Journalism Faculty Website/back"
npm run dev
```

**You should see:**
```
✓ Connected to MongoDB: journalism_faculty
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚡ Server started successfully!
  
  🌐 Environment: development
  🚀 Server: http://localhost:3000
  📡 API: http://localhost:3000/api/v1
  📚 Health: http://localhost:3000/api/v1/health
  
  📅 Started at: [timestamp]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 4: Start Frontend Server (New Terminal)
```bash
cd "/Users/nabiullahhayat/Desktop/Systems/Journalism Faculty Website/user"
npm run dev
```

**You should see:**
```
VITE v7.2.5  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🎯 Quick Commands Reference

### Backend Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm start` | Production mode | Deployment, testing final build |
| `npm run dev` | Development mode | **Development (RECOMMENDED)** |
| `npm run seed` | Seed database | First time setup, reset data |
| `npm run seed:clear` | Clear database | Clean slate, remove all data |

### Frontend Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🔍 Verify Everything is Working

### 1. Test Backend API
Open browser or use curl:
```bash
# Health Check
curl http://localhost:3000/api/v1/health

# Should return:
# {"status":"success","message":"Server is running!","data":{...}}
```

### 2. Test Frontend
Open browser:
```
http://localhost:5173
```

You should see the homepage with:
- Hero section
- Statistics
- Featured news
- Faculty members

### 3. Test Admin Login
1. Go to: `http://localhost:5173/admin/login`
2. Enter credentials:
   - Username: `superadmin`
   - Password: `Admin@123456`
3. You should be redirected to the admin dashboard

---

## ❌ Troubleshooting

### Problem: "Cannot connect to MongoDB"
**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community
```

### Problem: "Port 3000 already in use"
**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or change port in .env file:
PORT=3001
```

### Problem: "Port 5173 already in use"
**Solution:**
```bash
# Kill process on port 5173
kill -9 $(lsof -ti:5173)
```

### Problem: "Module not found"
**Solution:**
```bash
# Reinstall dependencies
cd back
npm install

cd ../user
npm install
```

### Problem: "Login doesn't work"
**Solution:**
```bash
# Make sure backend is running
# Make sure you seeded the database
cd back
npm run seed
```

---

## 📊 System Architecture

```
┌─────────────────┐
│  Frontend       │
│  React + Vite   │
│  Port: 5173     │
└────────┬────────┘
         │
         │ HTTP Requests
         │
         ▼
┌─────────────────┐
│  Backend        │
│  Express + Node │
│  Port: 3000     │
└────────┬────────┘
         │
         │ Mongoose
         │
         ▼
┌─────────────────┐
│  MongoDB        │
│  Port: 27017    │
└─────────────────┘
```

---

## 🎉 Success Indicators

✅ **Backend Running:** Console shows "Server started successfully"
✅ **Frontend Running:** Browser opens with homepage
✅ **Database Connected:** "Connected to MongoDB" message
✅ **API Working:** Health endpoint returns success
✅ **Login Working:** Can login with superadmin credentials

---

## 📝 Important Notes

1. **Always start backend BEFORE frontend**
2. **Make sure MongoDB is running**
3. **Use `npm run dev` for development** (not `npm start`)
4. **Run `npm run seed` only once** (unless you want to reset data)
5. **Default admin credentials are in the console** after seeding

---

## 🚀 You're All Set!

Now you have:
- ✅ Backend running on http://localhost:3000
- ✅ Frontend running on http://localhost:5173
- ✅ Database seeded with initial data
- ✅ SuperAdmin account ready to use

**Start developing! 🎨**

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Make sure all prerequisites are installed
3. Verify MongoDB is running
4. Check console for error messages
5. Review the .env file configuration

**Happy coding! 💻**
