# CodeSpace - Online Code Editor

A beautiful, modern web-based code editor with HTML, CSS, and JavaScript support featuring live preview, user authentication, and persistent code storage.

![CodeSpace](https://img.shields.io/badge/CodeSpace-v1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## ✨ Features

### Core Features
- 🎨 **Beautiful Dark Theme UI** - Modern, gradient-based design with smooth animations
- 💻 **Three-Panel Editor** - Separate editors for HTML, CSS, and JavaScript
- 👁️ **Live Preview** - See your code output in real-time
- 💾 **Auto-Save** - Automatically saves your code after 3 seconds of inactivity
- 🔐 **User Authentication** - Login with roll number and name
- 📦 **Persistent Storage** - Your code is saved to MongoDB and accessible from anywhere
- ⌨️ **Keyboard Shortcuts** - `Ctrl+S` to save, `Ctrl+R` to refresh preview
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎯 **Tab Support** - Press Tab for proper code indentation
- 🔄 **Auto-Recovery** - Prevents accidental data loss

### 🔒 Exam/Testing Mode (NEW!)
- 📝 **Secure Exam Environment** - Timed coding tests with countdown timer
- ❌ **Anti-Cheating Detection** - Prevents copy/paste, tab switching, dev tools
- 🚫 **Auto-Disqualification** - Automatically disqualifies after 3 violations
- 📊 **Activity Logging** - Every action tracked and timestamped
- 👨‍🏫 **Admin Panel** - Create exams, monitor students, view submissions
- ⏱️ **Time Management** - Auto-submit when time expires
- 🎯 **Question System** - Display tasks/questions to students
- 📈 **Submission Tracking** - Real-time monitoring of student progress
- 🔍 **Violation Reports** - Detailed logs of cheating attempts
- 🖥️ **Fullscreen Enforcement** - Required fullscreen mode during exams

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** (Free) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

### Installation

1. **Clone or download this project**
   ```bash
   cd code-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB Atlas**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (M0 tier)
   - Create a database user
   - Whitelist all IPs (0.0.0.0/0)
   - Get your connection string

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/codeeditor?retryWrites=true&w=majority
   PORT=3000
   NODE_ENV=development
   ```
   
   Replace `username`, `password`, and the cluster URL with your actual MongoDB credentials.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
code-editor/
├── models/
│   ├── User.js           # User schema (roll number, name)
│   └── Project.js        # Code storage schema (HTML, CSS, JS)
├── routes/
│   └── api.js            # API endpoints (login, save, load)
├── public/
│   ├── index.html        # Login page
│   ├── editor.html       # Main editor interface
│   ├── style.css         # Comprehensive styling
│   └── script.js         # Frontend logic
├── server.js             # Express server
├── package.json          # Dependencies
├── .env                  # Environment variables (create this)
├── .env.example          # Environment template
└── README.md             # This file
```

## 🔧 API Endpoints

### POST `/api/login`
Login or register a user
```json
Request:
{
  "rollNo": "CS2024001",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "message": "Login successful!",
  "user": {
    "id": "...",
    "rollNo": "CS2024001",
    "name": "John Doe"
  },
  "isNewUser": false
}
```

### GET `/api/project/:rollNo`
Get user's saved code
```json
Response:
{
  "success": true,
  "project": {
    "html": "...",
    "css": "...",
    "javascript": "...",
    "updatedAt": "2024-01-29T10:00:00.000Z"
  }
}
```

### POST `/api/save`
Save user's code
```json
Request:
{
  "rollNo": "CS2024001",
  "html": "<h1>Hello</h1>",
  "css": "h1 { color: blue; }",
  "javascript": "console.log('Hello');"
}

Response:
{
  "success": true,
  "message": "Code saved successfully!",
  "updatedAt": "2024-01-29T10:00:00.000Z"
}
```

### GET `/api/users`
Get all users (admin/debug)
```json
Response:
{
  "success": true,
  "count": 10,
  "users": [...]
}
```

## 🌐 Deployment

### Option 1: Render.com (Recommended - Free)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Render**
   - Go to [Render.com](https://render.com) and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `code-editor-app`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free`
   - Add Environment Variable:
     - **Key**: `MONGODB_URI`
     - **Value**: Your MongoDB connection string
   - Click "Create Web Service"

3. **Access your app**
   - Your app will be available at: `https://code-editor-app.onrender.com`

### Option 2: Railway.app (Alternative - Free Trial)

1. **Push to GitHub** (same as above)

2. **Deploy to Railway**
   - Go to [Railway.app](https://railway.app) and sign up
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variable `MONGODB_URI`
   - Railway will automatically deploy

### Option 3: Vercel (Frontend + Serverless)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables in Vercel dashboard**

### Option 4: Netlify (Frontend Only)

For a simplified version without backend:
1. Drag and drop the `public` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Uses browser's localStorage instead of database

## 🎯 Usage

1. **Login**: Enter your roll number and full name
2. **Code**: Write HTML, CSS, and JavaScript in respective panels
3. **Preview**: See live output in the preview panel
4. **Save**: Click "Save Code" or press `Ctrl+S`
5. **Auto-Save**: Code automatically saves 3 seconds after you stop typing

### Keyboard Shortcuts

- `Ctrl + S` or `Cmd + S` - Save code
- `Ctrl + R` or `Cmd + R` - Refresh preview
- `Tab` - Insert 2 spaces (in code editors)

## 🔒 Security Features

- Roll numbers are case-insensitive and auto-uppercase
- User sessions stored in localStorage
- CORS enabled for API access
- Input validation on all endpoints
- Error handling for failed requests

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **dotenv** - Environment configuration

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (Custom design, no frameworks)
- **Vanilla JavaScript** - Logic and interactivity
- **Google Fonts** - Inter (UI) & Fira Code (Editor)

## 📝 NPM Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure your IP is whitelisted (use 0.0.0.0/0)
- Check username and password in connection string
- Verify network connectivity

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3000 | xargs kill
  ```

### Code Not Saving
- Check browser console for errors
- Verify MongoDB connection
- Check server logs

## 🎨 Customization

### Change Color Theme
Edit `public/style.css` → `:root` section:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  /* ... */
}
```

### Change Auto-Save Delay
Edit `public/script.js`:
```javascript
const AUTO_SAVE_DELAY = 3000; // Change to desired milliseconds
```

## 📄 License

MIT License - Feel free to use this project for learning and personal use.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📧 Support

If you encounter any issues, please check:
1. MongoDB Atlas connection
2. Environment variables are set correctly
3. Dependencies are installed (`npm install`)
4. Node.js version is 18 or higher

## 🎓 Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Docs](https://nodejs.org/docs/latest/api/)

---

**Made with ❤️ for developers who love to code**

Happy Coding! 🚀
