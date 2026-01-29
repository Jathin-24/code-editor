# Online Code Editor - Complete Project Plan

## Project Overview
A web-based code editor that allows users to write HTML, CSS, and JavaScript code with live preview. Users can login with their roll number and name, and their code will be saved.

## Features
- **Code Editor**: Separate panels for HTML, CSS, and JavaScript
- **Live Preview**: Real-time output display in a sidebar/preview pane
- **User Authentication**: Login using roll number and name
- **Code Persistence**: Save and retrieve user's code
- **Responsive Design**: Works on desktop and tablet devices

## Technology Stack

### Frontend
- **HTML5**: Structure
- **CSS3**: Styling with modern design
- **JavaScript**: Interactive functionality
- **CodeMirror/Monaco Editor**: Advanced code editor with syntax highlighting
- **Local Storage**: Client-side temporary storage

### Backend (Optional - for persistence)
- **Node.js + Express**: Server framework
- **MongoDB Atlas**: Free cloud database for storing user data and code
- **OR Firebase**: Alternative for authentication and database

### Hosting Options
1. **Frontend Only (Static)**: Netlify, Vercel, GitHub Pages
2. **Full Stack**: Render.com (free tier), Railway.app, or Vercel with serverless functions

## Step-by-Step Development Guide

### Phase 1: Setup & Planning (30 minutes)
1. Create project directory
2. Initialize Git repository
3. Set up basic file structure
4. Choose your deployment strategy

### Phase 2: Frontend Development (3-4 hours)

#### Step 1: Basic HTML Structure
- Create `index.html` with:
  - Login page
  - Editor page with three panels (HTML, CSS, JS)
  - Output/preview iframe

#### Step 2: Styling (CSS)
- Create `styles.css` with:
  - Modern, attractive design
  - Dark mode support
  - Responsive layout
  - Smooth animations

#### Step 3: Core JavaScript Functionality
- Create `app.js` with:
  - Login handling
  - Code editor initialization
  - Live preview update logic
  - Local storage integration

### Phase 3: Backend Development (2-3 hours)

#### Option A: Simple Version (No Backend)
- Use **Local Storage** to save code
- Limitation: Data stays on user's browser only
- Best for: Quick deployment, learning

#### Option B: Full Backend (Recommended)
- Set up **Node.js + Express** server
- Connect to **MongoDB Atlas** (free tier)
- Create API endpoints:
  - POST /api/login - User authentication
  - POST /api/save - Save code
  - GET /api/load/:rollNo - Load user's code
  - GET /api/users/:rollNo - Get user info

### Phase 4: Integration & Testing (1-2 hours)
- Connect frontend to backend
- Test all features
- Fix bugs
- Add error handling

### Phase 5: Deployment (1-2 hours)
- Choose hosting platform
- Configure environment variables
- Deploy application
- Test live site

## Detailed File Structure

```
code-editor/
├── frontend/
│   ├── index.html          # Login page
│   ├── editor.html         # Main editor page
│   ├── css/
│   │   └── styles.css      # All styles
│   ├── js/
│   │   ├── login.js        # Login functionality
│   │   ├── editor.js       # Editor logic
│   │   └── api.js          # API calls
│   └── assets/
│       └── images/         # Any images/icons
├── backend/
│   ├── server.js           # Express server
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── Code.js         # Code schema
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── code.js         # Code CRUD routes
│   └── config/
│       └── db.js           # Database connection
├── package.json
├── .env                    # Environment variables
├── .gitignore
└── README.md
```

## Hosting Guide

### Option 1: Netlify (Frontend Only - Easiest)
**Best for**: Quick deployment, no backend needed
**Cost**: Free
**Steps**:
1. Push code to GitHub
2. Connect Netlify to your repository
3. Deploy with one click
4. Get live URL

**Limitations**: No persistent database, uses local storage only

### Option 2: Vercel (Frontend + Serverless Backend)
**Best for**: Full-stack with serverless functions
**Cost**: Free tier available
**Steps**:
1. Create Vercel account
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in project directory
4. Use serverless functions for API
5. Connect to MongoDB Atlas

### Option 3: Render.com (Full Stack - Recommended)
**Best for**: Complete backend with persistent database
**Cost**: Free tier (with limitations)
**Steps**:
1. Create Render account
2. Create new Web Service
3. Connect GitHub repository
4. Configure build settings:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add environment variables (MongoDB URI)
6. Deploy

### Option 4: Railway.app (Full Stack - Alternative)
**Best for**: Easy deployment with database included
**Cost**: Free trial credit
**Steps**:
1. Create Railway account
2. New Project → Deploy from GitHub
3. Add MongoDB plugin
4. Configure environment variables
5. Deploy

## Database Setup (MongoDB Atlas - Free)

1. **Create Account**: Go to mongodb.com/cloud/atlas
2. **Create Cluster**: Choose free tier (M0)
3. **Create Database User**: Set username and password
4. **Whitelist IP**: Add 0.0.0.0/0 (allow from anywhere)
5. **Get Connection String**: 
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/code-editor?retryWrites=true&w=majority
   ```
6. **Add to .env file**:
   ```
   MONGODB_URI=your_connection_string_here
   PORT=3000
   ```

## Development Workflow

### Local Development
```bash
# 1. Clone/Create project
mkdir code-editor
cd code-editor

# 2. Initialize npm
npm init -y

# 3. Install dependencies (if using backend)
npm install express mongoose cors dotenv body-parser

# 4. Install dev dependencies
npm install --save-dev nodemon

# 5. Run development server
npm run dev

# 6. Open browser
http://localhost:3000
```

### Testing Locally
1. Test login with sample roll numbers
2. Write code in editors
3. Check live preview updates
4. Save code and reload page
5. Verify code persistence

### Deployment Checklist
- [ ] Code tested locally
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] All routes tested
- [ ] Error handling added
- [ ] .gitignore includes .env and node_modules
- [ ] README.md created
- [ ] Git repository created and pushed
- [ ] Hosting platform account created
- [ ] Deployment configuration set
- [ ] Live site tested
- [ ] SSL certificate active (https)

## Recommended Approach for Beginners

### Easiest Path (2-3 hours total):
1. **Start with frontend only** using local storage
2. **Use CodeMirror** for syntax highlighting
3. **Deploy to Netlify** for free hosting
4. **Test with friends** to gather feedback
5. **Add backend later** if needed

### Production Path (6-8 hours total):
1. **Build complete frontend** with all features
2. **Set up Node.js + Express backend**
3. **Connect MongoDB Atlas** for data persistence
4. **Deploy to Render.com** for full-stack hosting
5. **Configure custom domain** (optional)
6. **Add analytics** (Google Analytics)

## Next Steps

Choose your approach:
1. **Quick Start**: I'll create a frontend-only version with local storage (deploy to Netlify)
2. **Full Stack**: I'll create both frontend and backend (deploy to Render.com)
3. **Custom**: Tell me your specific requirements

Which approach would you like to proceed with?
