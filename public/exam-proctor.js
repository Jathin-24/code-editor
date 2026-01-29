// Anti-Cheating & Exam Mode Script
// This script monitors user behavior and prevents cheating during exams

class ExamProctor {
    constructor(examId, rollNo, config = {}) {
        this.examId = examId;
        this.rollNo = rollNo;
        this.config = {
            requireFullScreen: true,
            allowCopyPaste: false,
            maxTabSwitches: 3,
            ...config
        };
        this.tabSwitchCount = 0;
        this.isActive = true;
        this.warningThreshold = 2;

        this.init();
    }

    init() {
        if (!this.config.allowCopyPaste) {
            this.preventCopyPaste();
        }
        this.preventRightClick();
        this.detectTabSwitch();
        this.detectDevTools();

        if (this.config.requireFullScreen) {
            this.enforceFullScreen();
        }

        this.preventScreenshot();
        this.monitorActivity();
    }

    // Prevent copy-paste
    preventCopyPaste() {
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            this.logActivity('COPY_ATTEMPT', 'Attempted to copy text', 'MEDIUM');
            this.showWarning('Copying is disabled during the exam!');
        });

        document.addEventListener('cut', (e) => {
            e.preventDefault();
            this.logActivity('COPY_ATTEMPT', 'Attempted to cut text', 'MEDIUM');
            this.showWarning('Cutting is disabled during the exam!');
        });

        document.addEventListener('paste', (e) => {
            e.preventDefault();
            this.logActivity('PASTE_ATTEMPT', 'Attempted to paste text', 'HIGH');
            this.showWarning('Pasting is disabled during the exam!');
        });
    }

    // Prevent right-click
    preventRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.logActivity('RIGHT_CLICK', 'Right-clicked', 'LOW');
            this.showWarning('Right-click is disabled during the exam!');
        });
    }

    // Detect tab switching and window blur
    detectTabSwitch() {
        let blurStartTime = null;

        window.addEventListener('blur', () => {
            blurStartTime = Date.now();
            this.tabSwitchCount++;

            const timeAway = blurStartTime ? (Date.now() - blurStartTime) / 1000 : 0;

            this.logActivity('WINDOW_BLUR', `Window lost focus (Switch #${this.tabSwitchCount})`, 'HIGH', {
                switchCount: this.tabSwitchCount,
                timeAway: timeAway
            });

            this.showCriticalWarning(`⚠️ TAB SWITCH DETECTED! (${this.tabSwitchCount}/3)<br>Do not switch tabs or you will be disqualified!`);
        });

        window.addEventListener('focus', () => {
            if (blurStartTime) {
                const timeAway = (Date.now() - blurStartTime) / 1000;
                this.logActivity('TAB_SWITCH', `Returned to exam after ${timeAway.toFixed(1)}s`, 'HIGH', {
                    timeAway: timeAway
                });
                blurStartTime = null;
            }
        });

        // Visibility API for more reliable detection
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logActivity('TAB_SWITCH', 'Tab became hidden', 'HIGH');
            }
        });
    }

    // Detect developer tools
    detectDevTools() {
        // Method 1: DevTools detection via timing
        let devtoolsOpen = false;
        const element = new Image();

        Object.defineProperty(element, 'id', {
            get: () => {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    this.logActivity('DEVTOOLS_OPENED', 'Developer tools opened', 'CRITICAL');
                    this.showCriticalWarning('⛔ DEVELOPER TOOLS DETECTED!<br>Close dev tools immediately or you will be disqualified!');
                }
            }
        });

        setInterval(() => {
            console.log('%c', element);
        }, 1000);

        // Method 2: Check for Firebug
        const checkFirebug = () => {
            if (window.firebug && window.firebug.chrome && window.firebug.chrome.isInitialized) {
                this.logActivity('DEVTOOLS_OPENED', 'Firebug detected', 'CRITICAL');
            }
        };
        setInterval(checkFirebug, 500);

        // Method 3: Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                this.logActivity('DEVTOOLS_OPENED', 'F12 pressed', 'HIGH');
                this.showWarning('Developer tools are disabled!');
                return false;
            }

            // Ctrl+Shift+I (Inspect)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.logActivity('DEVTOOLS_OPENED', 'Ctrl+Shift+I pressed', 'HIGH');
                this.showWarning('Inspect element is disabled!');
                return false;
            }

            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                this.logActivity('DEVTOOLS_OPENED', 'Ctrl+Shift+J pressed', 'HIGH');
                this.showWarning('Console is disabled!');
                return false;
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.logActivity('DEVTOOLS_OPENED', 'Ctrl+U pressed', 'HIGH');
                this.showWarning('View source is disabled!');
                return false;
            }
        });
    }

    // Enforce full-screen mode
    enforceFullScreen() {
        const overlayId = 'fullscreen-strict-overlay';

        const requestFullScreen = () => {
            const elem = document.documentElement;
            const request = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen;
            if (request) {
                request.call(elem).catch(err => {
                    console.error('Fullscreen request rejected:', err);
                });
            }
        };

        const showOverlay = () => {
            if (document.getElementById(overlayId)) return;

            const overlay = document.createElement('div');
            overlay.id = overlayId;
            overlay.className = 'fullscreen-overlay';
            overlay.innerHTML = `
                <div class="disqualification-icon">🖥️</div>
                <h1>FULLSCREEN REQUIRED</h1>
                <p>This exam must be taken in fullscreen mode to ensure integrity.</p>
                <p style="color: #ef4444; margin-top: 10px;">Interaction is disabled until you return to fullscreen.</p>
                <button id="returnFullscreenBtn">Return to Fullscreen</button>
            `;
            document.body.appendChild(overlay);

            document.getElementById('returnFullscreenBtn').onclick = () => {
                requestFullScreen();
            };
        };

        const removeOverlay = () => {
            const overlay = document.getElementById(overlayId);
            if (overlay) overlay.remove();
        };

        // Detect full-screen exit
        const handleFullscreenChange = () => {
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
            if (!isFullscreen && this.isActive) {
                this.logActivity('FULLSCREEN_EXIT', 'Exited fullscreen mode', 'HIGH');
                showOverlay();
            } else {
                removeOverlay();
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        // Initial request on first interaction if not already fullscreen
        window.addEventListener('click', () => {
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
            if (!isFullscreen && this.isActive) {
                showOverlay();
            }
        }, { once: true });
    }

    // Prevent screenshots (limited effectiveness)
    preventScreenshot() {
        // Windows: Print Screen detection
        document.addEventListener('keyup', (e) => {
            if (e.key === 'PrintScreen') {
                this.logActivity('SUSPICIOUS_ACTIVITY', 'Print Screen key pressed', 'HIGH');
                this.showWarning('Screenshots are not allowed!');
                // Clear clipboard
                navigator.clipboard.writeText('');
            }
        });

        // Cmd+Shift+3, Cmd+Shift+4 (Mac screenshots)
        document.addEventListener('keydown', (e) => {
            if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) {
                e.preventDefault();
                this.logActivity('SUSPICIOUS_ACTIVITY', 'Mac screenshot shortcut pressed', 'HIGH');
                this.showWarning('Screenshots are not allowed!');
                return false;
            }
        });
    }

    // Monitor continuous activity
    monitorActivity() {
        let lastActivity = Date.now();
        let inactivityWarned = false;

        const resetActivity = () => {
            lastActivity = Date.now();
            inactivityWarned = false;
        };

        // Track mouse and keyboard activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetActivity);
        });

        // Check for inactivity
        setInterval(() => {
            const inactiveTime = (Date.now() - lastActivity) / 1000 / 60; // minutes

            if (inactiveTime > 5 && !inactivityWarned) {
                this.logActivity('SUSPICIOUS_ACTIVITY', `Inactive for ${inactiveTime.toFixed(1)} minutes`, 'MEDIUM');
                inactivityWarned = true;
            }
        }, 60000); // Check every minute
    }

    // Log activity to server
    async logActivity(activityType, description, severity = 'LOW', metadata = {}) {
        try {
            const response = await fetch('/api/activity/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    rollNo: this.rollNo,
                    examId: this.examId,
                    activityType,
                    description,
                    severity,
                    metadata
                })
            });

            const data = await response.json();

            if (data.disqualified) {
                this.handleDisqualification();
            } else if (data.warning) {
                this.showCriticalWarning(data.warning);
            }
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    }

    // Show warning message
    showWarning(message) {
        this.showToast(message, 'warning');
    }

    // Show critical warning
    showCriticalWarning(message) {
        this.showToast(message, 'critical');
    }

    // Show toast notification
    showToast(message, type = 'warning') {
        // Remove existing toast
        const existingToast = document.querySelector('.exam-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `exam-toast exam-toast-${type}`;
        toast.innerHTML = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, type === 'critical' ? 5000 : 3000);
    }

    // Handle disqualification
    handleDisqualification() {
        this.isActive = false;

        // Show disqualification overlay
        const overlay = document.createElement('div');
        overlay.className = 'disqualification-overlay';
        overlay.innerHTML = `
      <div class="disqualification-content">
        <div class="disqualification-icon">⛔</div>
        <h1>DISQUALIFIED</h1>
        <p>You have been disqualified from this exam due to multiple violations.</p>
        <p>Your submission has been automatically locked.</p>
        <button onclick="window.location.href='/'">Return to Home</button>
      </div>
    `;
        document.body.appendChild(overlay);

        // Disable all inputs
        document.querySelectorAll('textarea, input, button').forEach(el => {
            if (el.tagName !== 'BUTTON' || !el.onclick) {
                el.disabled = true;
            }
        });
    }
}

// Export for use in exam mode
window.ExamProctor = ExamProctor;
