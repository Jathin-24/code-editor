// Admin Panel JavaScript

// Check for admin token
const adminToken = localStorage.getItem('adminToken');
const adminUser = localStorage.getItem('adminUser');

if (!adminToken) {
  window.location.href = '/admin-login.html';
}

// Set admin name
if (adminUser && document.getElementById('adminName')) {
  document.getElementById('adminName').textContent = adminUser;
}

// Admin logout
function adminLogout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/admin-login.html';
}

// Tab switching
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active from all tabs
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    // Add active to clicked tab
    tab.classList.add('active');
    const tabId = tab.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');

    // Load data when switching tabs
    if (tabId === 'exams') {
      loadExams();
    }
  });
});

// Create Exam Form
document.getElementById('createExamForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    question: document.getElementById('question').value,
    duration: parseInt(document.getElementById('duration').value),
    startTime: new Date(document.getElementById('startTime').value),
    endTime: new Date(document.getElementById('endTime').value),
    maxTabSwitches: parseInt(document.getElementById('maxTabSwitches').value),
    requireFullScreen: document.getElementById('requireFullScreen').checked,
    allowCopyPaste: document.getElementById('allowCopyPaste').checked
  };

  try {
    const response = await fetch('/api/admin/exams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      alert('✅ Exam created successfully!');
      document.getElementById('createExamForm').reset();

      // Set default times for next exam
      setDefaultTimes();
    } else {
      alert('Failed to create exam: ' + result.message);
    }
  } catch (error) {
    console.error('Create exam error:', error);
    alert('Failed to create exam. Please try again.');
  }
});

// Set default start/end times
function setDefaultTimes() {
  const now = new Date();
  const startTime = new Date(now.getTime()); // Right now
  const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours after start

  document.getElementById('startTime').value = formatDateTimeLocal(startTime);
  document.getElementById('endTime').value = formatDateTimeLocal(endTime);
}

function setToNow(fieldId) {
  document.getElementById(fieldId).value = formatDateTimeLocal(new Date());
}

function setDuration(mins) {
  document.getElementById('duration').value = mins;
}

function addTime(fieldId, minutes) {
  const currentVal = document.getElementById(fieldId).value;
  const baseDate = currentVal ? new Date(currentVal) : new Date();
  const newDate = new Date(baseDate.getTime() + minutes * 60 * 1000);
  document.getElementById(fieldId).value = formatDateTimeLocal(newDate);
}

function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Load exams
async function loadExams() {
  try {
    const response = await fetch('/api/admin/exams', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const result = await response.json();

    const examsList = document.getElementById('examsList');
    const submissionExamSelect = document.getElementById('submissionExamSelect');

    if (result.success && result.exams.length > 0) {
      // Sort: Latest first
      const sortedExams = result.exams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Display in exams tab
      examsList.innerHTML = sortedExams.map(exam => `
        <div class="exam-card">
          <h3>${exam.title}</h3>
          <p style="color: var(--text-secondary); margin-bottom: 12px;">${exam.description}</p>
          
          <div class="exam-meta">
            <span>⏱️ ${exam.duration} minutes</span>
            <span>📅 ${new Date(exam.startTime).toLocaleString()}</span>
            <span>🔒 Max Switches: ${exam.maxTabSwitches}</span>
          </div>

          <div style="margin-top: 12px; padding: 12px; background: var(--bg-panel); border-radius: 8px;">
            <strong style="color: var(--text-primary);">Question:</strong>
            <p style="color: var(--text-secondary); margin-top: 8px;">${exam.question}</p>
          </div>

          <button class="btn-view" onclick="viewSubmissions('${exam._id}')">View Submissions</button>
          <button class="btn-view" onclick="copyExamLink('${exam._id}')" style="margin-left: 8px;">📋 Copy Exam Link</button>
        </div>
      `).join('');

      // Add to submissions dropdown
      submissionExamSelect.innerHTML = '<option value="">Select an exam...</option>' +
        result.exams.map(exam => `
          <option value="${exam._id}">${exam.title}</option>
        `).join('');

    } else {
      examsList.innerHTML = '<p style="color: var(--text-secondary);">No exams available</p>';
    }
  } catch (error) {
    console.error('Load exams error:', error);
    document.getElementById('examsList').innerHTML = '<p style="color: #ef4444;">Failed to load exams</p>';
  }
}

// Copy exam link
function copyExamLink(examId) {
  const link = `${window.location.origin}/exam.html?examId=${examId}`;
  navigator.clipboard.writeText(link);
  alert('✅ Exam link copied to clipboard!\n\n' + link);
}

// View submissions for a specific exam
async function viewSubmissions(examId) {
  document.getElementById('submissionExamSelect').value = examId;
  await loadSubmissions(examId);

  // Switch to submissions tab
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-tab="submissions"]').classList.add('active');
  document.getElementById('submissions').classList.add('active');
}

