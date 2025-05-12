/**
 * Utility functions for resetting the billing system
 * These functions can be called from the console to quickly reset different aspects of the system
 */

// Reset everything - completely wipes all data
function resetAll() {
    localStorage.clear();
    sessionStorage.clear();
    
    // If this is called from the reset page, show the UI completion message
    if (document.getElementById('resetComplete')) {
        showResetComplete('Factory reset completed successfully. All data has been removed.');
        return; // Don't redirect or show alert if we're showing UI feedback
    }
    
    alert('System reset complete. You will now be redirected to the login page.');
    window.location.href = 'index.html';
}

// Reset only orders and transactions
function resetOrders() {
    localStorage.removeItem('orders');
    
    // If this is called from the reset page, show the UI completion message
    if (document.getElementById('resetComplete')) {
        showResetComplete('Orders and bills have been reset successfully.');
        return; // Don't reload or show alert if we're showing UI feedback
    }
    
    alert('Orders reset complete.');
    window.location.reload();
}

// Reset only settings and preferences
function resetSettings() {
    // Backup user data
    const orders = localStorage.getItem('orders');
    const users = localStorage.getItem('users');
    
    // Clear everything
    localStorage.clear();
    
    // Restore user data
    if (orders) localStorage.setItem('orders', orders);
    if (users) localStorage.setItem('users', users);
    
    // Reset theme to system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', initialTheme);
    localStorage.setItem('theme', initialTheme);
    
    // If this is called from the reset page, show the UI completion message
    if (document.getElementById('resetComplete')) {
        showResetComplete('System settings have been reset successfully.');
        return; // Don't reload or show alert if we're showing UI feedback
    }
    
    alert('Settings reset complete.');
    window.location.reload();
}

// Reset only user accounts but keep orders and settings
function resetUsers() {
    // Backup order data
    const orders = localStorage.getItem('orders');
    const theme = localStorage.getItem('theme');
    
    // Clear user data
    localStorage.removeItem('users');
    sessionStorage.removeItem('currentUser');
    
    // If this is called from the reset page, show the UI completion message
    if (document.getElementById('resetComplete')) {
        showResetComplete('User accounts have been reset successfully.');
        return; // Don't redirect or show alert if we're showing UI feedback
    }
    
    alert('User accounts reset complete. You will now be redirected to the login page.');
    window.location.href = 'index.html';
}

// Helper function to show the reset completion UI
function showResetComplete(message) {
    const resetOptions = document.getElementById('resetOptions');
    if (resetOptions) resetOptions.style.display = 'none';
    
    const resetComplete = document.getElementById('resetComplete');
    if (resetComplete) {
        resetComplete.style.display = 'block';
        
        const messageElem = resetComplete.querySelector('p');
        if (messageElem) {
            messageElem.textContent = message;
        }
        
        // Customize the login button based on the reset type
        const loginBtn = resetComplete.querySelector('.login-btn');
        if (loginBtn) {
            // Factory reset keeps index.html destination and "Go to Login" text
            if (message.includes('Factory reset') || message.includes('User accounts')) {
                loginBtn.href = 'index.html';
                loginBtn.textContent = 'Go to Login';
            } 
            // Orders and settings reset should go back to dashboard
            else {
                loginBtn.href = 'dashboard.html';
                loginBtn.textContent = 'Return to Dashboard';
            }
        }
    }
}

// Initialize event listeners if we're on the reset page
function initResetPage() {
    // Only proceed if we're on the reset page
    if (!document.getElementById('resetOptions')) return;
    
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Set user name in the welcome message
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = currentUser.name;
    }
    
    // Button listeners
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }
    
    const resetOrdersBtn = document.getElementById('resetOrdersBtn');
    if (resetOrdersBtn) {
        resetOrdersBtn.addEventListener('click', () => {
            if(confirm('Are you sure you want to reset all orders and bills? This action cannot be undone.')) {
                resetOrders();
            }
        });
    }
    
    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            if(confirm('Are you sure you want to reset all system settings? This action cannot be undone.')) {
                resetSettings();
            }
        });
    }
    
    const factoryResetBtn = document.getElementById('factoryResetBtn');
    if (factoryResetBtn) {
        factoryResetBtn.addEventListener('click', () => {
            if(confirm('WARNING: This will completely reset the system and remove ALL data including user accounts. You will need to set up the system again. This action cannot be undone.')) {
                // Confirm again for safety
                if(confirm('Are you absolutely sure? All data will be permanently lost.')) {
                    resetAll();
                }
            }
        });
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
}

// If this script is loaded directly on a page, expose these functions globally
if (typeof window !== 'undefined') {
    window.resetAll = resetAll;
    window.resetOrders = resetOrders;
    window.resetSettings = resetSettings;
    window.resetUsers = resetUsers;
    
    // Add DOM load event listener to initialize reset page if applicable
    document.addEventListener('DOMContentLoaded', initResetPage);
} 