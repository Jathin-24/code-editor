// Check if user is logged in
const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    window.location.href = '/';
}

// DOM Elements
const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const jsCode = document.getElementById('jsCode');
const preview = document.getElementById('preview');
const saveBtn = document.getElementById('saveBtn');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const lastSavedText = document.getElementById('lastSaved');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userRoll = document.getElementById('userRoll');

// Display user info
if (user) {
    userAvatar.textContent = user.name.charAt(0).toUpperCase();
    userName.textContent = user.name;
    userRoll.textContent = user.rollNo;
}

// Auto-save timer
let autoSaveTimer;
const AUTO_SAVE_DELAY = 3000; // 3 seconds after user stops typing

// Load user's saved code
async function loadCode() {
    try {
        setStatus('loading', 'Loading your code...');

        const response = await fetch(`/api/project/${user.rollNo}`);
        const data = await response.json();

        if (data.success) {
            htmlCode.value = data.project.html || '';
            cssCode.value = data.project.css || '';
            jsCode.value = data.project.javascript || '';

            updatePreview();

            const lastUpdated = new Date(data.project.updatedAt);
            updateLastSaved(lastUpdated);

            setStatus('success', 'Code loaded successfully');
            setTimeout(() => setStatus('ready', 'Ready'), 2000);
        } else {
            setStatus('error', 'Failed to load code');
        }
    } catch (error) {
        console.error('Load error:', error);
        setStatus('error', 'Connection error');

        // Load default code if fetch fails
        htmlCode.value = '<!-- Write your HTML here -->\n<h1>Hello World!</h1>\n<p>Start coding!</p>';
        cssCode.value = '/* Write your CSS here */\nbody {\n  font-family: Arial, sans-serif;\n  padding: 20px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n  color: white;\n}\n\nh1 {\n  font-size: 3em;\n  margin-bottom: 0.5em;\n}';
        jsCode.value = '// Write your JavaScript here\nconsole.log("Hello from JavaScript!");\n\n// Example: Change text on click\ndocument.addEventListener("DOMContentLoaded", function() {\n  const h1 = document.querySelector("h1");\n  if (h1) {\n    h1.addEventListener("click", function() {\n      this.textContent = "You clicked me!";\n      this.style.transform = "scale(1.1)";\n      setTimeout(() => {\n        this.style.transform = "scale(1)";\n      }, 200);\n    });\n  }\n});';
        updatePreview();
    }
}

// Update preview iframe
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
        /* Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        /* User CSS */
        ${css}
      </style>
    </head>
    <body>
      ${html}
      <script>
        // Error handling
        window.addEventListener('error', function(e) {
          console.error('Error:', e.message);
        });
        
        // User JavaScript
        try {
          ${js}
        } catch (err) {
          console.error('JavaScript Error:', err.message);
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
        setStatus('saving', 'Saving...');
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      </svg>
      Saving...
    `;

        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rollNo: user.rollNo,
                html: htmlCode.value,
                css: cssCode.value,
                javascript: jsCode.value
            })
        });

        const data = await response.json();

        if (data.success) {
            setStatus('success', 'Saved successfully!');
            updateLastSaved(new Date(data.updatedAt));

            setTimeout(() => {
                setStatus('ready', 'Ready');
            }, 2000);
        } else {
            setStatus('error', 'Save failed');
        }
    } catch (error) {
        console.error('Save error:', error);
        setStatus('error', 'Connection error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Save Code
    `;
    }
}

// Set status in status bar
function setStatus(type, message) {
    statusText.textContent = message;

    switch (type) {
        case 'ready':
            statusIndicator.style.color = '#22c55e';
            break;
        case 'saving':
        case 'loading':
            statusIndicator.style.color = '#f59e0b';
            break;
        case 'success':
            statusIndicator.style.color = '#22c55e';
            break;
        case 'error':
            statusIndicator.style.color = '#ef4444';
            break;
    }
}

// Update last saved time
function updateLastSaved(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    let timeText;
    if (diff < 60) {
        timeText = 'Just now';
    } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        timeText = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        timeText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        timeText = date.toLocaleDateString();
    }

    lastSavedText.textContent = `Last saved: ${timeText}`;
}

// Auto-save functionality
function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    setStatus('ready', 'Typing...');

    autoSaveTimer = setTimeout(() => {
        saveCode();
    }, AUTO_SAVE_DELAY);
}

// Event Listeners

// Update preview on code change
htmlCode.addEventListener('input', () => {
    updatePreview();
    scheduleAutoSave();
});

cssCode.addEventListener('input', () => {
    updatePreview();
    scheduleAutoSave();
});

jsCode.addEventListener('input', () => {
    updatePreview();
    scheduleAutoSave();
});

// Manual save
saveBtn.addEventListener('click', () => {
    clearTimeout(autoSaveTimer);
    saveCode();
});

// Refresh preview
refreshBtn.addEventListener('click', () => {
    updatePreview();
    refreshBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
    }, 300);
});

// Logout
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout? Unsaved changes will be lost.')) {
        localStorage.removeItem('user');
        window.location.href = '/';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        clearTimeout(autoSaveTimer);
        saveCode();
    }

    // Ctrl/Cmd + R to refresh preview
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        updatePreview();
    }
});

// Tab key support in textareas
[htmlCode, cssCode, jsCode].forEach(editor => {
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();

            const start = editor.selectionStart;
            const end = editor.selectionEnd;

            // Insert tab (2 spaces)
            editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);

            // Move cursor
            editor.selectionStart = editor.selectionEnd = start + 2;
        }
    });
});

// Prevent accidental page close with unsaved changes
let hasUnsavedChanges = false;

[htmlCode, cssCode, jsCode].forEach(editor => {
    editor.addEventListener('input', () => {
        hasUnsavedChanges = true;
    });
});

saveBtn.addEventListener('click', () => {
    hasUnsavedChanges = false;
});

window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Initialize - Load code when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadCode();
});

// Update "last saved" time every minute
setInterval(() => {
    const lastSavedStr = lastSavedText.textContent;
    if (lastSavedStr !== 'Never saved' && lastSavedStr.includes('ago')) {
        // Trigger a re-render of the time
        const match = lastSavedStr.match(/(\d+) (minute|hour)/);
        if (match) {
            // This will be updated on next save
        }
    }
}, 60000);

console.log('✅ Code Editor initialized');
console.log(`👤 Logged in as: ${user.name} (${user.rollNo})`);
