// AI-CAPTCHA Frontend Application

class AICaptcha {
    constructor() {
        this.level1SessionId = null;
        this.level2SessionId = null;
        this.currentScreen = 'start';
        
        this.init();
    }
    
    init() {
        // Get DOM elements
        this.screens = {
            start: document.getElementById('start-screen'),
            level1: document.getElementById('level1-screen'),
            level2: document.getElementById('level2-screen'),
            success: document.getElementById('success-screen'),
            failure: document.getElementById('failure-screen')
        };
        
        // Set up event listeners
        document.getElementById('start-btn').addEventListener('click', () => this.startChallenge());
        document.getElementById('level1-submit').addEventListener('click', () => this.submitLevel1());
        document.getElementById('level2-submit').addEventListener('click', () => this.submitLevel2());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('retry-btn').addEventListener('click', () => this.restart());
        
        // Allow Enter key to submit
        document.getElementById('level1-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitLevel1();
        });
        document.getElementById('level2-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitLevel2();
        });
    }
    
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
    }
    
    showFeedback(elementId, message, isSuccess) {
        const feedback = document.getElementById(elementId);
        feedback.textContent = message;
        feedback.className = 'feedback show ' + (isSuccess ? 'success' : 'error');
    }
    
    hideFeedback(elementId) {
        const feedback = document.getElementById(elementId);
        feedback.classList.remove('show');
    }
    
    async startChallenge() {
        this.showScreen('level1');
        await this.loadLevel1Challenge();
    }
    
    async loadLevel1Challenge() {
        try {
            const response = await fetch('/api/challenge/level1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load challenge');
            }
            
            const data = await response.json();
            this.level1SessionId = data.sessionId;
            document.getElementById('level1-question').textContent = data.question;
            document.getElementById('level1-answer').value = '';
            this.hideFeedback('level1-feedback');
        } catch (error) {
            console.error('Error loading Level 1 challenge:', error);
            this.showFeedback('level1-feedback', 'Error loading challenge. Please try again.', false);
        }
    }
    
    async submitLevel1() {
        const answer = document.getElementById('level1-answer').value.trim();
        
        if (!answer) {
            this.showFeedback('level1-feedback', 'Please enter an answer.', false);
            return;
        }
        
        try {
            const response = await fetch('/api/verify/level1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.level1SessionId,
                    answer: answer
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showFeedback('level1-feedback', data.message, true);
                // Wait a moment before moving to level 2
                setTimeout(() => {
                    this.showScreen('level2');
                    this.loadLevel2Challenge();
                }, 1500);
            } else {
                this.showFeedback('level1-feedback', data.message, false);
            }
        } catch (error) {
            console.error('Error verifying Level 1:', error);
            this.showFeedback('level1-feedback', 'Error verifying answer. Please try again.', false);
        }
    }
    
    async loadLevel2Challenge() {
        try {
            const response = await fetch('/api/challenge/level2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load challenge');
            }
            
            const data = await response.json();
            this.level2SessionId = data.sessionId;
            document.getElementById('level2-question').textContent = data.question;
            document.getElementById('level2-answer').value = '';
            this.hideFeedback('level2-feedback');
        } catch (error) {
            console.error('Error loading Level 2 challenge:', error);
            this.showFeedback('level2-feedback', 'Error loading challenge. Please try again.', false);
        }
    }
    
    async submitLevel2() {
        const answer = document.getElementById('level2-answer').value.trim();
        
        if (!answer) {
            this.showFeedback('level2-feedback', 'Please enter an answer.', false);
            return;
        }
        
        try {
            const response = await fetch('/api/verify/level2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.level2SessionId,
                    answer: answer
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showFeedback('level2-feedback', data.message, true);
                // Wait a moment before showing success screen
                setTimeout(() => {
                    this.showScreen('success');
                }, 1500);
            } else {
                this.showFeedback('level2-feedback', data.message, false);
                // Show failure screen after a moment
                setTimeout(() => {
                    this.showScreen('failure');
                }, 2000);
            }
        } catch (error) {
            console.error('Error verifying Level 2:', error);
            this.showFeedback('level2-feedback', 'Error verifying answer. Please try again.', false);
        }
    }
    
    restart() {
        this.level1SessionId = null;
        this.level2SessionId = null;
        document.getElementById('level1-answer').value = '';
        document.getElementById('level2-answer').value = '';
        this.hideFeedback('level1-feedback');
        this.hideFeedback('level2-feedback');
        this.showScreen('start');
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AICaptcha();
});
