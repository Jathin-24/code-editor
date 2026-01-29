# Quick Start Guide - Online Code Editor

## Choose Your Path

### 🚀 RECOMMENDED: Full Stack (Complete Solution)
**Time**: 3-4 hours | **Difficulty**: Medium | **Persistence**: ✅ Database saves

### 🎯 Alternative: Frontend Only (Quickest)
**Time**: 1-2 hours | **Difficulty**: Easy | **Persistence**: ⚠️ Browser only

---

## 🚀 FULL STACK APPROACH (Recommended)

### What You'll Build:
- ✅ Login with Roll Number & Name
- ✅ HTML, CSS, JS Editor with syntax highlighting
- ✅ Live preview panel
- ✅ Save code to database (MongoDB)
- ✅ Retrieve your code anytime
- ✅ Hosted online (accessible from anywhere)

### Step-by-Step Instructions

#### STEP 1: Initial Setup (5 minutes)

```bash
# Navigate to project folder
cd c:\Users\user\Documents\Coding\code-editor

# Initialize npm project
npm init -y

# Install backend dependencies
npm install express mongoose cors dotenv

# Install development tool
npm install --save-dev nodemon
```

#### STEP 2: Create Project Structure (2 minutes)

Create these folders and files:
```
code-editor/
├── public/              (Frontend files)
│   ├── index.html       (Login page)
│   ├── editor.html      (Main editor)
│   ├── style.css        (Styles)
│   └── script.js        (Frontend logic)
├── models/
│   ├── User.js          (User model)
│   └── Project.js       (Code storage model)
├── routes/
│   └── api.js           (API endpoints)
├── server.js            (Main server file)
├── .env                 (Environment variables)
├── .gitignore
└── package.json
```

#### STEP 3: Set Up MongoDB (10 minutes)

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for free account
3. **Create a cluster**:
   - Choose FREE tier (M0)
   - Select closest region
   - Click "Create Cluster"
4. **Create database user**:
   - Security → Database Access
   - Add New Database User
   - Username: `codeuser`
   - Password: (create secure password)
   - User Privileges: Read and write to any database
5. **Whitelist all IPs**:
   - Security → Network Access
   - Add IP Address → "Allow Access from Anywhere"
   - IP: `0.0.0.0/0`
6. **Get connection string**:
   - Databases → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your actual password

#### STEP 4: Configure Environment (2 minutes)

Create `.env` file in root:
```env
MONGODB_URI=mongodb+srv://codeuser:<password>@cluster0.xxxxx.mongodb.net/codeeditor?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

Create `.gitignore`:
```
node_modules/
.env
*.log
.DS_Store
```

#### STEP 5: Build Backend (Will provide code files)

I'll create:
- `server.js` - Main Express server
- `models/User.js` - User schema
- `models/Project.js` - Code storage schema
- `routes/api.js` - API endpoints

#### STEP 6: Build Frontend (Will provide code files)

I'll create:
- `public/index.html` - Beautiful login page
- `public/editor.html` - Code editor interface
- `public/style.css` - Modern, attractive styling
- `public/script.js` - Editor functionality

#### STEP 7: Local Testing (5 minutes)

```bash
# Update package.json scripts
npm pkg set scripts.dev="nodemon server.js"
npm pkg set scripts.start="node server.js"

# Run development server
npm run dev

# Open browser to:
http://localhost:3000
```

#### STEP 8: Deploy to Render.com (15 minutes)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Code editor app"
   
   # Create GitHub repo and push
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Create Render Account**:
   - Go to: https://render.com
   - Sign up with GitHub

3. **Deploy**:
   - Dashboard → New → Web Service
   - Connect GitHub repository
   - Configure:
     - **Name**: code-editor-app
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free
   - Add Environment Variable:
     - Key: `MONGODB_URI`
     - Value: (paste your MongoDB connection string)
   - Click "Create Web Service"

4. **Wait for deployment** (3-5 minutes)

5. **Access your app**:
   - URL: `https://code-editor-app.onrender.com`

---

## 🎯 FRONTEND ONLY APPROACH (Alternative)

### What You'll Build:
- ✅ Login with Roll Number & Name
- ✅ HTML, CSS, JS Editor
- ✅ Live preview panel
- ⚠️ Saves to browser only (not permanent)

### Step-by-Step Instructions

#### STEP 1: Create Files (2 minutes)

Create these files:
```
code-editor/
├── index.html       (Login + Editor in one)
├── style.css        (Styles)
└── script.js        (All functionality)
```

#### STEP 2: Build Application (Will provide code files)

I'll create:
- `index.html` - Complete interface
- `style.css` - Modern styling
- `script.js` - Editor with local storage

#### STEP 3: Deploy to Netlify (5 minutes)

**Option A: Drag & Drop (Easiest)**
1. Go to: https://app.netlify.com/drop
2. Drag your folder (with all 3 files)
3. Get instant URL!

**Option B: GitHub + Netlify**
1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Code editor app"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
2. Go to Netlify → Import from Git
3. Select repository
4. Click Deploy!

---

## 📊 Comparison

| Feature | Frontend Only | Full Stack |
|---------|--------------|------------|
| Setup Time | 1-2 hours | 3-4 hours |
| Database | ❌ Local Storage | ✅ MongoDB |
| Persistent Data | ❌ Browser only | ✅ Anywhere |
| Multi-device | ❌ No | ✅ Yes |
| Difficulty | Easy | Medium |
| Hosting Cost | Free (Netlify) | Free (Render) |
| Scalability | Limited | High |

---

## 🎯 My Recommendation

**For learning & quick demo**: Go with Frontend Only
**For real project**: Go with Full Stack

Which approach would you like me to help you build?
1. **Full Stack** (I recommend this - more professional)
2. **Frontend Only** (Faster to deploy)
3. **Both** (Start simple, upgrade later)

Let me know, and I'll create all the code files for you!
