// Admin Panel JavaScript

// Check for admin token
const adminToken = localStorage.getItem('adminToken');
const adminUser = localStorage.getItem('adminUser');
let allStudents = []; // Cache for filtering

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
    } else if (tabId === 'students') {
      loadStudents();
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

          <div style="margin-top: 12px; padding: 12px; background: var(--admin-bg); border-radius: 8px; border: 1px solid var(--border-subtle);">
            <strong style="color: white; font-size: 13px;">Question Preview:</strong>
            <p style="color: var(--text-gray); margin-top: 8px; font-size: 13px;">${exam.question.substring(0, 150)}${exam.question.length > 150 ? '...' : ''}</p>
          </div>

          <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn-view" onclick="viewSubmissions('${exam._id}')">View Submissions</button>
            <button class="btn-view" onclick="copyExamLink('${exam._id}')">📋 Copy Link</button>
            <button class="btn-view" onclick="openEditModal('${exam._id}')" style="border-color: #f59e0b; color: #f59e0b; background: rgba(245, 158, 11, 0.1);">Edit</button>
            <button class="btn-view" onclick="deleteExam('${exam._id}')" style="border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1);">Delete</button>
          </div>
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
  const submissionsList = document.getElementById('submissionsList');
  const summary = document.getElementById('submissionSummary');
  const refreshBtn = document.getElementById('refreshSubmissionsBtn');
  const infoHeader = document.querySelector('#submissions h2');

  if (examId) {
    infoHeader.innerHTML = 'Exam Submissions <span style="font-size: 14px; font-weight: normal; color: var(--primary-blue); margin-left: 10px;">(Filtered by Exam)</span>';
    loadSubmissions(examId);
    if (refreshBtn) refreshBtn.style.display = 'block';
  } else {
    infoHeader.innerHTML = 'Exam Submissions <span style="font-size: 14px; font-weight: normal; color: var(--text-gray); margin-left: 10px;">(Overall History)</span>';
    loadOverallStats();
    submissionsList.innerHTML = '<div style="text-align: center; padding: 60px; color: var(--text-gray);"><div style="font-size: 48px; margin-bottom: 20px;">📂</div><p>Select an exam above to view specific student records</p></div>';
    if (refreshBtn) refreshBtn.style.display = 'none';
  }
});

