document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Set user name in the welcome message
    const userNameElement = document.getElementById('userName');
    userNameElement.textContent = currentUser.name;

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Load orders from localStorage
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ordersContainer = document.getElementById('ordersContainer');
    const emptyOrdersMsg = document.querySelector('.empty-orders');
    
    // Handle auto-complete toggle
    const autoCompleteToggle = document.getElementById('autoCompleteToggle');
    let autoCompleteEnabled = localStorage.getItem('autoCompleteEnabled') !== 'false';
    
    // Initialize toggle state from localStorage
    autoCompleteToggle.checked = autoCompleteEnabled;
    
    // Listen for toggle changes
    autoCompleteToggle.addEventListener('change', () => {
        autoCompleteEnabled = autoCompleteToggle.checked;
        localStorage.setItem('autoCompleteEnabled', autoCompleteEnabled);
    });
    
    // Filter orders based on status
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter and display orders
            const status = btn.dataset.status;
            displayOrders(status === 'all' ? orders : orders.filter(order => order.status === status));
        });
    });

    // Initial display of all orders
    displayOrders(orders);

    // Set up order details modal
    const modal = document.getElementById('orderDetailsModal');
    const closeModal = modal.querySelector('.close-modal');
    
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Check for order status updates every 30 seconds
    setInterval(updateOrderStatuses, 30000);

    // Function to display orders
    function displayOrders(ordersList) {
        // Ensure ordersContainer exists
        if (!ordersContainer) {
            console.error('Orders container not found');
            return;
        }
        
        // Clear all existing order cards
        const orderCards = ordersContainer.querySelectorAll('.order-card');
        orderCards.forEach(card => card.remove());
        
        // Show empty message if no orders
        if (!ordersList || ordersList.length === 0) {
            if (emptyOrdersMsg) emptyOrdersMsg.classList.remove('hidden');
            return;
        }
        
        // Hide empty message if we have orders
        if (emptyOrdersMsg) emptyOrdersMsg.classList.add('hidden');
        
        // Sort orders by date (newest first)
        ordersList.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Create order cards
        ordersList.forEach(order => {
            try {
                // Create order card element
                const orderCard = document.createElement('div');
                orderCard.className = `order-card ${order.status || 'pending'}`;
                
                // Calculate total items count
                const totalItems = order.items.reduce((total, item) => total + item.quantity, 0);
                
                // Format date
                const orderDate = new Date(order.date);
                const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
                
                // Set order card HTML
                orderCard.innerHTML = `
                    <div class="order-header">
                        <h3>Bill #${order.billNumber || 'N/A'}</h3>
                        <span class="order-status ${order.status || 'pending'}">${capitalizeFirstLetter(order.status || 'pending')}</span>
                    </div>
                    <div class="order-info">
                        <div class="info-row">
                            <span>Date:</span>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="info-row">
                            <span>Items:</span>
                            <span>${totalItems} item(s)</span>
                        </div>
                        <div class="info-row">
                            <span>Total:</span>
                            <span>${order.total || '₹0.00'}</span>
                        </div>
                        <div class="info-row">
                            <span>Payment:</span>
                            <span>${order.paymentMethod || 'N/A'}</span>
                        </div>
                    </div>
                    <button class="view-details-btn" data-id="${order.id}">View Details</button>
                `;
                
                // Add to orders container
                ordersContainer.appendChild(orderCard);
                
                // Add event listener to view details button
                const viewDetailsBtn = orderCard.querySelector('.view-details-btn');
                if (viewDetailsBtn) {
                    viewDetailsBtn.addEventListener('click', () => {
                        showOrderDetails(order);
                    });
                }
            } catch (error) {
                console.error('Error creating order card:', error);
            }
        });
    }

    // Function to show order details in modal
    function showOrderDetails(order) {
        const orderDetailsContent = document.getElementById('orderDetailsContent');
        const modalActions = document.getElementById('modalActions');
        
        // Format date
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
        
        // Generate order details HTML
        orderDetailsContent.innerHTML = `
            <div class="order-id">
                <h3>Bill #${order.billNumber}</h3>
                <span class="order-status ${order.status}">${capitalizeFirstLetter(order.status)}</span>
            </div>
            <div class="order-date">
                <i class="fas fa-calendar-alt"></i>
                <span>${formattedDate}</span>
            </div>
            <div class="order-items">
                <h4>Order Items</h4>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>₹${item.price}</td>
                                <td>${item.quantity}</td>
                                <td>₹${item.price * item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="order-summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>${order.subtotal}</span>
                </div>
                <div class="summary-row">
                    <span>GST (5%)</span>
                    <span>${order.gst}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>${order.total}</span>
                </div>
            </div>
            <div class="payment-info">
                <h4>Payment Information</h4>
                <div class="info-row">
                    <span>Method:</span>
                    <span>${order.paymentMethod}</span>
                </div>
                <div class="info-row">
                    <span>Status:</span>
                    <span>Paid</span>
                </div>
            </div>
            ${order.status === 'cancelled' ? `
            <div class="cancellation-info">
                <h4>Cancellation Information</h4>
                <div class="info-row">
                    <span>Reason:</span>
                    <span>${order.cancellationReason || 'Not specified'}</span>
                </div>
                <div class="info-row">
                    <span>Date:</span>
                    <span>${order.cancellationDate ? new Date(order.cancellationDate).toLocaleString() : 'Not available'}</span>
                </div>
            </div>
            ` : ''}
        `;
        
        // Generate action buttons based on order status
        modalActions.innerHTML = '';
        
        if (order.status === 'pending') {
            // Add Complete Order button
            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-order-btn';
            completeBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Completed';
            completeBtn.addEventListener('click', () => {
                completeOrder(order.id);
            });
            modalActions.appendChild(completeBtn);
            
            // Add Cancel Order button
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-order-btn';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel Order';
            cancelBtn.addEventListener('click', () => {
                cancelOrder(order.id);
            });
            modalActions.appendChild(cancelBtn);
        }
        
        const printBtn = document.createElement('button');
        printBtn.className = 'print-order-btn';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print Invoice';
        printBtn.addEventListener('click', () => {
            printInvoice(order);
        });
        modalActions.appendChild(printBtn);
        
        modal.style.display = 'block';
    }

    // Function to cancel an order
    function cancelOrder(orderId) {
        // Show cancellation reason modal
        const reasonModal = document.getElementById('cancellationReasonModal');
        const reasonInput = document.getElementById('cancellationReason');
        const confirmCancelBtn = document.getElementById('confirmCancelBtn');
        const cancelCancelBtn = document.getElementById('cancelCancelBtn');
        
        // Clear previous reason
        reasonInput.value = '';
        
        // Show the modal
        reasonModal.style.display = 'block';
        
        // Focus on the reason input
        reasonInput.focus();
        
        // Handle confirm button
        const handleConfirmCancel = () => {
            const reason = reasonInput.value.trim();
            if (!reason) {
                alert('Please provide a reason for cancellation');
                return;
            }
            
            // Find the order and update its status
            const orderIndex = orders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'cancelled';
                orders[orderIndex].cancellationReason = reason;
                orders[orderIndex].cancellationDate = new Date().toISOString();
                
                // Save updated orders to localStorage
                localStorage.setItem('orders', JSON.stringify(orders));
                
                // Close both modals and refresh the order display
                reasonModal.style.display = 'none';
                modal.style.display = 'none';
                
                // Clean up event listeners
                confirmCancelBtn.removeEventListener('click', handleConfirmCancel);
                cancelCancelBtn.removeEventListener('click', handleCancelCancel);
                
                // Update the display
                const activeFilter = document.querySelector('.filter-btn.active').dataset.status;
                displayOrders(activeFilter === 'all' ? orders : orders.filter(order => order.status === activeFilter));
            }
        };
        
        // Handle cancel button
        const handleCancelCancel = () => {
            reasonModal.style.display = 'none';
            
            // Clean up event listeners
            confirmCancelBtn.removeEventListener('click', handleConfirmCancel);
            cancelCancelBtn.removeEventListener('click', handleCancelCancel);
        };
        
        // Add event listeners
        confirmCancelBtn.addEventListener('click', handleConfirmCancel);
        cancelCancelBtn.addEventListener('click', handleCancelCancel);
    }

    // Function to print invoice (simulated)
    function printInvoice(order) {
        // In a real app, this would generate a printable invoice
        alert('Printing invoice for Bill #' + order.billNumber);
    }

    // Function to mark an order as completed
    function completeOrder(orderId) {
        if (confirm('Mark this order as completed?')) {
            // Find the order and update its status
            const orderIndex = orders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'completed';
                
                // Save updated orders to localStorage
                localStorage.setItem('orders', JSON.stringify(orders));
                
                // Close the modal and refresh the order display
                modal.style.display = 'none';
                const activeFilter = document.querySelector('.filter-btn.active').dataset.status;
                displayOrders(activeFilter === 'all' ? orders : orders.filter(order => order.status === activeFilter));
            }
        }
    }

    // Function to update order statuses based on time
    function updateOrderStatuses() {
        // Only auto-complete if the toggle is enabled
        if (!autoCompleteEnabled) return;
        
        let hasUpdates = false;
        
        orders.forEach(order => {
            if (order.status === 'pending') {
                const orderTime = new Date(order.date).getTime();
                const currentTime = new Date().getTime();
                const elapsedMinutes = (currentTime - orderTime) / (1000 * 60);
                
                // Complete orders after 1 minute (simulating order processing)
                if (elapsedMinutes >= 1) {
                    order.status = 'cancelled';
                    hasUpdates = true;
                }
            }
        });
        
        if (hasUpdates) {
            // Save updated orders to localStorage
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Refresh the display if needed
            const activeFilter = document.querySelector('.filter-btn.active').dataset.status;
            displayOrders(activeFilter === 'all' ? orders : orders.filter(order => order.status === activeFilter));
        }
    }

    // Helper function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}); 