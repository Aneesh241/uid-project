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

    // Sample menu data (in real app, this would come from a backend)
    const menuData = {
        starters: {
            veg: [
                { id: 1, name: 'Paneer Tikka', price: 250 },
                { id: 2, name: 'Veg Spring Roll', price: 180 },
                { id: 3, name: 'Dahi Kebab', price: 120 },
                { id: 4, name: 'Garlic Bread', price: 150 },
                { id: 5, name: 'Veg Manchurian', price: 220 },
                { id: 6, name: 'Gobi 65', price: 210 },
                { id: 7, name: 'Aloo Tikki', price: 150 },
                { id: 8, name: 'Vegetable Samosa', price: 120 },
                { id: 9, name: 'Paneer Pakora', price: 190 },
                { id: 10, name: 'Mushroom Chilli', price: 230 },
                { id: 11, name: 'Corn Cheese Balls', price: 200 },
                { id: 12, name: 'Hara Bhara Kebab', price: 180 }
            ],
            nonVeg: [
                { id: 13, name: 'Chicken Tikka', price: 280 },
                { id: 14, name: 'Fish Fingers', price: 320 },
                { id: 15, name: 'Chicken 65', price: 260 },
                { id: 16, name: 'Tandoori Wings', price: 290 },
                { id: 17, name: 'Prawn Tempura', price: 350 },
                { id: 18, name: 'Chicken Satay', price: 270 },
                { id: 19, name: 'Mutton Seekh Kebab', price: 320 },
                { id: 20, name: 'Chilli Garlic Prawns', price: 380 },
                { id: 21, name: 'Tandoori Fish Tikka', price: 340 },
                { id: 22, name: 'Chicken Malai Kebab', price: 300 },
                { id: 23, name: 'Lamb Chops', price: 420 },
                { id: 24, name: 'Amritsari Fish', price: 310 }
            ]
        },
        main: {
            veg: [
                { id: 25, name: 'Butter Naan', price: 40 },
                { id: 26, name: 'Paneer Butter Masala', price: 280 },
                { id: 27, name: 'Dal Makhani', price: 220 },
                { id: 28, name: 'Veg Biryani', price: 320 },
                { id: 29, name: 'Chole Bhature', price: 180 },
                { id: 30, name: 'Masala Dosa', price: 160 },
                { id: 31, name: 'Palak Paneer', price: 260 },
                { id: 32, name: 'Veg Kolhapuri', price: 240 },
                { id: 33, name: 'Malai Kofta', price: 290 },
                { id: 34, name: 'Kadai Vegetable', price: 230 },
                { id: 35, name: 'Mushroom Masala', price: 250 },
                { id: 36, name: 'Aloo Gobi', price: 190 }
            ],
            nonVeg: [
                { id: 37, name: 'Butter Chicken', price: 310 },
                { id: 38, name: 'Chicken Biryani', price: 340 },
                { id: 39, name: 'Mutton Curry', price: 380 },
                { id: 40, name: 'Fish Curry', price: 360 },
                { id: 41, name: 'Prawn Masala', price: 390 },
                { id: 42, name: 'Egg Curry', price: 260 },
                { id: 43, name: 'Chicken Tikka Masala', price: 330 },
                { id: 44, name: 'Lamb Rogan Josh', price: 390 },
                { id: 45, name: 'Goan Fish Curry', price: 370 },
                { id: 46, name: 'Chicken Korma', price: 350 },
                { id: 47, name: 'Keema Matar', price: 320 },
                { id: 48, name: 'Tandoori Chicken', price: 300 }
            ]
        },
        drinks: {
            alcoholic: [
                { id: 49, name: 'Beer', price: 320 },
                { id: 50, name: 'Whiskey (30ml)', price: 220 },
                { id: 51, name: 'Rum (30ml)', price: 180 },
                { id: 52, name: 'Vodka (30ml)', price: 210 },
                { id: 53, name: 'Wine (Glass)', price: 350 },
                { id: 54, name: 'Cocktail', price: 450 },
                { id: 55, name: 'Gin & Tonic', price: 380 },
                { id: 56, name: 'Mojito', price: 420 },
                { id: 57, name: 'Old Fashioned', price: 480 },
                { id: 58, name: 'Margarita', price: 400 },
                { id: 59, name: 'Piña Colada', price: 450 },
                { id: 60, name: 'Cosmopolitan', price: 430 }
            ],
            nonAlcoholic: [
                { id: 61, name: 'Mineral Water', price: 40 },
                { id: 62, name: 'Soft Drink', price: 60 },
                { id: 63, name: 'Fresh Lime Soda', price: 70 },
                { id: 64, name: 'Fruit Juice', price: 120 },
                { id: 65, name: 'Virgin Mojito', price: 160 },
                { id: 66, name: 'Mango Lassi', price: 180 },
                { id: 67, name: 'Chocolate Milkshake', price: 210 },
                { id: 68, name: 'Strawberry Milkshake', price: 200 },
                { id: 69, name: 'Vanilla Milkshake', price: 190 },
                { id: 70, name: 'Oreo Milkshake', price: 230 },
                { id: 71, name: 'Caramel Milkshake', price: 240 },
                { id: 72, name: 'Banana Milkshake', price: 200 }
            ]
        },
        desserts: [
            { id: 73, name: 'Gulab Jamun', price: 80 },
            { id: 74, name: 'Ice Cream', price: 110 },
            { id: 75, name: 'Chocolate Brownie', price: 160 },
            { id: 76, name: 'Rasgulla', price: 90 },
            { id: 77, name: 'Fruit Custard', price: 130 },
            { id: 78, name: 'Kheer', price: 100 },
            { id: 79, name: 'Tiramisu', price: 180 },
            { id: 80, name: 'Crème Brûlée', price: 220 },
            { id: 81, name: 'Chocolate Lava Cake', price: 190 },
            { id: 82, name: 'Cheesecake', price: 210 },
            { id: 83, name: 'Panna Cotta', price: 170 },
            { id: 84, name: 'Baklava', price: 150 },
            { id: 85, name: 'Macarons (3pcs)', price: 240 },
            { id: 86, name: 'Molten Chocolate Soufflé', price: 250 },
            { id: 87, name: 'Mango Mousse', price: 160 },
            { id: 88, name: 'Red Velvet Cake', price: 200 }
        ]
    };

    let currentBill = [];
    const GST_RATE = 0.05;
    let currentPaymentMethod = '';

    // Get the next bill number
    let billNumber = getNextBillNumber();
    document.getElementById('billNumber').textContent = billNumber;

    // Initialize UI
    loadMenuItems('starters');
    setupEventListeners();

    function getNextBillNumber() {
        // Get all orders
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Find the highest bill number
        let highestBillNumber = 0;
        orders.forEach(order => {
            const orderBillNumber = parseInt(order.billNumber.replace('UID', ''));
            if (orderBillNumber > highestBillNumber) {
                highestBillNumber = orderBillNumber;
            }
        });
        
        // Return the next bill number
        const nextBillNumber = highestBillNumber + 1;
        return 'UID' + String(nextBillNumber).padStart(3, '0');
    }

    function loadMenuItems(category) {
        const menuContainer = document.getElementById('menuItems');
        menuContainer.innerHTML = '';

        // Hide all toggle containers first
        document.getElementById('startersToggleContainer').style.display = 'none';
        document.getElementById('mainToggleContainer').style.display = 'none';
        document.getElementById('drinksToggleContainer').style.display = 'none';
        
        // Show toggle container for the selected category if needed
        if (category === 'starters') {
            document.getElementById('startersToggleContainer').style.display = 'block';
            
            // Get veg/non-veg selection
            const isNonVeg = document.getElementById('nonVegStartersToggle').checked;
            const itemsToShow = isNonVeg ? menuData.starters.nonVeg : menuData.starters.veg;
            
            itemsToShow.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'menu-item';
                itemElement.innerHTML = `
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price}</p>
                `;
                itemElement.onclick = () => addToBill(item);
                menuContainer.appendChild(itemElement);
            });
            
        } else if (category === 'main') {
            document.getElementById('mainToggleContainer').style.display = 'block';
            
            // Get veg/non-veg selection
            const isNonVeg = document.getElementById('nonVegMainToggle').checked;
            const itemsToShow = isNonVeg ? menuData.main.nonVeg : menuData.main.veg;
            
            itemsToShow.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'menu-item';
                itemElement.innerHTML = `
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price}</p>
                `;
                itemElement.onclick = () => addToBill(item);
                menuContainer.appendChild(itemElement);
            });
            
        } else if (category === 'drinks') {
            document.getElementById('drinksToggleContainer').style.display = 'block';
            
            // Default to non-alcoholic drinks
            const isAlcoholic = document.getElementById('alcoholicToggle').checked;
            const drinksToShow = isAlcoholic ? menuData.drinks.alcoholic : menuData.drinks.nonAlcoholic;
            
            drinksToShow.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'menu-item';
                itemElement.innerHTML = `
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price}</p>
                `;
                itemElement.onclick = () => addToBill(item);
                menuContainer.appendChild(itemElement);
            });
        } else {
            // For desserts, no toggle needed
        menuData[category].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p class="price">₹${item.price}</p>
            `;
            itemElement.onclick = () => addToBill(item);
            menuContainer.appendChild(itemElement);
        });
        }
    }

    function addToBill(item) {
        const existingItem = currentBill.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            currentBill.push({ ...item, quantity: 1 });
        }
        
        updateBillDisplay();
    }
    
    function updateBillDisplay() {
        const billItems = document.getElementById('billItems');
        billItems.innerHTML = '';

        if (currentBill.length === 0) {
            billItems.innerHTML = '<div class="empty-bill"><i class="fas fa-shopping-cart"></i><p>No items added yet</p></div>';
            return;
        }

        currentBill.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'bill-item';
            itemElement.innerHTML = `
                <div class="bill-item-details">
                    <div class="bill-item-name">${item.name}</div>
                    <div class="bill-item-price">₹${item.price} × ${item.quantity}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                </div>
            `;
            billItems.appendChild(itemElement);
        });

        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id);
                const change = parseInt(this.dataset.change);
                updateQuantity(itemId, change);
            });
        });

        updateTotals();
    }

    function updateTotals() {
        const subtotal = currentBill.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const gst = subtotal * GST_RATE;
        const total = subtotal + gst;

        document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('gst').textContent = `₹${gst.toFixed(2)}`;
        document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    }

    function updateQuantity(itemId, change) {
        const item = currentBill.find(i => i.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                currentBill = currentBill.filter(i => i.id !== itemId);
            }
            updateBillDisplay();
        }
    }

    function setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }

        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.category-tab').forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-pressed', 'true');
                loadMenuItems(tab.dataset.category);
            });
        });
        
        // Starters toggle switch
        const nonVegStartersToggle = document.getElementById('nonVegStartersToggle');
        if (nonVegStartersToggle) {
            nonVegStartersToggle.addEventListener('change', function() {
                const toggleLabel = document.getElementById('startersToggleLabel');
                if (this.checked) {
                    toggleLabel.textContent = 'Non-Vegetarian';
                } else {
                    toggleLabel.textContent = 'Vegetarian';
                }
                
                // Reload the starters menu
                if (document.querySelector('.category-tab.active').dataset.category === 'starters') {
                    loadMenuItems('starters');
                }
            });
        }
        
        // Main course toggle switch
        const nonVegMainToggle = document.getElementById('nonVegMainToggle');
        if (nonVegMainToggle) {
            nonVegMainToggle.addEventListener('change', function() {
                const toggleLabel = document.getElementById('mainToggleLabel');
                if (this.checked) {
                    toggleLabel.textContent = 'Non-Vegetarian';
                } else {
                    toggleLabel.textContent = 'Vegetarian';
                }
                
                // Reload the main course menu
                if (document.querySelector('.category-tab.active').dataset.category === 'main') {
                    loadMenuItems('main');
                }
            });
        }
        
        // Alcoholic toggle switch
        const alcoholicToggle = document.getElementById('alcoholicToggle');
        if (alcoholicToggle) {
            alcoholicToggle.addEventListener('change', function() {
                const toggleLabel = document.getElementById('toggleLabel');
                if (this.checked) {
                    toggleLabel.textContent = 'Alcoholic';
                } else {
                    toggleLabel.textContent = 'Non-Alcoholic';
                }
                
                // Reload the drinks menu
                if (document.querySelector('.category-tab.active').dataset.category === 'drinks') {
                    loadMenuItems('drinks');
                }
            });
        }

        // Payment modal
        const modal = document.getElementById('paymentModal');
        const payNowBtn = document.getElementById('payNowBtn');
        const closeModal = document.querySelector('.close-modal');

        payNowBtn.onclick = () => {
            if (currentBill.length === 0) {
                alert('Please add items to the bill first');
                return;
            }
            modal.style.display = 'block';
        };

        closeModal.onclick = () => {
            modal.style.display = 'none';
            resetPaymentSections();
        };

        // Payment methods
        document.querySelectorAll('.payment-method').forEach(method => {
            method.onclick = () => {
                // Hide all payment method specific sections first
                resetPaymentSections();
                
                document.querySelectorAll('.payment-method').forEach(m => {
                    m.classList.remove('active');
                });
                method.classList.add('active');
                
                currentPaymentMethod = method.dataset.method;
                
                if (method.dataset.method === 'upi') {
                    document.getElementById('upiQRCode').style.display = 'block';
                    
                    // Scroll to the payment section after a short delay to ensure it's visible
                    setTimeout(() => {
                        document.getElementById('upiQRCode').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                    
                    simulatePayment('UPI Payment');
                } else if (method.dataset.method === 'card') {
                    // Show card payment section if you have one
                    document.getElementById('cardPaymentSection').style.display = 'block';
                    
                    // Scroll to the payment section
                    setTimeout(() => {
                        document.getElementById('cardPaymentSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                    
                    simulatePayment('Card Payment');
                } else if (method.dataset.method === 'cash') {
                    // Show cash payment section if you have one
                    document.getElementById('cashPaymentSection').style.display = 'block';
                    
                    // Scroll to the payment section
                    setTimeout(() => {
                        document.getElementById('cashPaymentSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                    
                    simulatePayment('Cash Payment');
                }
            };
        });

        // Clear bill
        document.getElementById('clearBillBtn').onclick = () => {
            if (confirm('Are you sure you want to clear the bill?')) {
                currentBill = [];
                updateBillDisplay();
                updateTotals();
            }
        };

        // Close modal when clicking outside
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                resetPaymentSections();
            }
        };
    }

    function resetPaymentSections() {
        // Hide all payment specific sections
        document.getElementById('upiQRCode').style.display = 'none';
        document.getElementById('cardPaymentSection').style.display = 'none';
        document.getElementById('cashPaymentSection').style.display = 'none';
        
        // Reset any payment status messages and icons
        const statusElements = document.querySelectorAll('.payment-status p');
        statusElements.forEach(element => {
            element.textContent = 'Waiting for payment...';
            element.classList.remove('success-message');
        });
        
        // Hide success icons and show spinners
        document.querySelectorAll('.payment-status .success-icon').forEach(icon => {
            icon.style.display = 'none';
        });
        
        document.querySelectorAll('.payment-status .spinner').forEach(spinner => {
            spinner.style.display = 'inline-block';
        });
    }

    function simulatePayment(paymentMethod) {
        const methodLower = paymentMethod.toLowerCase();
        let statusElement, spinnerElement, successIconElement;
        
        // Get payment amount
        const totalAmount = document.getElementById('total').textContent;
        
        // Set amount in each payment section
        const upiAmount = document.getElementById('upiAmount');
        const cardAmount = document.getElementById('cardAmount');
        const cashAmount = document.getElementById('cashAmount');
        
        if (upiAmount) upiAmount.textContent = totalAmount;
        if (cardAmount) cardAmount.textContent = totalAmount;
        if (cashAmount) cashAmount.textContent = totalAmount;
        
        // Show appropriate payment section and get elements
        if (methodLower.includes('upi')) {
            document.getElementById('upiQRCode').style.display = 'block';
            statusElement = document.querySelector('#upiQRCode .payment-status p');
            spinnerElement = document.querySelector('#upiQRCode .payment-status .spinner');
            successIconElement = document.querySelector('#upiQRCode .payment-status .success-icon');
        } else if (methodLower.includes('card')) {
            document.getElementById('cardPaymentSection').style.display = 'block';
            statusElement = document.querySelector('#cardPaymentSection .payment-status p');
            spinnerElement = document.querySelector('#cardPaymentSection .payment-status .spinner');
            successIconElement = document.querySelector('#cardPaymentSection .payment-status .success-icon');
        } else if (methodLower.includes('cash')) {
            document.getElementById('cashPaymentSection').style.display = 'block';
            statusElement = document.querySelector('#cashPaymentSection .payment-status p');
            spinnerElement = document.querySelector('#cashPaymentSection .payment-status .spinner');
            successIconElement = document.querySelector('#cashPaymentSection .payment-status .success-icon');
        }
        
        if (!statusElement || !spinnerElement || !successIconElement) {
            console.error(`Payment elements not found for ${paymentMethod}`);
            return;
        }
        
        // Update status message
        statusElement.textContent = 'Processing payment...';
        statusElement.classList.remove('success-message');
        spinnerElement.style.display = 'inline-block';
        successIconElement.style.display = 'none';

        // Handle cancel payment button functionality
        const cancelPaymentBtn = document.querySelector(`#${getPaymentSectionId(methodLower)} .cancel-payment-btn`);
        let processingTimeout;
        let successTimeout;
        
        if (cancelPaymentBtn) {
            // Add click event to cancel payment
            const cancelHandler = () => {
                clearTimeout(processingTimeout);
                clearTimeout(successTimeout);
                statusElement.textContent = 'Payment cancelled';
                statusElement.classList.remove('success-message');
                spinnerElement.style.display = 'none';
                successIconElement.style.display = 'none';
                
                // Disable the cancel button after cancellation
                cancelPaymentBtn.disabled = true;
                cancelPaymentBtn.style.opacity = '0.5';
                
                // Re-enable after a short delay
                setTimeout(() => {
                    resetPaymentSections();
                    const modal = document.getElementById('paymentModal');
                    if (modal) modal.style.display = 'none';
                }, 1500);
            };
            
            cancelPaymentBtn.onclick = cancelHandler;
        }

        // Simulate payment processing
        processingTimeout = setTimeout(() => {
            // Show success
            if (statusElement) {
                statusElement.textContent = 'Payment successful!';
                statusElement.classList.add('success-message');
            }
            
            if (spinnerElement) {
                spinnerElement.style.display = 'none';
            }
            
            if (successIconElement) {
                successIconElement.style.display = 'block';
            }
            
            // Remove the cancel button click handler
            if (cancelPaymentBtn) {
                cancelPaymentBtn.onclick = null;
                cancelPaymentBtn.disabled = true;
                cancelPaymentBtn.style.opacity = '0.5';
            }

            // Save order
            saveOrder(paymentMethod);

            // Clear bill after successful payment
            successTimeout = setTimeout(() => {
                currentBill = [];
                updateBillDisplay();
                updateTotals();
                
                const paymentModal = document.getElementById('paymentModal');
                if (paymentModal) paymentModal.style.display = 'none';
                resetPaymentSections();
                
                // Update bill number for next order
                billNumber = getNextBillNumber();
                const billNumberElement = document.getElementById('billNumber');
                if (billNumberElement) billNumberElement.textContent = billNumber;
            }, 2000);
        }, 3000);
    }

    // Helper function to get payment section ID from method
    function getPaymentSectionId(method) {
        if (method.includes('upi')) {
            return 'upiQRCode';
        } else if (method.includes('card')) {
            return 'cardPaymentSection';
        } else if (method.includes('cash')) {
            return 'cashPaymentSection';
        }
        return '';
    }

    function saveOrder(paymentMethod) {
        // Get current order details
        const subtotal = document.getElementById('subtotal').textContent;
        const gst = document.getElementById('gst').textContent;
        const total = document.getElementById('total').textContent;
        
        // Create new order object
        const newOrder = {
            id: Date.now().toString(),
            billNumber: billNumber,
            items: [...currentBill],
            subtotal: subtotal,
            gst: gst,
            total: total,
            date: new Date().toISOString(),
            paymentMethod: paymentMethod,
            status: 'pending'
        };
        
        // Get existing orders and add the new one
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(newOrder);
        
        // Save updated orders list
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Check if assets exist, create data URL images if not
    (function checkAssets() {
        // Check if UPI QR image exists and create one if not
        const upiQRImg = document.querySelector('.upi-qr-image');
        if (upiQRImg && (!upiQRImg.src || !upiQRImg.src.includes('upi-qr'))) {
            // Set to the actual image path
            upiQRImg.src = 'assets/images/upi-qr.png';
        }
    })();
    
    // Initialize all toggle switches
    const alcoholicToggle = document.getElementById('alcoholicToggle');
    if (alcoholicToggle) {
        alcoholicToggle.checked = false;
        const toggleLabel = document.getElementById('toggleLabel');
        if (toggleLabel) {
            toggleLabel.textContent = 'Non-Alcoholic';
        }
    }
    
    const nonVegStartersToggle = document.getElementById('nonVegStartersToggle');
    if (nonVegStartersToggle) {
        nonVegStartersToggle.checked = false;
        const toggleLabel = document.getElementById('startersToggleLabel');
        if (toggleLabel) {
            toggleLabel.textContent = 'Vegetarian';
        }
    }
    
    const nonVegMainToggle = document.getElementById('nonVegMainToggle');
    if (nonVegMainToggle) {
        nonVegMainToggle.checked = false;
        const toggleLabel = document.getElementById('mainToggleLabel');
        if (toggleLabel) {
            toggleLabel.textContent = 'Vegetarian';
        }
    }
    
    // Load initial menu (starters by default)
    loadMenuItems('starters');
});