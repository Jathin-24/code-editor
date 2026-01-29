# 🔒 Exam Mode & Anti-Cheating Guide

## Overview

Your code editor now includes **comprehensive exam/testing features** with advanced anti-cheating detection. This makes it perfect for conducting secure online coding tests and examinations.

---

## 🚀 New Features Added

### 1. **Exam Mode**
- Timed coding tests with countdown timer
- Specific questions/tasks for students
- Auto-submission when time expires
- Locked after submission

### 2. **Anti-Cheating Detection**
- ❌ Copy/paste disabled
- ❌ Right-click context menu disabled  
- ✅ Tab switching detection (auto-disqualifies after 3 switches)
- ✅ Dev tools detection (F12, Inspect Element)
- ✅ Fullscreen enforcement
- ✅ Screenshot attempt detection
- ✅ All activities logged to database

### 3. **Activity Logging**
- Every student action is tracked
- Timestamp for each activity
- Severity levels (LOW, MEDIUM, HIGH, CRITICAL)
- Stored in database for review

### 4. **Admin Panel**
- Create and manage exams
- View all student submissions
- Monitor cheating violations
- Review activity logs
- Real-time submission tracking

### 5. **Auto-Disqualification**
- Students automatically disqualified after 3 tab switches
- Immediate screen lock
- Submission automatically saved and locked
- No further editing allowed

---

## 📂 New Files Created

### Backend (Models)
- `models/Exam.js` - Exam configuration schema
- `models/Submission.js` - Student submissions with cheating flags
- `models/ActivityLog.js` - Activity tracking

### Backend (Routes)
- `routes/exam.js` - Exam API endpoints

### Frontend
- `public/exam.html` - Secure exam interface
- `public/exam-script.js` - Exam logic and timer
- `public/exam-proctor.js` - Anti-cheating system
- `public/exam-mode.css` - Exam mode styling
- `public/admin.html` - Admin panel interface
- `public/admin-script.js` - Admin functionality

---

## 📖 How to Use

### For Teachers/Admins

#### 1. Access Admin Panel
Open in browser:
```
http://localhost:3000/admin.html
```

#### 2. Create an Exam

1. Go to "Create Exam" tab
2. Fill in the details:
   - **Title**: e.g., "HTML/CSS Basics Test"
   - **Description**: Brief overview
   - **Question/Task**: The actual coding task
   - **Duration**: Time limit in minutes (default: 60)
   - **Start Time**: When exam becomes available
   - **End Time**: When exam closes
   - **Max Tab Switches**: Number of violations before disqualification (default: 3)
   - **Require Full Screen**: Force fullscreen mode ✅
   - **Allow Copy/Paste**: Usually keep unchecked ❌

3. Click "Create Exam"
4. Copy the exam link and shareHere with students

**Example Exam Link:**
```
http://localhost:3000/exam.html?examId=abc123xyz789
```

#### 3. Monitor Students

**View Submissions:**
1. Go to "Submissions" tab
2. Select the exam from dropdown
3. See all student submissions with:
   - Status (IN_PROGRESS, SUBMITTED, DISQUALIFIED)
   - Time spent
   - Tab switch count
   - Violation flags
   - Submission time

**View Activity Logs:**
1. Go to "Activity Logs" tab
2. Enter student's roll number
3. See complete activity history:
   - Every action timestamped
   - Severity levels
   - Descriptions of violations

**View Student Code:**
- Click "View Code" on any submission
- Opens student's code in new window
- Read-only view

---

### For Students

#### 1. Login

1. Open the exam link provided by teacher
2. Login page appears
3. Enter roll number and name
4. System checks if exam is active

#### 2. During Exam

**What You'll See:**
- Exam banner with title and description
- Countdown timer (top center)
- Question/task panel
- Three code editors (HTML, CSS, JS)
- Live preview panel
- Submit button

**Important Rules:**
- ⚠️ **DO NOT** switch tabs or windows
- ⚠️ **DO NOT** open dev tools (F12)
- ⚠️ **DO NOT** exit fullscreen mode
- ⚠️ **DO NOT** try to copy external code
- ⚠️ **DO NOT** take screenshots

**What Happens If You Violate:**
1. **First Violation**: Warning message
2. **Second Violation**: Critical warning
3. **Third Violation**: Automatic DISQUALIFICATION
   - Screen locks immediately
   - Code cannot be edited
   - Submission marked as disqualified

**Auto-Save:**
- Code saves automatically every 10 seconds
- You don't need to manually save
- Status bar shows "Auto-saving enabled"

**Timer Warnings:**
- Timer turns yellow when < 5 minutes left
- Critical warning at 30 seconds
- Auto-submits when time expires

#### 3. Submission

**Manual Submit:**
1. Click "Submit Exam" button
2. Confirm you want to submit
3. Code is locked
4. You'll see confirmation with:
   - Time spent
   - Status
