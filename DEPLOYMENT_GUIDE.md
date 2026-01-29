# Complete Deployment Walkthrough

This guide will walk you through every step from development to hosting your code editor online.

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Code editor (VS Code, Notepad++, etc.)
- [ ] Git installed ([Download](https://git-scm.com/downloads))
- [ ] Node.js v18+ installed ([Download](https://nodejs.org/))
- [ ] GitHub account ([Sign up](https://github.com/join))
- [ ] MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas/register))

---

## Part 1: Local Development Setup

### Step 1: Install Dependencies (2 minutes)

Open terminal in the project folder and run:

```bash
npm install
```

**Expected output:**
```
added 50 packages, and audited 51 packages in 10s
```

### Step 2: Set Up MongoDB Atlas (10 minutes)

#### 2.1 Create MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Choose "Free" tier when asked

#### 2.2 Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" (M0) tier
3. Select closest cloud provider and region
4. Cluster Name: Leave as default or name it "CodeEditor"
5. Click "Create Cluster" (takes 3-5 minutes)

#### 2.3 Create Database User
1. Security → Database Access (left sidebar)
2. Click "Add New Database User"
3. Authentication Method: Password
4. Username: `codeuser`
5. Password: Click "Autogenerate Secure Password" and **SAVE IT**
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

#### 2.4 Allow Network Access
1. Security → Network Access (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. IP Address should be: `0.0.0.0/0`
5. Click "Confirm"

#### 2.5 Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://codeuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the actual password you saved earlier

### Step 3: Configure Environment Variables (1 minute)

1. Open the `.env` file in the project root
2. Replace the content with:
   ```env
   MONGODB_URI=mongodb+srv://codeuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/codeeditor?retryWrites=true&w=majority
   PORT=3000
   NODE_ENV=development
   ```
3. Replace `YOUR_PASSWORD` with your actual MongoDB password
4. **Important**: Don't share this file with anyone!

### Step 4: Test Locally (5 minutes)

Run the development server:

```bash
npm run dev
```

**Expected output:**
```
[nodemon] starting `node server.js`
🚀 Server running on http://localhost:3000
📝 Environment: development
✅ MongoDB connected successfully
```

**If you see errors:**
- MongoDB connection error → Check your connection string in `.env`
- Port already in use → Change PORT in `.env` to 3001
- Module not found → Run `npm install` again

### Step 5: Test the Application

1. Open browser: http://localhost:3000
2. You should see the login page
3. Enter:
   - Roll Number: `TEST001`
   - Name: `Test User`
4. Click "Continue to Editor"
5. You should see the code editor with three panels
6. Try typing code and see the live preview
7. Click "Save Code" to save to database

**Success!** Your app works locally. Now let's deploy it.

---

## Part 2: Prepare for Deployment

### Step 6: Initialize Git Repository (2 minutes)

```bash
# Initialize git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Code Editor application"
```

### Step 7: Create GitHub Repository (3 minutes)

1. Go to https://github.com/new
2. Repository name: `code-editor`
3. Description: `Online HTML, CSS, JS code editor with live preview`
4. Visibility: Public or Private (your choice)
5. **DO NOT** check any boxes (no README, no .gitignore)
6. Click "Create repository"

### Step 8: Push to GitHub (2 minutes)

GitHub will show you commands. Use these:

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/code-editor.git

# Rename branch to main
git branch -M main

# Push code
git push -u origin main
```

**If asked for credentials:**
- Username: Your GitHub username
- Password: Use Personal Access Token (not your actual password)
  - Generate token: Settings → Developer settings → Personal access tokens → Generate new token

---

## Part 3: Deploy to Render.com (Recommended)

### Step 9: Create Render Account (2 minutes)

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest)
4. Authorize Render to access GitHub

### Step 10: Deploy Web Service (5 minutes)

1. Click "New +" → "Web Service"
2. Click "Connect" next to your `code-editor` repository
3. Configure settings:

   **Basic Info:**
   - Name: `code-editor-app` (or any unique name)
   - Region: Choose closest to you
   - Branch: `main`
   
   **Build & Deploy:**
   - Root Directory: (leave blank)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   
   **Plan:**
   - Instance Type: `Free`

4. Click "Advanced" to add environment variable:
   - Click "Add Environment Variable"
   - Key: `MONGODB_URI`
   - Value: Paste your MongoDB connection string
   - Click "Add Environment Variable" again:
   - Key: `NODE_ENV`
   - Value: `production`

5. Click "Create Web Service"

### Step 11: Wait for Deployment (3-5 minutes)

Watch the deployment logs:
- Installing dependencies...
- Building...
- Starting server...
- **"Live"** indicator should turn green

### Step 12: Access Your Live App! 🎉

Your app will be available at:
```
https://code-editor-app.onrender.com
```

**Test it:**
1. Visit the URL
2. Login with roll number and name
3. Write some code
4. Save and reload
5. Your code should persist!

---

## Part 4: Alternative Deployment Options

### Option A: Railway.app (Easier, but limited free tier)

1. Go to https://railway.app
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variable `MONGODB_URI`
6. Deploy automatically starts
7. Get your URL from the dashboard

### Option B: Vercel (Great for serverless)

**Note:** Requires some modifications for serverless functions.

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add MONGODB_URI

# Deploy to production
vercel --prod
```

---

## Part 5: Post-Deployment

### Verify Everything Works

- [ ] Can open the website
- [ ] Login page loads properly
- [ ] Can create an account
- [ ] Can write code
- [ ] Live preview works
- [ ] Can save code
- [ ] Code persists after logout and login

### Share Your App

Your app is now live! Share the URL with:
- Classmates
- Friends
- Social media
- Add to your resume/portfolio

### Monitor Your App

**Render.com:**
- Dashboard → Your service → Logs
- Monitor traffic and errors
- Auto-sleeps after 15 minutes of inactivity (free tier)
- First request after sleep takes 30-60 seconds

**MongoDB Atlas:**
- Monitor database usage
- Free tier: 512 MB storage limit
- Check Collections to see saved user data

---

## Part 6: Maintenance & Updates

### Update Your Code

When you make changes:

```bash
# Make your changes to files

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push

# Render will auto-deploy the changes!
```

### Common Issues & Solutions

**Issue: App is slow on first load**
- Cause: Free tier servers sleep after inactivity
- Solution: First request wakes server (takes 30-60 seconds)

**Issue: "Application Error" on Render**
- Check logs in Render dashboard
- Common cause: MongoDB connection string incorrect
- Solution: Update environment variable

**Issue: Code not saving**
- Check browser console (F12)
- Verify MongoDB connection in Render logs
- Ensure environment variable is set correctly

**Issue: Changes not appearing**
- Clear browser cache
- Hard reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check if Render deployment succeeded

---

## 🎓 What You've Learned

By completing this walkthrough, you've learned:

1. ✅ Full-stack web development
2. ✅ Node.js and Express backend
3. ✅ MongoDB database integration
4. ✅ Frontend development (HTML, CSS, JS)
5. ✅ Git version control
6. ✅ GitHub repository management
7. ✅ Cloud deployment (Render/Railway/Vercel)
8. ✅ Environment variable configuration
9. ✅ Live application monitoring

---

## 🚀 Next Steps

**Enhance your app:**
1. Add more features (multiple projects per user)
2. Add file export (download HTML file)
3. Add code themes (light/dark mode toggle)
4. Add code snippets library
5. Add collaboration features

**Learn more:**
1. Add TypeScript for better code quality
2. Implement authentication with JWT tokens
3. Add real-time collaboration with WebSockets
4. Create a mobile app version
5. Add code formatting and linting

---

## 📞 Need Help?

**Common Resources:**
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/
- Render Docs: https://render.com/docs
- Express.js Guide: https://expressjs.com/en/guide/routing.html
- Node.js Docs: https://nodejs.org/docs/

**Stuck on a specific step?**
- Re-read the instructions carefully
- Check error messages in terminal/browser console
- Verify all credentials are correct
- Try the "Common Issues" section

---

## ✅ Deployment Checklist

Use this checklist to ensure everything is done:

**Local Development:**
- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] `.env` file configured
- [ ] App runs locally (`npm run dev`)
- [ ] Tested login and save functionality

**Version Control:**
- [ ] Git initialized
- [ ] All files committed
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

**Deployment:**
- [ ] Render/Railway account created
- [ ] Connected to GitHub repository
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] App accessible via URL
- [ ] Tested all features on live site

**Final Verification:**
- [ ] Login works
- [ ] Code editor works
- [ ] Live preview works
- [ ] Save functionality works
- [ ] Code persists across sessions
- [ ] App URL shared with others

---

**Congratulations! 🎉**

You've successfully built and deployed a full-stack web application!

This is a real achievement - you now have:
- A working product you can show in interviews
- Experience with modern web technologies
- A deployed application accessible worldwide
- Foundation to build more complex applications

Keep coding and building! 🚀