async function loadOverallStats() {
  try {
    const response = await fetch('/api/admin/stats/overall', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const result = await response.json();
    const summary = document.getElementById('submissionSummary');

    if (result.success) {
      const { total, submitted, disqualified, inProgress } = result.stats;
      summary.style.display = 'grid';
      summary.innerHTML = `
        <div class="summary-card">
          <div class="summary-icon" style="background: rgba(102, 126, 234, 0.1); color: #667eea;">📊</div>
          <div class="summary-info">
            <h4>Total Records</h4>
            <div class="value">${total}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">⏳</div>
          <div class="summary-info">
            <h4>In Progress</h4>
            <div class="value">${inProgress}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;">✅</div>
          <div class="summary-info">
            <h4>Submitted</h4>
            <div class="value">${submitted}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">⚠️</div>
          <div class="summary-info">
            <h4>Disqualified</h4>
            <div class="value">${disqualified}</div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Fetch overall stats error:', error);
  }
}

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
    const summary = document.getElementById('submissionSummary');

    if (result.success && result.submissions.length > 0) {
      // Calculate Stats
      const total = result.submissions.length;
      const completed = result.submissions.filter(s => s.status === 'SUBMITTED').length;
      const disqualified = result.submissions.filter(s => s.status === 'DISQUALIFIED').length;
      const underway = result.submissions.filter(s => s.status === 'IN_PROGRESS').length;

      // Update Summary Banner
      summary.style.display = 'grid';
      summary.innerHTML = `
        <div class="summary-card">
          <div class="summary-icon" style="background: rgba(102, 126, 234, 0.1); color: #667eea;">👥</div>
          <div class="summary-info">
            <h4>Total Attempted</h4>
            <div class="value">${total}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">⏳</div>
          <div class="summary-info">
            <h4>In Progress</h4>
            <div class="value">${underway}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;">✅</div>
          <div class="summary-info">
            <h4>Submitted</h4>
            <div class="value">${completed}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">⚠️</div>
          <div class="summary-info">
            <h4>Disqualified</h4>
            <div class="value">${disqualified}</div>
          </div>
        </div>
      `;

      submissionsList.innerHTML = result.submissions.map(sub => {
        const chipClass = sub.status === 'SUBMITTED' ? 'status-submitted-chip' :
          sub.status === 'DISQUALIFIED' ? 'status-disqualified-chip' :
            'status-progress-chip';

        const timeSpent = Math.floor(sub.timeSpent / 60);
        const submittedAt = sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Not submitted';

        return `
          <div class="submission-card" style="padding: 24px; background: var(--card-bg); border: 1px solid var(--border-subtle); border-radius: 12px; transition: transform 0.2s;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
              <div>
                <h3 style="margin: 0; font-size: 20px; color: white;">${sub.userId?.name || 'Unknown Student'}</h3>
                <div style="color: var(--text-gray); font-size: 14px; margin-top: 4px;">🆔 ${sub.rollNo}</div>
              </div>
              <span class="stat-badge" style="background: rgba(102, 126, 234, 0.1); color: var(--primary-blue); font-size: 11px; text-transform: uppercase;">
                ${sub.status}
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 20px;">
              <div class="stat-badge">
                <span style="color: var(--text-gray); font-size: 11px; display: block; margin-bottom: 2px;">⌛ TIME SPENT</span>
                <span style="color: white; font-weight: 600;">${timeSpent} minutes</span>
              </div>
              <div class="stat-badge">
                <span style="color: var(--text-gray); font-size: 11px; display: block; margin-bottom: 2px;">🖱️ TAB SWITCHES</span>
                <span style="color: ${sub.tabSwitchCount >= 3 ? '#ef4444' : '#22c55e'}; font-weight: 600;">${sub.tabSwitchCount} times</span>
              </div>
              <div class="stat-badge">
                <span style="color: var(--text-gray); font-size: 11px; display: block; margin-bottom: 2px;">📅 SUBMITTED AT</span>
                <span style="color: white; font-weight: 500; font-size: 13px;">${submittedAt}</span>
              </div>
            </div>

            ${sub.cheatingFlags && sub.cheatingFlags.length > 0 ? `
              <div style="margin-top: 12px; padding: 12px; background: var(--admin-bg); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);">
                <strong style="color: #ef4444; font-size: 12px;">VIOLATIONS DETECTED (${sub.cheatingFlags.length}):</strong>
                <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
                  ${sub.cheatingFlags.slice(0, 3).map(flag => `
                    <div style="color: var(--text-gray); font-size: 12px;">• ${flag.type.replace(/_/g, ' ')} at ${new Date(flag.timestamp).toLocaleTimeString()}</div>
                  `).join('')}
                  ${sub.cheatingFlags.length > 3 ? '<div style="color: var(--text-gray); font-size: 11px; margin-top: 2px;">...and more flags</div>' : ''}
                </div>
              </div>
            ` : ''}

            <div style="margin-top: 20px;">
              <button class="btn-view" onclick="viewCode('${sub._id}', '${sub.rollNo}')" style="width: 100%;">
                👁️ Inspect Code & Session
              </button>
            </div>
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
              <div style="background: var(--card-bg); border: 1px solid var(--border-subtle); border-left: 4px solid ${severityColor}; padding: 16px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                  <strong style="color: white;">${log.activityType.replace(/_/g, ' ')}</strong>
                  <span style="background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px; font-size: 11px; color: ${severityColor}; font-weight: 600;">
                    ${log.severity}
                  </span>
                </div>
                <p style="color: var(--text-gray); font-size: 13px; margin-bottom: 8px;">
                  ${log.description}
                </p>
                <span style="color: #4B5563; font-size: 11px;">
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

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadExams();
  loadOverallStats();
});

console.log('📊 Admin panel initialized');
// --- Edit/Delete Logic ---

let currentExams = []; // To store exams locally for quick editing

async function openEditModal(examId) {
  try {
    const response = await fetch(`/api/exams/${examId}`);
    const result = await response.json();

    if (result.success) {
      const exam = result.exam;
      document.getElementById('editExamId').value = exam._id;
      document.getElementById('editTitle').value = exam.title;
      document.getElementById('editDescription').value = exam.description;
      document.getElementById('editDuration').value = exam.duration;
      document.getElementById('editQuestion').value = exam.question;
      document.getElementById('editStartTime').value = formatDateTimeLocal(new Date(exam.startTime));
      document.getElementById('editEndTime').value = formatDateTimeLocal(new Date(exam.endTime));
      document.getElementById('editMaxTabSwitches').value = exam.maxTabSwitches;
      document.getElementById('editRequireFullScreen').checked = exam.requireFullScreen;
      document.getElementById('editAllowCopyPaste').checked = exam.allowCopyPaste;

      document.getElementById('editExamModal').style.display = 'flex';
    }
  } catch (error) {
    console.error('Error fetching exam for edit:', error);
    alert('Failed to load exam details');
  }
}

function closeEditModal() {
  document.getElementById('editExamModal').style.display = 'none';
}

document.getElementById('editExamForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const examId = document.getElementById('editExamId').value;

  const formData = {
    title: document.getElementById('editTitle').value,
    description: document.getElementById('editDescription').value,
    duration: parseInt(document.getElementById('editDuration').value),
    question: document.getElementById('editQuestion').value,
    startTime: new Date(document.getElementById('editStartTime').value),
    endTime: new Date(document.getElementById('editEndTime').value),
    maxTabSwitches: parseInt(document.getElementById('editMaxTabSwitches').value),
    requireFullScreen: document.getElementById('editRequireFullScreen').checked,
    allowCopyPaste: document.getElementById('editAllowCopyPaste').checked
  };

  try {
    const response = await fetch(`/api/admin/exams/${examId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (result.success) {
      alert('✅ Exam updated successfully!');
      closeEditModal();
      loadExams(); // Refresh list
    } else {
      alert('Update failed: ' + result.message);
    }
  } catch (error) {
    console.error('Update error:', error);
    alert('Failed to update exam');
  }
});

async function deleteExam(examId) {
  if (!confirm('⚠️ Are you sure? This will delete the exam and ALL student submissions. This cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch(`/api/admin/exams/${examId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    const result = await response.json();
    if (result.success) {
      alert('🗑️ Exam deleted successfully');
      loadExams(); // Refresh list
    } else {
      alert('Delete failed: ' + result.message);
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete exam');
  }
}

function refreshCurrentExam() {
  const examId = document.getElementById('submissionExamSelect').value;
  if (examId) {
    loadSubmissions(examId);
  }
}
async function loadStudents() {
  const studentsList = document.getElementById('studentsList');
  if (!studentsList) return;

  studentsList.innerHTML = '<p style="color: var(--text-secondary);">Scanning student directory...</p>';

  try {
    const response = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const result = await response.json();

    if (result.success && result.users.length > 0) {
      allStudents = result.users; // Cache for filtering
      renderStudents(allStudents);
    } else {
      studentsList.innerHTML = '<p style="color: var(--text-secondary);">No students registered yet.</p>';
    }
  } catch (error) {
    console.error('Load students error:', error);
    studentsList.innerHTML = '<p style="color: #ef4444;">Failed to load students directory.</p>';
  }
}

function renderStudents(students) {
  const studentsList = document.getElementById('studentsList');
  if (!studentsList) return;

  if (students.length === 0) {
    studentsList.innerHTML = '<p style="color: var(--text-secondary);">No students found matching your search.</p>';
    return;
  }

  studentsList.innerHTML = students.map(student => `
    <div class="student-card">
      <div class="student-info">
        <h3 style="font-size: 18px; margin-bottom: 4px; color: var(--text-primary);">${student.name}</h3>
        <div class="student-meta" style="font-size: 13px; color: var(--text-secondary);">
          <span>🆔 ${student.rollNo}</span> • 
          <span>🕒 Last active: ${new Date(student.lastLogin).toLocaleString()}</span>
        </div>
      </div>
      <div class="student-stats" style="display: flex; gap: 16px;">
        <div class="stat-badge" title="Total Exams Attempted" style="padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; background: rgba(255, 255, 255, 0.05); color: var(--text-secondary);">
          📚 ${student.stats.total} Attempted
        </div>
        <div class="stat-badge" title="Successfully Submitted" style="padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; color: #22c55e; background: rgba(34, 197, 94, 0.1);">
          ✅ ${student.stats.completed} Done
        </div>
        <div class="stat-badge" title="Disqualified for cheating" style="padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; color: #ef4444; background: rgba(239, 68, 68, 0.1);">
          ⚠️ ${student.stats.disqualified} Disqualified
        </div>
        <button class="btn-view" onclick="viewStudentLogs('${student.rollNo}')" style="margin-left: 12px; font-size: 12px; padding: 6px 12px;">Logs</button>
      </div>
    </div>
  `).join('');
}

function filterStudents() {
  const query = document.getElementById('studentSearch').value.toLowerCase();
  const filtered = allStudents.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.rollNo.toLowerCase().includes(query)
  );
  renderStudents(filtered);
}

function viewStudentLogs(rollNo) {
  // Switch to logs tab and fill roll number
  document.querySelector('.admin-tab[data-tab="logs"]').click();
  const logInput = document.getElementById('logRollNo');
  if (logInput) {
    logInput.value = rollNo;
    loadLogs();
  }
}