5. Redirected to home page

**Auto-Submit (Timeout):**
- Happens automatically when timer reaches 0:00
- No confirmation needed
- Same as manual submit

---

## 🔧 API Endpoints

### Exam Management

**Get Active Exams**
```
GET /api/exams/active
```

**Get Exam Details**
```
GET /api/exams/:examId
```

**Start Exam**
```
POST /api/exams/:examId/start
Body: { rollNo: "CS001" }
```

**Submit Exam**
```
POST /api/exams/:examId/submit
Body: { rollNo: "CS001" }
```

**Save Code (Auto-save)**
```
POST /api/exams/save
Body: { rollNo, examId, html, css, javascript }
```

**Get Submission**
```
GET /api/exams/:examId/submission/:rollNo
```

### Activity Tracking

**Log Activity**
```
POST /api/activity/log
Body: {
  rollNo,
  examId,
  activityType,
  description,
  severity
}
```

### Admin Endpoints

**Create Exam**
```
POST /api/admin/exams
Body: { title, description, question, duration, startTime, endTime, ... }
```

**Get Submissions**
```
GET /api/admin/exams/:examId/submissions
```

**Get Activity Logs**
```
GET /api/admin/logs/:rollNo
```

---

## 🛡️ Anti-Cheating Features Explained

### 1. Tab Switch Detection
**How it works:**
- Monitors `window.blur` event
- Tracks `visibilitychange` event
- Counts each instance
- Logs to database with timestamp

**What triggers it:**
- Pressing Alt+Tab
- Clicking another window
- Switching browser tabs
- Minimizing window

**Consequence:**
- Warning on first switch
- Critical warning on second
- Automatic disqualification on third

### 2. Dev Tools Detection
**Methods used:**
- Timing-based detection
- Console log monitoring
- Keyboard shortcut blocking (F12, Ctrl+Shift+I, Ctrl+Shift+J)
- Firebug detection

**Blocked shortcuts:**
- F12 (Dev Tools)
- Ctrl+Shift+I (Inspect)
- Ctrl+Shift+J (Console)
- Ctrl+U (View Source)

### 3. Copy/Paste Prevention
**Disabled actions:**
- Copy (Ctrl+C)
- Cut (Ctrl+X)
- Paste (Ctrl+V)
- Right-click context menu

**Note:** Students can still type freely in code editors

### 4. Fullscreen Enforcement
**How it works:**
- Requests fullscreen on exam start
- Monitors fullscreen exit
- Re-requests fullscreen if exited
- Logs exit attempts

**Student experience:**
- Automatic fullscreen on exam load
- Warning if they try to exit
- Auto-returns to fullscreen after 2 seconds

### 5. Screenshot Detection
**Limited but included:**
- Detects Print Screen key
- Detects Mac screenshot shortcuts (Cmd+Shift+3/4)
- Clears clipboard on attempt
- Logs the attempt

**Note:** Screenshot detection is not 100% reliable due to browser limitations

### 6. Activity Monitoring
**Tracks:**
- Login/logout
- Tab switches
- Window blur/focus
- Copy/paste attempts
- Dev tools opening
- Fullscreen exits
- Code saves
- Exam start/submit
- Inactivity periods

**All logged with:**
- Timestamp
- Description
- Severity level
- Metadata (if applicable)

---

## ⚙️ Configuration Options

When creating an exam, you can configure:

### Duration
```javascript
duration: 60 // minutes (5-180)
```

### Start/End Times
```javascript
startTime: "2024-01-30T10:00:00"
endTime: "2024-01-30T12:00:00"
```

### Max Tab Switches
```javascript
maxTabSwitches: 3 // 1-10 violations before disqualification
```

### Fullscreen Requirement
```javascript
requireFullScreen: true // or false
```

### Copy/Paste
```javascript
allowCopyPaste: false // or true (not recommended)
```

---

## 📊 Database Schema

### Exam Collection
```javascript
{
  title: String,
  description: String,
  question: String,
  duration: Number, // minutes
  startTime: Date,
  endTime: Date,
  isActive: Boolean,
  allowCopyPaste: Boolean,
  requireFullScreen: Boolean,
  maxTabSwitches: Number,
  createdAt: Date
}
```

### Submission Collection
```javascript
{
  userId: ObjectId,
  rollNo: String,
  examId: ObjectId,
  html: String,
  css: String,
  javascript: String,
  startedAt: Date,
  submittedAt: Date,
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'TIMEOUT' | 'DISQUALIFIED',
  timeSpent: Number, // seconds
  tabSwitchCount: Number,
  cheatingFlags: [{
    type: String,
    timestamp: Date,
    description: String
  }],
  isDisqualified: Boolean,
  disqualificationReason: String
}
```