// Load submissions when exam is selected
document.getElementById('submissionExamSelect').addEventListener('change', (e) => {
  const examId = e.target.value;
  if (examId) {
    loadSubmissions(examId);
  } else {
    document.getElementById('submissionsList').innerHTML = '<p style="color: var(--text-secondary);">Select an exam to view submissions</p>';
  }
});

// Load submissions
async function loadSubmissions(examId) {
  try {
    const response = await fetch(`/api/admin/exams/${examId}/submissions`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const result = await response.json();

    const submissionsList = document.getElementById('submissionsList');

    if (result.success && result.submissions.length > 0) {
      submissionsList.innerHTML = result.submissions.map(sub => {
        const statusClass = sub.status === 'SUBMITTED' ? 'status-submitted' :
          sub.status === 'DISQUALIFIED' ? 'status-disqualified' :
            'status-in-progress';

        const timeSpent = Math.floor(sub.timeSpent / 60);
        const submittedAt = sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Not submitted';

        return `
          <div class="submission-card">
            <div class="submission-header">
              <div>
                <div class="submission-student">${sub.userId.name}</div>
                <div style="color: var(--text-muted); font-size: 14px;">${sub.rollNo}</div>
              </div>
              <div class="submission-status ${statusClass}">
                ${sub.status}
              </div>
            </div>

            <div class="submission-details">
              <div class="detail-item">
                <div class="detail-label">Time Spent</div>
                <div class="detail-value">${timeSpent} min</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Tab Switches</div>
                <div class="detail-value" style="color: ${sub.tabSwitchCount >= 3 ? '#ef4444' : '#22c55e'}">
                  ${sub.tabSwitchCount}
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Submitted At</div>
                <div class="detail-value" style="font-size: 13px;">${submittedAt}</div>
              </div>
            </div>

            ${sub.cheatingFlags && sub.cheatingFlags.length > 0 ? `
              <div class="cheating-flags">
                <strong style="color: #ef4444; font-size: 14px;">⚠️ Violations (${sub.cheatingFlags.length}):</strong>
                ${sub.cheatingFlags.slice(0, 5).map(flag => `
                  <div class="flag-item">
                    ${flag.type.replace(/_/g, ' ')} - ${new Date(flag.timestamp).toLocaleTimeString()}
                  </div>
                `).join('')}
                ${sub.cheatingFlags.length > 5 ? '<div class="flag-item">...and more</div>' : ''}
              </div>
            ` : ''}

            <button class="btn-view" onclick="viewCode('${sub._id}', '${sub.rollNo}')" style="margin-top: 16px;">
              👁️ View Code
            </button>
          </div>
        `;
      }).join('');
    } else {
      submissionsList.innerHTML = '<p style="color: var(--text-secondary);">No submissions yet</p>';
    }
  } catch (error) {
    console.error('Load submissions error:', error);
    document.getElementById('submissionsList').innerHTML = '<p style="color: #ef4444;">Failed to load submissions</p>';
  }
}

// View student code
function viewCode(submissionId, rollNo) {
  window.open(`/review.html?id=${submissionId}`, '_blank');
}

// Load activity logs
async function loadLogs() {
  const rollNo = document.getElementById('logRollNo').value.trim();

  if (!rollNo) {
    alert('Please enter a roll number');
    return;
  }

  try {
    const response = await fetch(`/api/admin/logs/${rollNo}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const result = await response.json();

    const logsList = document.getElementById('logsList');

    if (result.success && result.logs.length > 0) {
      logsList.innerHTML = `
        <h3 style="color: var(--text-primary); margin-bottom: 16px;">
          Activity Log for ${rollNo} (${result.logs.length} entries)
        </h3>
        <div style="display: grid; gap: 12px;">
          ${result.logs.map(log => {
        const severityColor = log.severity === 'CRITICAL' ? '#ef4444' :
          log.severity === 'HIGH' ? '#f59e0b' :
            log.severity === 'MEDIUM' ? '#3b82f6' : '#22c55e';

        return `
              <div style="background: var(--bg-secondary); border-left: 4px solid ${severityColor}; padding: 16px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                  <strong style="color: var(--text-primary);">${log.activityType.replace(/_/g, ' ')}</strong>
                  <span style="background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 12px; font-size: 12px; color: ${severityColor};">
                    ${log.severity}
                  </span>
                </div>
                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">
                  ${log.description}
                </p>
                <span style="color: var(--text-muted); font-size: 12px;">
                  ${new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            `;
      }).join('')}
        </div>
      `;
    } else {
      logsList.innerHTML = '<p style="color: var(--text-secondary);">No activity logs found for this roll number</p>';
    }
  } catch (error) {
    console.error('Load logs error:', error);
    document.getElementById('logsList').innerHTML = '<p style="color: #ef4444;">Failed to load logs</p>';
  }
}

// Initialize with default times
setDefaultTimes();

// Load exams on page load
window.addEventListener('DOMContentLoaded', () => {
  loadExams();
});

console.log('📊 Admin panel initialized');
