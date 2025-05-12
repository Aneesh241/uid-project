document.addEventListener('DOMContentLoaded', () => {
    const nameGroup = document.getElementById('nameGroup');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const authSubmit = document.getElementById('authSubmit');
    const authToggle = document.getElementById('authToggle');
    const authText = document.getElementById('authText');
    const authError = document.getElementById('authError');

    let isSignUp = false;

    // Check if user is already logged in
    if (sessionStorage.getItem('currentUser')) {
        window.location.href = 'dashboard.html';
    }

    // Toggle between Sign In and Sign Up
    authToggle.addEventListener('click', (e) => {
        e.preventDefault();
        isSignUp = !isSignUp;
        nameGroup.style.display = isSignUp ? 'block' : 'none';
        authSubmit.textContent = isSignUp ? 'Create Account' : 'Sign In';
        authToggle.textContent = isSignUp ? 'Sign In' : 'Sign Up';
        authText.textContent = isSignUp ? 'Already have an account?' : "Don't have an account?";
        authError.textContent = '';
        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
    });

    // Handle form submission
    authSubmit.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const name = nameInput.value.trim();

        // Validate inputs
        if (isSignUp && !name) {
            showError('Please enter your name');
            return;
        }
        if (!email) {
            showError('Please enter your email');
            return;
        }
        if (!password) {
            showError('Please enter your password');
            return;
        }
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        if (isSignUp) {
            handleSignUp(name, email, password);
        } else {
            handleSignIn(email, password);
        }
    });

    function handleSignUp(name, email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
            showError('Email already registered');
            return;
        }

        // Add new user
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after signup
        sessionStorage.setItem('currentUser', JSON.stringify({ name, email }));
        window.location.href = 'dashboard.html';
    }

    function handleSignIn(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify({ 
                name: user.name, 
                email: user.email 
            }));
            window.location.href = 'dashboard.html';
        } else {
            showError('Invalid email or password');
        }
    }

    function showError(message) {
        authError.textContent = message;
        authError.classList.add('fade-in');
        setTimeout(() => {
            authError.classList.remove('fade-in');
        }, 300);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Initialize theme if first visit
    if (!localStorage.getItem('theme')) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', initialTheme);
        localStorage.setItem('theme', initialTheme);
    }
}); 