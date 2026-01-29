// Exam Mode JavaScript
// Handles exam logic, timer, auto-save, and submission

let examProctor;
let examData;
let submissionId;
let timerInterval;
let autoSaveInterval;

// Get user and exam from URL/storage
const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get('id') || urlParams.get('examId');
const user = JSON.parse(localStorage.getItem('user'));

if (!user || !examId) {
    alert('Invalid exam session. Please login first.');
    window.location.href = '/';
}

// DOM Elements
const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const jsCode = document.getElementById('jsCode');
const preview = document.getElementById('preview');
const submitBtn = document.getElementById('submitExamBtn');
const timerDisplay = document.getElementById('timerDisplay');
const examTitle = document.getElementById('examTitle');
const examDescription = document.getElementById('examDescription');
const questionText = document.getElementById('questionText');
const violationCounter = document.getElementById('violationCounter');
const violationCount = document.getElementById('violationCount');
const statusText = document.getElementById('statusText');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userRoll = document.getElementById('userRoll');

// Display user info
userAvatar.textContent = user.name.charAt(0).toUpperCase();
userName.textContent = user.name;
userRoll.textContent = user.rollNo;

// Initialize exam
async function initExam() {
    try {
        // Fetch exam details
        const examResponse = await fetch(`/api/exams/${examId}`);
        const examResult = await examResponse.json();

        if (!examResult.success) {
            alert('Failed to load exam. Please try again.');
            window.location.href = '/';
            return;
        }

        examData = examResult.exam;

        // Update UI
        examTitle.textContent = examData.title;
        examDescription.textContent = examData.description;
        questionText.textContent = examData.question;

        // Start exam (create/get submission)
        const startResponse = await fetch(`/api/exams/${examId}/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rollNo: user.rollNo })
        });

        const startResult = await startResponse.json();

        if (!startResult.success) {
            alert(startResult.message);
            window.location.href = '/';
            return;
        }

        submissionId = startResult.submissionId;

        // Check if already submitted
        const submissionResponse = await fetch(`/api/exams/${examId}/submission/${user.rollNo}`);
        const submissionResult = await submissionResponse.json();

        if (submissionResult.submission) {
            const sub = submissionResult.submission;

            if (sub.status === 'SUBMITTED') {
                alert('You have already submitted this exam.');
                window.location.href = '/';
                return;
            }

            if (sub.status === 'DISQUALIFIED') {
                showDisqualification();
                return;
            }

            // Load existing code
            if (sub.html || sub.css || sub.javascript) {
                htmlCode.value = sub.html || '';
                cssCode.value = sub.css || '';
                jsCode.value = sub.javascript || '';
                updatePreview();
            }

            // Update violation counter
            if (sub.tabSwitchCount > 0) {
                violationCounter.style.display = 'block';
                violationCount.textContent = sub.tabSwitchCount;
                if (sub.tabSwitchCount >= 2) {
                    violationCounter.classList.add('warning');
                }
            }
        }

        // Initialize anti-cheating
        examProctor = new ExamProctor(examId, user.rollNo, {
            requireFullScreen: examData.requireFullScreen,
            allowCopyPaste: examData.allowCopyPaste,
            maxTabSwitches: examData.maxTabSwitches
        });

        // Start timer
        startTimer();

        // Start auto-save
        startAutoSave();

        // Enable code editors
        htmlCode.addEventListener('input', onCodeChange);
        cssCode.addEventListener('input', onCodeChange);
        jsCode.addEventListener('input', onCodeChange);

        // Submit button
        submitBtn.addEventListener('click', submitExam);

        // Tab support for editors
        [htmlCode, cssCode, jsCode].forEach(editor => {
            editor.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;
                    editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
                    editor.selectionStart = editor.selectionEnd = start + 2;
                }
            });
        });

        statusText.textContent = 'Exam started - Good luck!';

    } catch (error) {
        console.error('Init exam error:', error);
        alert('Failed to initialize exam. Please refresh the page.');
    }
}

// Start countdown timer
function startTimer() {
    const endTime = new Date(examData.endTime);

    timerInterval = setInterval(() => {
        const now = new Date();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
            return;
        }

        const minutes = Math.floor(timeLeft / 1000 / 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);

        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Warning when 5 minutes left
        if (minutes < 5) {
            document.getElementById('examTimer').classList.add('warning');
        }

        // Critical warning when 1 minute left
        if (minutes === 0 && seconds === 30) {
            examProctor.showCriticalWarning('⏰ 30 SECONDS REMAINING!');
        }
    }, 1000);
}

// Handle timeout
async function handleTimeout() {
    timerDisplay.textContent = '00:00';
    statusText.textContent = 'Time expired - Submitting...';

    await submitExam(true);
}

// Start auto-save (every 10 seconds)
function startAutoSave() {
    autoSaveInterval = setInterval(async () => {
        await saveCode();
    }, 10000); // 10 seconds
}

// On code change
function onCodeChange() {
    updatePreview();
}

// Update preview
function updatePreview() {
    const html = htmlCode.value;
    const css = cssCode.value;
    const js = jsCode.value;

    const output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        ${css}
      </style>
    </head>
    <body>
      ${html}
      <script>
        try {
          ${js}
        } catch (err) {
          console.error('Error:', err.message);
          document.body.innerHTML += '<div style="background: #ff4444; color: white; padding: 10px; margin: 10px; border-radius: 5px;">Error: ' + err.message + '</div>';
        }
      </script>
    </body>
    </html>
  `;

    preview.srcdoc = output;
}

// Save code to server
async function saveCode() {
    try {
        const response = await fetch('/api/exams/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rollNo: user.rollNo,
                examId: examId,
                html: htmlCode.value,
                css: cssCode.value,
                javascript: jsCode.value
            })
        });

        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Save error:', error);
        return false;
    }
}

// Submit exam
async function submitExam(isTimeout = false) {
    const confirmMsg = isTimeout
        ? 'Time is up. Your exam will be submitted now.'
        : 'Are you sure you want to submit? You cannot make changes after submission.';

    if (!isTimeout && !confirm(confirmMsg)) {
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Submitting...</span>';
    statusText.textContent = 'Submitting exam...';

    try {
        // Final save
        await saveCode();

        // Submit
        const response = await fetch(`/api/exams/${examId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rollNo: user.rollNo })
        });

        const result = await response.json();

        if (result.success) {
            // Stop timers
            clearInterval(timerInterval);
            clearInterval(autoSaveInterval);

            // Show success
            alert(`✅ Exam submitted successfully!\n\nTime spent: ${Math.floor(result.submission.timeSpent / 60)} minutes\nStatus: ${result.submission.status}`);

            // Redirect
            window.location.href = '/';
        } else {
            alert(`Failed to submit: ${result.message}`);
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Submit Exam
      `;
        }
    } catch (error) {
        console.error('Submit error:', error);
        alert('Failed to submit exam. Please try again.');
        submitBtn.disabled = false;
    }
}

// Show disqualification screen
function showDisqualification() {
    examProctor.handleDisqualification();
    clearInterval(timerInterval);
    clearInterval(autoSaveInterval);
}

// Prevent page close without submitting
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Your exam will not be submitted.';
});

// Disable Ctrl+W (close tab)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        alert('Please use the Submit button to end your exam.');
        return false;
    }
});

// Initialize on load
window.addEventListener('DOMContentLoaded', initExam);

console.log('🔒 Exam mode initialized');
console.log('📋 Exam ID:', examId);
console.log('👤 User:', user.rollNo);
