# ⚡ QUICK REFERENCE CARD

## 🚀 START NOW

```bash
npm install
npm run dev
```

Open: **http://localhost:3000**

---

## 🌐 URLs

| URL | Purpose |
|-----|---------|
| `/` | Login |
| `/editor` | Code Editor (Practice) |
| `/admin` | Admin Panel (Teachers) |
| `/exam?examId=XXX` | Exam (Students) |

---

## 👨‍🏫 For Teachers

### Create Exam (2 minutes):
1. Open `/admin`
2. Fill form → Create
3. Copy link → Share with students

### Monitor Students:
- **Submissions Tab** → Select exam → See real-time

### Check Violations:
- **Activity Logs Tab** → Enter roll number → View

---

## 🎓 For Students

### Practice Mode:
1. Login at `/`
2. Code freely
3. Save anytime
4. No restrictions

### Exam Mode:
1. Click teacher's link
2. Login
3. **STAY IN TAB!**
4. Code solution
5. Submit or timeout

---

## 🔐 Anti-Cheating

| ❌ Disabled | ⚠️ Detected |
|------------|-------------|
| Copy/Paste | Tab Switch |
| Right-Click | Window Blur |
| Dev Tools (F12) | Fullscreen Exit |
| Inspect (Ctrl+Shift+I) | Screenshots |
| Console (Ctrl+Shift+J) | Inactivity |
| View Source (Ctrl+U) | - |

**3 Violations = Auto-Disqualified**

---

## 📊 Admin Dashboard

### Tabs:
1. **Create Exam** - Make new tests
2. **Exams** - View all exams
3. **Submissions** - Monitor students
4. **Logs** - Activity tracking

---

## ⚙️ Exam Settings

- **Duration**: 5-180 minutes
- **Max Tab Switches**: 1-10 (default: 3)
- **Fullscreen**: Required (recommended)
- **Copy/Paste**: Disabled (recommended)

---

## 📱 Submission Statuses

| Status | Meaning |
|--------|---------|
| IN_PROGRESS | Currently taking exam |
| SUBMITTED | Successfully submitted |
| TIMEOUT | Time expired, auto-submitted |
| DISQUALIFIED | Too many violations |

---

## 🎯 Violation Severity

| Level | Color | Example |
|-------|-------|---------|
| LOW | Green | Normal saves |
| MEDIUM | Blue | Copy attempts |
| HIGH | Orange | Tab switches |
| CRITICAL | Red | Dev tools, disqualification |

---

## 📖 Documentation

| Need to... | Read... |
|------------|---------|
| Get started | `START_HERE.md` |
| Use exam mode | `EXAM_MODE_GUIDE.md` |
| Reference exam features | `EXAM_MODE_SUMMARY.md` |
| Deploy online | `DEPLOYMENT_GUIDE.md` |
| Understand everything | `COMPLETE_OVERVIEW.md` |

---

## 🔧 Quick Troubleshooting

**MongoDB Error?**
- Check `.env` file has correct URI

**Port 3000 in use?**
- Change `PORT=3001` in `.env`

**Can't create exam?**
- Check MongoDB connection
- Verify all fields filled

**Students can't access?**
- Check exam start/end times
- Verify link has correct examId

---

## 💻 Commands

```bash
# Development
npm run dev

# Production
npm start

# Install dependencies
npm install
```

---

## 📂 Key Files

**Backend**:
- `server.js` - Main server
- `routes/exam.js` - Exam API
- `models/Exam.js` - Exam schema

**Frontend**:
- `public/exam.html` - Exam interface
- `public/admin.html` - Admin panel
- `public/exam-proctor.js` - Anti-cheating

---

## 🎨 Features at a Glance

**Regular Mode:**
- ✅ Code editor
- ✅ Live preview
- ✅ Auto-save
- ✅ No restrictions

**Exam Mode:**
- ✅ Timed tests
- ✅ Anti-cheating
- ✅ Activity logs
- ✅ Auto-disqualify
- ✅ Real-time monitoring

---

## 🚨 Important Rules

### Students During Exam:
1. ❌ Don't switch tabs
2. ❌ Don't press F12
3. ❌ Don't copy/paste
4. ❌ Don't exit fullscreen
5. ✅ Stay focused!

### Teachers:
1. ✅ Test exam yourself first
2. ✅ Monitor live during exam
3. ✅ Review logs after
4. ✅ Give adequate time
5. ✅ Communicate rules clearly

---

## 📞 Quick Help

**Setup**: See `START_HERE.md`
**Exam Guide**: See `EXAM_MODE_GUIDE.md`
**Deploy**: See `DEPLOYMENT_GUIDE.md`
**Everything**: See `COMPLETE_OVERVIEW.md`

---

## ✅ Pre-Flight Checklist

**Before Exam:**
- [ ] Exam created
- [ ] Times set correctly
- [ ] Question is clear
- [ ] Link copied
- [ ] Tested yourself
- [ ] Students notified
- [ ] Rules communicated

**During Exam:**
- [ ] Admin panel open
- [ ] Monitoring submissions
- [ ] Ready for questions

**After Exam:**
- [ ] Check all submissions
- [ ] Review violation logs
- [ ] Grade assignments

---

**Got 2 minutes? Start now:**

```bash
npm run dev
```

**Then visit:** `http://localhost:3000/admin`

**Create your first exam!** 🎓✨