### ActivityLog Collection
```javascript
{
  userId: ObjectId,
  rollNo: String,
  examId: ObjectId,
  activityType: String,
  description: String,
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  metadata: Mixed,
  timestamp: Date
}
```

---

## 🎯 Best Practices

### For Teachers

1. **Test First**: Create a test exam and try it yourself
2. **Clear Instructions**: Provide detailed task descriptions
3. **Reasonable Time**: Give adequate time (60-90 minutes typical)
4. **Communicate Rules**: Tell students about anti-cheating measures beforehand
5. **Monitor Live**: Check submissions tab during exam
6. **Review Logs**: Check activity logs for suspicious behavior
7. **Backup Plan**: Have alternative assessment if technical issues occur

### For Students

1. **Stable Internet**: Ensure good connection
2. **Browser**: Use Chrome or Firefox (latest version)
3. **Focus**: Close all other tabs before starting
4. **Fullscreen**: Don't exit fullscreen mode
5. **No External Tools**: Only use the provided editor
6. **Read Carefully**: Understand the question before coding
7. **Test Preview**: Check your output in preview panel
8. **Submit Early**: Don't wait until last second

---

## 🔍 Troubleshooting

### Student Issues

**"Auto-disqualified for tab switching"**
- Unfortunately, this is automatic after 3 violations
- Contact teacher to explain circumstances
- Teacher can review activity logs

**"Can't paste code"**
- Pasting is disabled for exam integrity
- All code must be typed manually

**"Fullscreen keeps activating"**
- This is required for exam mode
- Don't try to exit - it will count as violation

**"Timer not showing"**
- Refresh page
- Check if exam time is active
- Contact teacher

### Teacher Issues

**"Students can't access exam"**
- Check start/end times are correct
- Verify exam is marked as active
- Ensure students have correct link

**"No submissions showing"**
- Students may not have started exam yet
- Check if exam ID matches
- Verify database connection

**"Activity logs empty"**
- Roll number might be wrong (case-sensitive)
- Student may not have logged any activities
- Check database connection

---

## 🚀 Deployment Notes

When deploying with exam features:

1. **MongoDB**: Ensure enough storage for logs (can grow large)
2. **Environment**: All existing `.env` variables apply
3. **Routes**: Both `/api` and `/api/exam` routes active
4. **Frontend**: All HTML files must be in `public/` folder

No additional setup needed beyond normal deployment!

---

## 📈 Statistics & Insights

Teachers can track:
- ✅ Number of students who started exam
- ✅ Number of submissions
- ✅ Number of disqualifications
- ✅ Average time spent
- ✅ Violation patterns
- ✅ Most common cheating attempts

---

## 🎓 Educational Use Cases

Perfect for:
- 📝 Coding exams and quizzes
- 🏆 Programming competitions
- 📊 Skills assessments
- 🎯 Certification tests
- 👥 Classroom tests
- 💼 Technical interviews (with candidates' permission)

---

## ✅ Exam Mode Checklist

**Before Exam (Teacher):**
- [ ] Create exam in admin panel
- [ ] Set appropriate duration
- [ ] Write clear question/task
- [ ] Configure anti-cheating settings
- [ ] Test the exam link yourself
- [ ] Share link with students
- [ ] Communicate rules and violations

**During Exam (Teacher):**
- [ ] Monitor submissions tab
- [ ] Watch for violations
- [ ] Check if students are progressing
- [ ] Be available for technical issues

**During Exam (Student):**
- [ ] Close all other tabs
- [ ] Read question carefully
- [ ] Stay in fullscreen
- [ ] Don't switch tabs
- [ ] Don't use dev tools
- [ ] Check preview regularly
- [ ] Submit before time expires

**After Exam (Teacher):**
- [ ] Review all submissions
- [ ] Check activity logs for suspicious behavior
- [ ] Grade submissions
- [ ] Provide feedback

---

## 🔐 Security Considerations

**What's Protected:**
- ✅ Tab switching
- ✅ Copy/paste in browser
- ✅ Dev tools access (mostly)
- ✅ Right-click menu
- ✅ Basic screenshot attempts
- ✅ Window focus

**Limitations:**
- ⚠️ Physical cameras/phones can still capture screen
- ⚠️ Virtual machines can bypass some restrictions
- ⚠️ Screenshot tools may still work
- ⚠️ Second device can be used for reference

**Best Used In Combination With:**
- 👥 Live proctoring (Zoom, Teams)
- 📹 Webcam monitoring
- 🏫 In-person supervision
- 🎓 Honor code agreements

---

## 📞 Support

For issues or questions:
1. Check this guide thoroughly
2. Review activity logs for debugging
3. Test in browser console (teacher only)
4. Check MongoDB connection
5. Verify all new files are deployed

---

**You now have a fully functional, secure exam platform! 🎉**

Start by creating a test exam in the admin panel and trying it yourself!
