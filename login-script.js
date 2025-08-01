// Login Page JavaScript
class LoginManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupPasswordToggle();
    }

    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.closest('#loginForm')) {
                    this.handleLogin();
                }
            }
        });

        // Forgot password link
        const forgotPasswordLink = document.querySelector('.forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    }

    setupPasswordToggle() {
        const passwordToggle = document.getElementById('passwordToggle');
        const passwordInput = document.getElementById('password');

        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = passwordToggle.querySelector('i');
                if (icon) {
                    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                }
            });
        }
    }

    checkAuthStatus() {
        // Check if user is already logged in
        const authToken = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (authToken && userData) {
            // User is already logged in, redirect to dashboard
            this.redirectToDashboard();
        }
    }

    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate inputs
        if (!this.validateInputs(username, password)) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call delay
            await this.simulateApiCall();

            // Check credentials (demo accounts)
            const user = this.authenticateUser(username, password);

            if (user) {
                // Login successful
                this.loginSuccess(user, rememberMe);
            } else {
                // Login failed
                this.loginFailed();
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateInputs(username, password) {
        let isValid = true;

        // Clear previous errors
        this.clearErrors();

        // Validate username
        if (!username) {
            this.showFieldError('username', 'Vui lòng nhập tên đăng nhập');
            isValid = false;
        } else if (username.length < 3) {
            this.showFieldError('username', 'Tên đăng nhập phải có ít nhất 3 ký tự');
            isValid = false;
        }

        // Validate password
        if (!password) {
            this.showFieldError('password', 'Vui lòng nhập mật khẩu');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError('password', 'Mật khẩu phải có ít nhất 6 ký tự');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('error');
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearErrors() {
        // Remove error classes
        document.querySelectorAll('.form-control.error').forEach(field => {
            field.classList.remove('error');
        });

        // Remove error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }

    authenticateUser(username, password) {
        // Demo user accounts
        const users = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                name: 'Administrator',
                role: 'admin',
                email: 'admin@example.com',
                avatar: 'https://via.placeholder.com/40'
            },
            {
                id: 2,
                username: 'user',
                password: 'user123',
                name: 'Regular User',
                role: 'user',
                email: 'user@example.com',
                avatar: 'https://via.placeholder.com/40'
            },
            {
                id: 3,
                username: 'moderator',
                password: 'mod123',
                name: 'Moderator',
                role: 'moderator',
                email: 'mod@example.com',
                avatar: 'https://via.placeholder.com/40'
            }
        ];

        return users.find(user => 
            user.username.toLowerCase() === username.toLowerCase() && 
            user.password === password
        );
    }

    async simulateApiCall() {
        // Simulate network delay
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }

    loginSuccess(user, rememberMe) {
        // Create auth token
        const authToken = this.generateAuthToken(user);
        
        // Store user data
        const userData = {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            email: user.email,
            avatar: user.avatar,
            loginTime: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }

        // Show success message
        this.showNotification(`Chào mừng ${user.name}!`, 'success');

        // Add success animation
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            loginCard.classList.add('success');
        }

        // Redirect to dashboard after delay
        setTimeout(() => {
            this.redirectToDashboard();
        }, 1000);
    }

    loginFailed() {
        this.showNotification('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
        
        // Clear password field
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.value = '';
            passwordField.focus();
        }
    }

    generateAuthToken(user) {
        // Simple token generation (in real app, use JWT)
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2);
        return btoa(`${user.id}:${user.username}:${timestamp}:${randomString}`);
    }

    redirectToDashboard() {
        window.location.href = 'index.html';
    }

    setLoadingState(isLoading) {
        const loginBtn = document.getElementById('loginBtn');
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');

        if (loginBtn) {
            if (isLoading) {
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;
            } else {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }

        // Disable/enable form fields
        [usernameField, passwordField].forEach(field => {
            if (field) {
                field.disabled = isLoading;
            }
        });
    }

    handleForgotPassword() {
        this.showNotification('Tính năng quên mật khẩu sẽ được phát triển sau!', 'info');
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getNotificationIcon(type);
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            });
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loginManager = new LoginManager();
});

// Prevent form submission on Enter key in specific fields
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.type === 'checkbox') {
            e.preventDefault();
            activeElement.checked = !activeElement.checked;
        }
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add focus effects to form fields
    const formFields = document.querySelectorAll('.form-control');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            field.parentNode.classList.add('focused');
        });

        field.addEventListener('blur', () => {
            field.parentNode.classList.remove('focused');
        });
    });

    // Add hover effects to demo accounts
    const demoAccounts = document.querySelectorAll('.demo-account');
    demoAccounts.forEach(account => {
        account.addEventListener('click', () => {
            const text = account.textContent;
            const [role, credentials] = text.split(':');
            const [username, password] = credentials.trim().split(' / ');
            
            // Auto-fill form
            const usernameField = document.getElementById('username');
            const passwordField = document.getElementById('password');
            
            if (usernameField && passwordField) {
                usernameField.value = username;
                passwordField.value = password;
                
                // Show notification
                if (window.loginManager) {
                    window.loginManager.showNotification(`Đã điền thông tin ${role.toLowerCase()}!`, 'info');
                }
            }
        });

        account.style.cursor = 'pointer';
        account.addEventListener('mouseenter', () => {
            account.style.transform = 'scale(1.02)';
            account.style.transition = 'transform 0.2s ease';
        });

        account.addEventListener('mouseleave', () => {
            account.style.transform = 'scale(1)';
        });
    });
}); 