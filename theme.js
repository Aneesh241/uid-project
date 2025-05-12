'use strict';

/**
 * Theme switcher functionality
 * Handles dark/light mode toggle and persistence
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create the theme toggle button if it doesn't exist
    if (!document.getElementById('themeToggle')) {
        createThemeToggleButton();
    }
    
    // Initialize theme from localStorage or system preference
    initializeTheme();
    
    // Set up theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

/**
 * Creates the theme toggle button and adds it to the DOM
 */
function createThemeToggleButton() {
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'theme-toggle-container';
    toggleContainer.innerHTML = `
        <button id="themeToggle" class="theme-toggle-button" aria-label="Toggle theme">
            <i class="fas fa-moon moon-icon"></i>
            <i class="fas fa-sun sun-icon"></i>
            <span class="theme-label">Theme</span>
        </button>
    `;
    document.body.appendChild(toggleContainer);
}

/**
 * Initializes the theme based on localStorage or system preference
 */
function initializeTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Use saved preference
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Check system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', initialTheme);
        localStorage.setItem('theme', initialTheme);
    }
    
    // Update toggle appearance based on current theme
    updateToggleAppearance();
}

/**
 * Toggles between dark and light themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme attribute
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update the toggle button appearance
    updateToggleAppearance();
    
    // Apply transition effect to page
    applyThemeTransition();
}

/**
 * Updates the toggle button appearance based on current theme
 */
function updateToggleAppearance() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const moonIcon = document.querySelector('.moon-icon');
    const sunIcon = document.querySelector('.sun-icon');
    
    if (moonIcon && sunIcon) {
        if (currentTheme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
        } else {
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
        }
    }
}

/**
 * Applies a smooth transition effect when changing themes
 */
function applyThemeTransition() {
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Create a subtle flash effect
    const flashOverlay = document.createElement('div');
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.top = '0';
    flashOverlay.style.left = '0';
    flashOverlay.style.width = '100%';
    flashOverlay.style.height = '100%';
    flashOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    flashOverlay.style.zIndex = '9999';
    flashOverlay.style.pointerEvents = 'none';
    flashOverlay.style.opacity = '0';
    flashOverlay.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(flashOverlay);
    
    // Flash effect sequence
    setTimeout(() => {
        flashOverlay.style.opacity = '0.3';
        setTimeout(() => {
            flashOverlay.style.opacity = '0';
            setTimeout(() => {
                if (flashOverlay && flashOverlay.parentNode) {
                    document.body.removeChild(flashOverlay);
                }
            }, 300);
        }, 100);
    }, 0);
} 