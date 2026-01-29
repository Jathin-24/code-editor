# 🚀 START HERE - First Time Setup

Welcome to CodeSpace! Follow these steps to get your code editor running.

## ⚡ Quick Start (15 minutes total)

### Step 1: Set Up MongoDB (10 minutes) ⭐ MOST IMPORTANT

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create a FREE cluster**:
   - Click "Build a Database" → Choose "FREE" (M0)
   - Pick any cloud provider and region
   - Click "Create Cluster"

3. **Create a database user**:
   - Go to: Security → Database Access
   - Click "Add New Database User"
   - Username: `codeuser`
   - Click "Autogenerate Secure Password" → **COPY THE PASSWORD!**
   - Click "Add User"

4. **Allow all IP addresses**:
   - Go to: Security → Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Confirm

5. **Get your connection string**:
   - Go to: Database → Connect → "Connect your application"
   - **Copy the connection string** (looks like this):
   ```
   mongodb+srv://codeuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

6. **Update the .env file**:
   - Open `.env` file in this project
   - Replace the first line with your connection string:
   ```
   MONGODB_URI=mongodb+srv://codeuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/codeeditor?retryWrites=true&w=majority
   ```
   - Save the file

### Step 2: Install Dependencies (2 minutes)

Open terminal in this folder and run:

```bash
npm install
```

Wait for it to complete (you'll see "added XX packages").

### Step 3: Start the Server (1 minute)

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
✅ MongoDB connected successfully
```

### Step 4: Open in Browser

1. Open your browser
2. Go to: **http://localhost:3000**
3. You'll see the login page!

### Step 5: Test It Out

1. **Login**:
   - Roll Number: `TEST001`
   - Name: `Your Name`
   - Click "Continue to Editor"

2. **Write some code**:
   - HTML: `<h1>Hello World!</h1>`
   - CSS: `h1 { color: blue; }`
   - JS: `console.log("It works!");`

3. **Save**:
   - Click "Save Code" button OR press `Ctrl+S`

4. **Test persistence**:
   - Click "Logout"
   - Login again with same roll number
   - Your code should still be there! ✅

---

## ✅ Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (FREE tier)
- [ ] Database user created
- [ ] IP address whitelisted (0.0.0.0/0)
- [ ] Connection string copied
- [ ] `.env` file updated with connection string
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev` successfully
- [ ] Opened http://localhost:3000 in browser
- [ ] Logged in successfully
- [ ] Code editor is visible
- [ ] Live preview works
- [ ] Save button works
- [ ] Code persists after logout/login

---

## 🆘 Troubleshooting

### Error: "MongoDB connection failed"
- Check your `.env` file
- Make sure you replaced `<password>` with actual password
- Verify IP whitelist is 0.0.0.0/0
- Connection string should end with `/codeeditor?retryWrites=true&w=majority`

### Error: "Port 3000 is already in use"
- Open `.env` file
- Change `PORT=3000` to `PORT=3001`
- Restart the server

### Error: "Cannot find module"
- Run `npm install` again
- Make sure you're in the correct folder
- Check if `node_modules` folder exists

### Page doesn't load
- Check if server is running (`npm run dev`)
- Look for error messages in terminal
- Try http://127.0.0.1:3000 instead

---

## 📚 What to Read Next

Once you have it running locally:

1. **SUMMARY.md** - Overview of all features
2. **README.md** - Complete documentation
3. **DEPLOYMENT_GUIDE.md** - Deploy to the internet (when ready)

---

## 🎯 Your MongoDB Connection String Format

Should look like this:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/codeeditor?retryWrites=true&w=majority
```

**Common mistakes:**
❌ Forgot to replace `<password>` with actual password
❌ Missing `/codeeditor` database name
❌ Missing `?retryWrites=true&w=majority` at the end
❌ Extra spaces in the connection string

**Correct example:**
✅ `mongodb+srv://codeuser:MyPass123@cluster0.abcde.mongodb.net/codeeditor?retryWrites=true&w=majority`

---

## 🚀 Next Steps After Local Setup

1. ✅ Get it running locally (you'll do this first)
2. 📝 Test all features
3. 🎨 Customize the design (optional)
4. 🌐 Deploy to the internet (Render.com - free)
5. 📢 Share with friends!

---

## 💻 Commands You'll Use

```bash
# Install dependencies (first time only)
npm install

# Start development server (use this every time)
npm run dev

# Stop the server
Ctrl + C (in terminal)
```

---

## 🎉 That's It!

This is everything you need to get started. The setup is simple:

1. MongoDB (10 min)
2. Update .env (1 min)  
3. npm install (2 min)
4. npm run dev (instant)

**Total time: About 15 minutes**

Then you'll have a fully working code editor running on your computer!

Ready? Start with Step 1 above! 🚀

---

**Still confused?** Read `DEPLOYMENT_GUIDE.md` for even more detailed step-by-step instructions with screenshots descriptions.
