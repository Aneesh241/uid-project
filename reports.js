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
    
    // Get DOM elements
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const applyFilterBtn = document.getElementById('applyDateFilter');
    
    const totalRevenueElement = document.getElementById('totalRevenue');
    const totalBillsElement = document.getElementById('totalBills');
    const itemsSoldElement = document.getElementById('itemsSold');
    const avgBillValueElement = document.getElementById('avgBillValue');
    const completionRateElement = document.getElementById('completionRate');
    const cancellationRateElement = document.getElementById('cancellationRate');
    
    const reportTabs = document.querySelectorAll('.report-tab');
    const reportContents = document.querySelectorAll('.report-table-container');
    
    // Set default date range (current month)
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    startDateInput.valueAsDate = firstDayOfMonth;
    endDateInput.valueAsDate = today;
    
    // Filter orders based on date range
    let filteredOrders = filterOrdersByDateRange(orders, firstDayOfMonth, today);
    
    // Initial load of reports
    updateReportSummary(filteredOrders);
    loadSalesReport(filteredOrders);
    loadItemsReport(filteredOrders);
    loadPaymentReport(filteredOrders);
    loadCancellationReport(filteredOrders);
    
    // Apply date filter
    applyFilterBtn.addEventListener('click', () => {
        const startDate = startDateInput.valueAsDate;
        const endDate = endDateInput.valueAsDate;
        
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }
        
        if (startDate > endDate) {
            alert('Start date cannot be after end date');
            return;
        }
        
        filteredOrders = filterOrdersByDateRange(orders, startDate, endDate);
        
        updateReportSummary(filteredOrders);
        loadSalesReport(filteredOrders);
        loadItemsReport(filteredOrders);
        loadPaymentReport(filteredOrders);
        loadCancellationReport(filteredOrders);
    });
    
    // Toggle between report tabs
    reportTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            reportTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            const tabId = tab.dataset.tab;
            reportContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId + 'Report') {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Export buttons
    document.getElementById('exportSales').addEventListener('click', () => {
        exportToCSV('sales_report', getSalesReportData(filteredOrders));
    });
    
    document.getElementById('exportItems').addEventListener('click', () => {
        exportToCSV('items_report', getItemsReportData(filteredOrders));
    });
    
    document.getElementById('exportPayment').addEventListener('click', () => {
        exportToCSV('payment_report', getPaymentReportData(filteredOrders));
    });
    
    document.getElementById('exportCancellation').addEventListener('click', () => {
        exportToCSV('cancellation_report', getCancellationReportData(filteredOrders));
    });
    
    // Function to filter orders by date range
    function filterOrdersByDateRange(allOrders, startDate, endDate) {
        // Set end date to end of day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        
        return allOrders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startDate && orderDate <= endDateTime;
        });
    }
    
    // Function to update summary cards
    function updateReportSummary(ordersData) {
        // Calculate total revenue
        const totalRevenue = ordersData.reduce((sum, order) => {
            // Only include completed orders in revenue calculation
            if (order.status === 'completed') {
                const orderTotal = parseFloat(order.total.replace(/[^\d.]/g, ''));
                return sum + orderTotal;
            }
            return sum;
        }, 0);
        
        // Count total bills
        const totalBills = ordersData.length;
        
        // Count completed orders
        const completedOrders = ordersData.filter(order => order.status === 'completed').length;
        
        // Count cancelled orders
        const cancelledOrders = ordersData.filter(order => order.status === 'cancelled').length;
        
        // Calculate percentages
        const completionRate = totalBills > 0 ? (completedOrders / totalBills) * 100 : 0;
        const cancellationRate = totalBills > 0 ? (cancelledOrders / totalBills) * 100 : 0;
        
        // Count items sold
        const itemsSold = ordersData.reduce((sum, order) => {
            // Only count items from completed orders
            if (order.status === 'completed') {
                return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
            }
            return sum;
        }, 0);
        
        // Calculate average bill value
        const avgBillValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
        
        // Update UI
        totalRevenueElement.textContent = `₹${totalRevenue.toFixed(2)}`;
        totalBillsElement.textContent = totalBills;
        itemsSoldElement.textContent = itemsSold;
        avgBillValueElement.textContent = `₹${avgBillValue.toFixed(2)}`;
        completionRateElement.textContent = `${completionRate.toFixed(1)}%`;
        cancellationRateElement.textContent = `${cancellationRate.toFixed(1)}%`;
    }
    
    // Function to load sales report
    function loadSalesReport(ordersData) {
        const tableBody = document.getElementById('salesTableBody');
        tableBody.innerHTML = '';
        
        if (ordersData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="no-data">No data available for the selected date range</td>';
            tableBody.appendChild(row);
            return;
        }
        
        // Sort orders by date (newest first)
        ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        ordersData.forEach(order => {
            const row = document.createElement('tr');
            
            // Format date
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString();
            
            // Count total items
            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
            
            // Create row
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${order.billNumber}</td>
                <td>${totalItems}</td>
                <td>${order.paymentMethod}</td>
                <td><span class="status-badge ${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
                <td>${order.total}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Function to load items report
    function loadItemsReport(ordersData) {
        const tableBody = document.getElementById('itemsTableBody');
        tableBody.innerHTML = '';
        
        if (ordersData.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" class="no-data">No data available for the selected date range</td>';
            tableBody.appendChild(row);
            return;
        }
        
        // Aggregate item data
        const itemsData = {};
        let totalRevenue = 0;
        
        ordersData.forEach(order => {
            // Only include completed orders
            if (order.status === 'completed' || order.status === 'pending') {
                order.items.forEach(item => {
                    const itemRevenue = item.price * item.quantity;
                    totalRevenue += itemRevenue;
                    
                    if (itemsData[item.name]) {
                        itemsData[item.name].quantity += item.quantity;
                        itemsData[item.name].revenue += itemRevenue;
                    } else {
                        itemsData[item.name] = {
                            quantity: item.quantity,
                            revenue: itemRevenue
                        };
                    }
                });
            }
        });
        
        // Convert to array and sort by revenue (highest first)
        const itemsArray = Object.keys(itemsData).map(name => ({
            name,
            ...itemsData[name],
            percentage: (itemsData[name].revenue / totalRevenue) * 100
        }));
        
        itemsArray.sort((a, b) => b.revenue - a.revenue);
        
        // Create table rows
        itemsArray.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.revenue.toFixed(2)}</td>
                <td>${item.percentage.toFixed(2)}%</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Function to load payment report
    function loadPaymentReport(ordersData) {
        if (ordersData.length === 0) {
            document.getElementById('upiBar').style.width = '0%';
            document.getElementById('cardBar').style.width = '0%';
            document.getElementById('cashBar').style.width = '0%';
            
            document.getElementById('upiPercent').textContent = '0%';
            document.getElementById('cardPercent').textContent = '0%';
            document.getElementById('cashPercent').textContent = '0%';
            
            document.getElementById('upiAmount').textContent = '0';
            document.getElementById('cardAmount').textContent = '0';
            document.getElementById('cashAmount').textContent = '0';
            
            return;
        }
        
        // Calculate payment method totals
        const paymentData = {
            upi: 0,
            card: 0,
            cash: 0
        };
        
        ordersData.forEach(order => {
            // Extract the numeric value from strings like '₹450.00'
            const orderTotal = parseFloat(order.total.replace(/[^\d.]/g, ''));
            
            if (order.paymentMethod.toLowerCase().includes('upi')) {
                paymentData.upi += orderTotal;
            } else if (order.paymentMethod.toLowerCase().includes('card')) {
                paymentData.card += orderTotal;
            } else if (order.paymentMethod.toLowerCase().includes('cash')) {
                paymentData.cash += orderTotal;
            }
        });
        
        const totalAmount = paymentData.upi + paymentData.card + paymentData.cash;
        
        // Calculate percentages
        const percentages = {
            upi: totalAmount > 0 ? (paymentData.upi / totalAmount) * 100 : 0,
            card: totalAmount > 0 ? (paymentData.card / totalAmount) * 100 : 0,
            cash: totalAmount > 0 ? (paymentData.cash / totalAmount) * 100 : 0
        };
        
        // Update chart bars
        document.getElementById('upiBar').style.width = `${percentages.upi}%`;
        document.getElementById('cardBar').style.width = `${percentages.card}%`;
        document.getElementById('cashBar').style.width = `${percentages.cash}%`;
        
        // Update percentages
        document.getElementById('upiPercent').textContent = `${percentages.upi.toFixed(2)}%`;
        document.getElementById('cardPercent').textContent = `${percentages.card.toFixed(2)}%`;
        document.getElementById('cashPercent').textContent = `${percentages.cash.toFixed(2)}%`;
        
        // Update amounts
        document.getElementById('upiAmount').textContent = paymentData.upi.toFixed(2);
        document.getElementById('cardAmount').textContent = paymentData.card.toFixed(2);
        document.getElementById('cashAmount').textContent = paymentData.cash.toFixed(2);
    }
    
    // Function to load cancellation report
    function loadCancellationReport(ordersData) {
        const cancellationTableBody = document.getElementById('cancellationTableBody');
        cancellationTableBody.innerHTML = '';
        
        // Get the counts
        const totalOrders = ordersData.length;
        const completedOrders = ordersData.filter(order => order.status === 'completed').length;
        const cancelledOrders = ordersData.filter(order => order.status === 'cancelled').length;
        const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
        
        // Calculate percentages
        const completedPercent = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
        const cancelledPercent = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;
        const pendingPercent = totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0;
        
        // Update chart bars
        document.getElementById('completedBar').style.width = `${completedPercent}%`;
        document.getElementById('cancelledBar').style.width = `${cancelledPercent}%`;
        document.getElementById('pendingBar').style.width = `${pendingPercent}%`;
        
        // Update percentages and counts
        document.getElementById('completedPercent').textContent = `${completedPercent.toFixed(1)}%`;
        document.getElementById('cancelledPercent').textContent = `${cancelledPercent.toFixed(1)}%`;
        document.getElementById('pendingPercent').textContent = `${pendingPercent.toFixed(1)}%`;
        
        document.getElementById('completedCount').textContent = completedOrders;
        document.getElementById('cancelledCount').textContent = cancelledOrders;
        document.getElementById('pendingCount').textContent = pendingOrders;
        
        // If no cancelled orders, show message
        if (cancelledOrders === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4" class="no-data">No cancelled orders in the selected period</td>';
            cancellationTableBody.appendChild(row);
            return;
        }
        
        // Filter and sort cancelled orders (newest first)
        const cancelledOrdersData = ordersData
            .filter(order => order.status === 'cancelled')
            .sort((a, b) => new Date(b.cancellationDate || b.date) - new Date(a.cancellationDate || a.date));
        
        // Create table rows
        cancelledOrdersData.forEach(order => {
            const row = document.createElement('tr');
            
            // Format date
            const cancellationDate = order.cancellationDate ? new Date(order.cancellationDate) : new Date(order.date);
            const formattedDate = cancellationDate.toLocaleDateString() + ' ' + cancellationDate.toLocaleTimeString();
            
            row.innerHTML = `
                <td>${order.billNumber}</td>
                <td>${formattedDate}</td>
                <td>${order.total}</td>
                <td>${order.cancellationReason || 'Not specified'}</td>
            `;
            
            cancellationTableBody.appendChild(row);
        });
    }
    
    // Helper functions for data export
    function getSalesReportData(ordersData) {
        const headers = ['Date', 'Bill #', 'Items', 'Payment Method', 'Status', 'Amount'];
        
        const rows = ordersData.map(order => {
            try {
                const orderDate = new Date(order.date);
                const formattedDate = orderDate.toLocaleDateString();
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                
                return [
                    formattedDate,
                    order.billNumber,
                    totalItems,
                    order.paymentMethod,
                    capitalizeFirstLetter(order.status),
                    order.total.replace('₹', '')
                ];
            } catch (error) {
                console.error('Error creating export row:', error);
                return ['Error', 'Error', 'Error', 'Error', 'Error', 'Error'];
            }
        });
        
        return [headers, ...rows];
    }
    
    function getItemsReportData(ordersData) {
        // Headers
        const headers = ['Item Name', 'Quantity Sold', 'Revenue Generated', '% of Total Revenue'];
        
        try {
            // Aggregate item data
            const itemsData = {};
            let totalRevenue = 0;
            
            ordersData.forEach(order => {
                if (order.status === 'completed' || order.status === 'pending') {
                    order.items.forEach(item => {
                        const itemRevenue = item.price * item.quantity;
                        totalRevenue += itemRevenue;
                        
                        if (itemsData[item.name]) {
                            itemsData[item.name].quantity += item.quantity;
                            itemsData[item.name].revenue += itemRevenue;
                        } else {
                            itemsData[item.name] = {
                                quantity: item.quantity,
                                revenue: itemRevenue
                            };
                        }
                    });
                }
            });
            
            // Convert to array
            const rows = Object.keys(itemsData).map(name => {
                const percentage = (itemsData[name].revenue / totalRevenue) * 100;
                
                return [
                    name,
                    itemsData[name].quantity,
                    itemsData[name].revenue.toFixed(2),
                    percentage.toFixed(2) + '%'
                ];
            });
            
            return [headers, ...rows];
        } catch (error) {
            console.error('Error generating items report data:', error);
            return [headers, ['Error generating report data']];
        }
    }
    
    function getPaymentReportData(ordersData) {
        try {
            // Calculate payment method totals
            const paymentData = {
                upi: 0,
                card: 0,
                cash: 0
            };
            
            ordersData.forEach(order => {
                const orderTotal = parseFloat(String(order.total).replace(/[^\d.-]/g, '')) || 0;
                
                const paymentMethod = String(order.paymentMethod).toLowerCase();
                if (paymentMethod.includes('upi')) {
                    paymentData.upi += orderTotal;
                } else if (paymentMethod.includes('card')) {
                    paymentData.card += orderTotal;
                } else if (paymentMethod.includes('cash')) {
                    paymentData.cash += orderTotal;
                }
            });
            
            const totalAmount = paymentData.upi + paymentData.card + paymentData.cash;
            
            // Calculate percentages
            const percentages = {
                upi: totalAmount > 0 ? (paymentData.upi / totalAmount) * 100 : 0,
                card: totalAmount > 0 ? (paymentData.card / totalAmount) * 100 : 0,
                cash: totalAmount > 0 ? (paymentData.cash / totalAmount) * 100 : 0
            };
            
            return [
                ['Payment Method', 'Amount', 'Percentage'],
                ['UPI', paymentData.upi.toFixed(2), percentages.upi.toFixed(2) + '%'],
                ['Card', paymentData.card.toFixed(2), percentages.card.toFixed(2) + '%'],
                ['Cash', paymentData.cash.toFixed(2), percentages.cash.toFixed(2) + '%'],
                ['Total', totalAmount.toFixed(2), '100.00%']
            ];
        } catch (error) {
            console.error('Error generating payment report data:', error);
            return [
                ['Payment Method', 'Amount', 'Percentage'],
                ['Error generating report data']
            ];
        }
    }
    
    function getCancellationReportData(ordersData) {
        try {
            // Calculate totals for header rows
            const totalOrders = ordersData.length;
            const completedOrders = ordersData.filter(order => order.status === 'completed').length;
            const cancelledOrders = ordersData.filter(order => order.status === 'cancelled').length;
            const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
            
            const completedPercent = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
            const cancelledPercent = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;
            const pendingPercent = totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0;
            
            // Create header rows
            const headerRows = [
                ['Order Status Statistics'],
                ['Status', 'Count', 'Percentage'],
                ['Completed', completedOrders, `${completedPercent.toFixed(1)}%`],
                ['Cancelled', cancelledOrders, `${cancelledPercent.toFixed(1)}%`],
                ['Pending', pendingOrders, `${pendingPercent.toFixed(1)}%`],
                ['Total', totalOrders, '100%'],
                [''],
                ['Cancellation Details'],
                ['Bill #', 'Date', 'Amount', 'Cancellation Reason']
            ];
            
            // Get cancelled orders data
            const cancelledOrdersData = ordersData
                .filter(order => order.status === 'cancelled')
                .map(order => {
                    const cancellationDate = order.cancellationDate ? new Date(order.cancellationDate) : new Date(order.date);
                    const formattedDate = cancellationDate.toLocaleDateString() + ' ' + cancellationDate.toLocaleTimeString();
                    
                    return [
                        order.billNumber,
                        formattedDate,
                        order.total.replace('₹', ''),
                        order.cancellationReason || 'Not specified'
                    ];
                });
            
            // Combine header rows with cancelled orders data
            return [...headerRows, ...cancelledOrdersData];
        } catch (error) {
            console.error('Error generating cancellation report data:', error);
            return [
                ['Error generating cancellation report data']
            ];
        }
    }
    
    // Function to export data to CSV
    function exportToCSV(filename, rows) {
        try {
            let csvContent = "data:text/csv;charset=utf-8,";
            
            rows.forEach(row => {
                // Properly escape values for CSV format
                const escapedRow = row.map(value => {
                    // Convert value to string and handle nulls/undefined
                    const str = (value === null || value === undefined) ? '' : String(value);
                    // Escape quotes and wrap in quotes if contains comma, quotes, or newlines
                    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                        return '"' + str.replace(/"/g, '""') + '"';
                    }
                    return str;
                });
                csvContent += escapedRow.join(',') + '\r\n';
            });
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', filename + '_' + formatDate(new Date()) + '.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Error exporting data. Please try again.');
        }
    }
    
    // Helper function to format date for filenames
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Helper function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Add this to the DOMContentLoaded event handler in reports.js
    // It will highlight the Reports link in the sidebar
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.sidebar-menu li a[href="reports.html"]')?.parentElement.classList.add('active');
}); 