document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!sessionStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
        return;
    }

    // Set user name in the welcome message
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        userNameElement.textContent = currentUser.name || 'User';
    }

    // Initialize dashboard
    updateDashboardStats();

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    }

    // Add reset button to the quick actions section
    addResetButton();

    function updateDashboardStats() {
        // Get all orders from localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        if (orders.length === 0) {
            setEmptyStats();
            return;
        }
        
        // Filter orders by status
        const completedOrders = orders.filter(order => order.status === 'completed');
        const pendingOrders = orders.filter(order => order.status === 'pending');
        
        // Calculate total sales (only from completed orders)
        const totalSales = calculateTotalSales(completedOrders);
        const previousWeekSales = calculatePreviousWeekSales(completedOrders);
        
        // Calculate pending order stats
        const pendingOrderCount = pendingOrders.length;
        const pendingAmount = calculateTotalSales(pendingOrders);
        
        // Calculate orders today
        const ordersToday = calculateOrdersToday(orders);
        const ordersYesterday = calculateOrdersYesterday(orders);
        
        // Calculate average rating (placeholder since we don't have rating data)
        // In a real app, you'd have actual ratings data
        const avgRating = 4.7;
        const previousRating = 4.5;
        
        // Update UI with calculated values
        updateSalesStats(totalSales, previousWeekSales);
        updatePendingStats(pendingOrderCount, pendingAmount);
        updateOrdersStats(ordersToday, ordersYesterday);
        updateRatingStats(avgRating, previousRating);
    }
    
    function setEmptyStats() {
        document.getElementById('totalSales').textContent = '₹0.00';
        document.getElementById('salesChange').innerHTML = '<span>No data available</span>';
        
        document.getElementById('pendingOrders').textContent = '0';
        document.getElementById('pendingAmount').innerHTML = '<span>₹0.00</span>';
        
        document.getElementById('ordersToday').textContent = '0';
        document.getElementById('ordersChange').innerHTML = '<span>No data available</span>';
        
        document.getElementById('customerCount').textContent = '0';
        document.getElementById('customerChange').innerHTML = '<span>No data available</span>';
        
        document.getElementById('avgRating').textContent = '0.0';
        document.getElementById('ratingChange').innerHTML = '<span>No data available</span>';
    }
    
    function calculateTotalSales(orders) {
        return orders.reduce((total, order) => {
            // Extract numeric value from total string (e.g., "₹1234.56" -> 1234.56)
            const amount = parseFloat(order.total.replace(/[^\d.-]/g, ''));
            return total + (isNaN(amount) ? 0 : amount);
        }, 0);
    }
    
    function calculatePreviousWeekSales(orders) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        // Only include completed orders from the previous week
        const lastWeekOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= twoWeeksAgo && orderDate < oneWeekAgo;
        });
        
        return calculateTotalSales(lastWeekOrders);
    }
    
    function calculateOrdersToday(orders) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= today;
        }).length;
    }
    
    function calculateOrdersYesterday(orders) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        return orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= yesterday && orderDate < today;
        }).length;
    }
    
    function updateSalesStats(currentSales, previousSales) {
        const salesElement = document.getElementById('totalSales');
        const salesChangeElement = document.getElementById('salesChange');
        
        salesElement.textContent = `₹${currentSales.toFixed(2)}`;
        
        if (previousSales === 0) {
            salesChangeElement.innerHTML = '<span>No previous data</span>';
            return;
        }
        
        const percentChange = ((currentSales - previousSales) / previousSales) * 100;
        const isPositive = percentChange >= 0;
        
        salesChangeElement.className = isPositive ? 'stat-change positive' : 'stat-change negative';
        salesChangeElement.innerHTML = `${isPositive ? '+' : ''}${percentChange.toFixed(1)}% <span>vs last week</span>`;
    }
    
    function updateOrdersStats(currentOrders, previousOrders) {
        const ordersElement = document.getElementById('ordersToday');
        const ordersChangeElement = document.getElementById('ordersChange');
        
        ordersElement.textContent = currentOrders;
        
        if (previousOrders === 0) {
            ordersChangeElement.innerHTML = '<span>No previous data</span>';
            return;
        }
        
        const percentChange = ((currentOrders - previousOrders) / previousOrders) * 100;
        const isPositive = percentChange >= 0;
        
        ordersChangeElement.className = isPositive ? 'stat-change positive' : 'stat-change negative';
        ordersChangeElement.innerHTML = `${isPositive ? '+' : ''}${percentChange.toFixed(1)}% <span>vs yesterday</span>`;
    }
    
    function updateRatingStats(currentRating, previousRating) {
        const ratingElement = document.getElementById('avgRating');
        const ratingChangeElement = document.getElementById('ratingChange');
        
        ratingElement.textContent = currentRating.toFixed(1);
        
        if (previousRating === 0) {
            ratingChangeElement.innerHTML = '<span>No previous data</span>';
            return;
        }
        
        const change = currentRating - previousRating;
        const isPositive = change >= 0;
        
        ratingChangeElement.className = isPositive ? 'stat-change positive' : 'stat-change negative';
        ratingChangeElement.innerHTML = `${isPositive ? '+' : ''}${change.toFixed(1)} <span>vs last month</span>`;
    }

    function updatePendingStats(pendingCount, pendingAmount) {
        const pendingElement = document.getElementById('pendingOrders');
        const pendingAmountElement = document.getElementById('pendingAmount');
        
        pendingElement.textContent = pendingCount;
        pendingAmountElement.innerHTML = `<span>₹${pendingAmount.toFixed(2)}</span>`;
        
        // Add color coding based on number of pending orders
        if (pendingCount > 10) {
            pendingElement.style.color = '#e53e3e'; // Red for high number of pending orders
        } else if (pendingCount > 5) {
            pendingElement.style.color = '#dd6b20'; // Orange for medium number
        } else {
            pendingElement.style.color = ''; // Default color
        }
    }

    // Handle order status updates
    function setupOrderStatusListener() {
        // Listen for order status changes from other pages
        window.addEventListener('storage', function(e) {
            if (e.key === 'orders') {
                // Order data has changed, update dashboard
                updateDashboardStats();
            }
        });
    }

    // Call setup functions
    setupOrderStatusListener();

    // Add reset button to quick actions
    function addResetButton() {
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            const resetBtn = document.createElement('button');
            resetBtn.className = 'action-btn';
            resetBtn.setAttribute('type', 'button');
            resetBtn.innerHTML = '<i class="fas fa-trash-restore"></i>Reset System';
            resetBtn.addEventListener('click', resetAllData);
            actionButtons.appendChild(resetBtn);
        }
    }

    function resetAllData() {
        if (confirm('Are you sure you want to reset all system data? This will clear all orders, bills, and settings. This action cannot be undone.')) {
            // Clear all localStorage items
            localStorage.clear();
            
            // Keep the current user logged in, but clear everything else in sessionStorage
            const currentUser = sessionStorage.getItem('currentUser');
            sessionStorage.clear();
            if (currentUser) {
                sessionStorage.setItem('currentUser', currentUser);
            }
            
            alert('All system data has been reset successfully.');
            
            // Reload the page to reflect changes
            window.location.reload();
        }
    }
});