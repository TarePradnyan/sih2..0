// Market data storage
const marketData = {
    wheat: {
        name: 'Wheat',
        current: 2400,
        previous: 2350,
        data: [2200, 2250, 2300, 2350, 2380, 2400, 2400],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        high: 2450,
        low: 2200,
        color: '#f39c12'
    },
    rice: {
        name: 'Rice',
        current: 3400,
        previous: 3300,
        data: [3200, 3250, 3280, 3300, 3350, 3380, 3400],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        high: 3450,
        low: 3200,
        color: '#27ae60'
    },
    sugarcane: {
        name: 'Sugarcane',
        current: 1750,
        previous: 1720,
        data: [1550, 1600, 1650, 1680, 1720, 1740, 1750],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        high: 1780,
        low: 1550,
        color: '#8e44ad'
    },
    barley: {
        name: 'Barley',
        current: 2100,
        previous: 2050,
        data: [1950, 2000, 2020, 2050, 2080, 2090, 2100],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        high: 2120,
        low: 1950,
        color: '#e67e22'
    },
    bajra: {
        name: 'Bajra',
        current: 2400,
        previous: 2400,
        data: [2300, 2350, 2380, 2400, 2400, 2400, 2400],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        high: 2420,
        low: 2300,
        color: '#34495e'
    },
    cotton: {
        name: 'Cotton',
        current: 2900,
        previous: 2750,
        data: [2500, 2600, 2700, 2750, 2820, 2870, 2900],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        high: 2950,
        low: 2500,
        color: '#e74c3c'
    },
    maize: {
        name: 'Maize',
        current: 2100,
        previous: 2050,
        data: [1900, 1950, 2000, 2050, 2080, 2090, 2100],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        high: 2150,
        low: 1900,
        color: '#2980b9'
    },
    gram: {
        name: 'Gram',
        current: 5200,
        previous: 5100,
        data: [4900, 4950, 5000, 5050, 5100, 5150, 5200],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        high: 5300,
        low: 4900,
        color: '#d35400'
    }
};

let charts = {};
let selectedCrop = null;
let autoRefresh = true;
let refreshInterval;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    startAutoRefresh();
    updateLastUpdatedTime();
});

function initializeApp() {
    generatePriceCards();
    createAllCharts();
    setupEventListeners();
    simulateRealTimeUpdates();
}

// Generate price cards dynamically
function generatePriceCards() {
    const priceDisplay = document.getElementById('priceDisplay');
    if (!priceDisplay) {
        console.error('Error: Element with ID "priceDisplay" not found.');
        return;
    }
    priceDisplay.innerHTML = '';

    const cropOrder = ['bajra', 'barley', 'cotton', 'wheat', 'maize', 'sugarcane', 'gram', 'rice'];

    cropOrder.forEach(crop => {
        const data = marketData[crop];
        const change = data.current - data.previous;
        const changePercent = ((change / data.previous) * 100).toFixed(1);
        const changeClass = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
        const changeIcon = change > 0 ? '↗' : change < 0 ? '↘' : '→';

        const card = document.createElement('div');
        card.className = 'price-card fade-in';
        card.addEventListener('click', (event) => selectCrop(crop, event.currentTarget));

        card.innerHTML = `
            <div class="price-header">
                <img src="../img/market/${crop}.jpg" alt="${data.name}" class="crop-icon">
                <div class="crop-name">${data.name}</div>
            </div>
            <div class="current-price">₹${data.current.toLocaleString()}</div>
            <div class="price-change">
                <span class="change-indicator ${changeClass}">
                    ${changeIcon} ₹${Math.abs(change)} (${Math.abs(changePercent)}%)
                </span>
            </div>
            <div class="text-muted" style="font-size: 0.85rem;">per quintal</div>
        `;

        priceDisplay.appendChild(card);
    });
}


// Create enhanced line charts
function createLineChart(canvasId, crop) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const data = marketData[crop];

    return new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: `${data.name} Price (₹/quintal)`,
                data: data.data,
                borderColor: data.color,
                backgroundColor: `${data.color}15`,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: data.color,
                pointBorderWidth: 2,
                pointHoverBackgroundColor: data.color,
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: data.color,
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Price: ₹${context.parsed.y.toLocaleString()}/quintal`;
                        },
                        afterLabel: function(context) {
                            const previousValue = context.dataIndex > 0 ? data.data[context.dataIndex - 1] : context.parsed.y;
                            const change = context.parsed.y - previousValue;
                            const changePercent = ((change / previousValue) * 100).toFixed(1);
                            if (context.dataIndex > 0) {
                                return `Change: ${change > 0 ? '+' : ''}₹${change} (${changePercent}%)`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    ticks: {
                        callback: function(value) { return '₹' + value.toLocaleString(); },
                        color: '#666666'
                    }
                },
                x: {
                    grid: { color: 'rgba(0,0,0,0.1)' },
                    ticks: { color: '#666666' }
                }
            },
            interaction: { intersect: false, mode: 'index' },
            animation: { duration: 1000, easing: 'easeInOutQuart' }
        }
    });
}

// Create all charts
function createAllCharts() {
    Object.keys(marketData).forEach(crop => {
        const chartId = crop + 'Chart';
        charts[crop] = createLineChart(chartId, crop);
    });
}

// Select crop for detailed view
function selectCrop(crop) {
    document.querySelectorAll('.price-card').forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    selectedCrop = crop;

    const graphElement = document.getElementById(crop + 'Graph');
    if (graphElement) {
        graphElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        graphElement.style.transform = 'scale(1.02)';
        graphElement.style.boxShadow = '0 12px 32px rgba(45, 90, 45, 0.2)';
        setTimeout(() => {
            graphElement.style.transform = '';
            graphElement.style.boxShadow = '';
        }, 1000);
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('marketSelect').addEventListener('change', function() {
        const selectedMarket = this.value;
        filterByMarket(selectedMarket);
    });

    document.getElementById('timeRange').addEventListener('change', function() {
        const selectedRange = this.value;
        updateTimeRange(selectedRange);
    });

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshData();
        }
    });
}

// Filter data by market
function filterByMarket(market) {
    if (market === 'all') {
        generatePriceCards();
        updateAllCharts();
    } else {
        const marketMultipliers = {
            'delhi': 1.05,
            'mumbai': 1.08,
            'kolkata': 0.98,
            'chennai': 1.02,
            'ludhiana': 0.95,
            'ahmedabad': 1.03
        };
        const multiplier = marketMultipliers[market] || 1;
        applyPriceAdjustment(multiplier);
    }
}

// Apply price adjustments for different markets
function applyPriceAdjustment(multiplier) {
    Object.keys(marketData).forEach(crop => {
        const originalData = { ...marketData[crop] };
        marketData[crop].current = Math.round(originalData.current * multiplier);
        marketData[crop].previous = Math.round(originalData.previous * multiplier);
        marketData[crop].data = originalData.data.map(price => Math.round(price * multiplier));
        marketData[crop].high = Math.round(originalData.high * multiplier);
        marketData[crop].low = Math.round(originalData.low * multiplier);
    });

    generatePriceCards();
    updateAllCharts();
    updatePriceStats();
}

// Update time range for charts
function updateTimeRange(range) {
    const rangeLabels = {
        '1d': ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
        '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        '1m': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        '3m': ['Month 1', 'Month 2', 'Month 3'],
        '6m': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        '1y': ['Q1', 'Q2', 'Q3', 'Q4']
    };

    const labels = rangeLabels[range] || rangeLabels['7d'];

    Object.keys(marketData).forEach(crop => {
        marketData[crop].labels = labels;
        marketData[crop].data = generateTimeRangeData(range, marketData[crop].current);
    });

    updateAllCharts();
}

// Generate data for different time ranges
function generateTimeRangeData(range, currentPrice) {
    const dataPoints = { '1d': 5, '7d': 7, '1m': 4, '3m': 3, '6m': 6, '1y': 4 };
    const points = dataPoints[range] || 7;
    const data = [];
    const volatility = currentPrice * 0.1;

    for (let i = 0; i < points; i++) {
        const variation = (Math.random() - 0.5) * volatility;
        const price = Math.round(currentPrice + variation - (volatility * 0.2 * (points - i)));
        data.push(Math.max(price, currentPrice * 0.8));
    }

    data[data.length - 1] = currentPrice;
    return data;
}

// Update all charts with new data
function updateAllCharts() {
    Object.keys(charts).forEach(crop => {
        if (charts[crop]) {
            charts[crop].data.labels = marketData[crop].labels;
            charts[crop].data.datasets[0].data = marketData[crop].data;
            charts[crop].update('active');
        }
    });
}

// Update price statistics in chart cards
function updatePriceStats() {
    Object.keys(marketData).forEach(crop => {
        const data = marketData[crop];
        const graphElement = document.getElementById(crop + 'Graph');
        if (graphElement) {
            const stats = graphElement.querySelectorAll('.stat-value');
            if (stats.length >= 4) {
                stats[0].textContent = `₹${data.current.toLocaleString()}`;
                stats[1].textContent = `₹${data.high.toLocaleString()}`;
                stats[2].textContent = `₹${data.low.toLocaleString()}`;

                const change = data.current - data.previous;
                const changePercent = ((change / data.previous) * 100).toFixed(1);
                stats[3].textContent = `${change > 0 ? '+' : ''}${changePercent}%`;
                stats[3].className = `stat-value ${change > 0 ? 'text-success' : change < 0 ? 'text-danger' : ''}`;
            }
        }
    });
}

// Refresh data
function refreshData() {
    const button = document.querySelector('.btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"></div> Refreshing...';
    button.disabled = true;

    setTimeout(() => {
        simulateMarketUpdate();
        generatePriceCards();
        updateAllCharts();
        updatePriceStats();
        updateLastUpdatedTime();
        updateMarketSummary();

        button.innerHTML = originalText;
        button.disabled = false;
        showNotification('Market data refreshed successfully!', 'success');
    }, 1500);
}

// Simulate market updates
function simulateMarketUpdate() {
    Object.keys(marketData).forEach(crop => {
        const data = marketData[crop];
        const volatility = data.current * 0.02;
        const change = (Math.random() - 0.5) * volatility;

        data.previous = data.current;
        data.current = Math.round(Math.max(data.current + change, data.current * 0.9));
        data.data[data.data.length - 1] = data.current;
        data.high = Math.max(data.high, data.current);
        data.low = Math.min(data.low, data.current);
    });
    updateLastUpdatedTime();
}

// Update market summary
function updateMarketSummary() {
    let topGainer = { crop: '', change: -Infinity };
    let risingCount = 0;
    let totalPrices = 0;
    let priceCount = 0;

    Object.keys(marketData).forEach(crop => {
        const data = marketData[crop];
        const change = data.current - data.previous;
        const changePercent = (change / data.previous) * 100;

        if (changePercent > topGainer.change) {
            topGainer = { crop: data.name, change: changePercent, amount: change };
        }

        if (change > 0) risingCount++;
        totalPrices += data.current;
        priceCount++;
    });

    const averagePrice = Math.round(totalPrices / priceCount);

    const summaryCards = document.querySelectorAll('.summary-card');
    if (summaryCards.length >= 3) {
        summaryCards[0].querySelector('.summary-value').textContent = topGainer.crop;
        summaryCards[0].querySelector('.summary-change').textContent =
            `↗ +₹${Math.round(topGainer.amount)}/quintal (+${topGainer.change.toFixed(1)}%)`;

        const trend = risingCount > 3 ? 'Bullish' : risingCount < 2 ? 'Bearish' : 'Mixed';
        summaryCards[1].querySelector('.summary-value').textContent = trend;
        summaryCards[1].querySelector('.summary-change').textContent =
            `${risingCount > 3 ? '↗' : risingCount < 2 ? '↘' : '→'} ${risingCount} crops rising`;

        summaryCards[2].querySelector('.summary-value').textContent = `₹${averagePrice.toLocaleString()}`;
    }
}

// Update last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) lastUpdatedElement.textContent = timeString;
}

// Export data
function exportData() {
    const csvData = [['Crop', 'Current Price (₹/quintal)', 'Previous Price', 'Change', 'Change %', '7-Day High', '7-Day Low']];
    Object.keys(marketData).forEach(crop => {
        const data = marketData[crop];
        const change = data.current - data.previous;
        const changePercent = ((change / data.previous) * 100).toFixed(2);
        csvData.push([data.name, data.current, data.previous, change, changePercent + '%', data.high, data.low]);
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `market_prices_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Market data exported successfully!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize market summary on page load
setTimeout(() => updateMarketSummary(), 500);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.altKey) {
        switch(e.key) {
            case 'r':
                e.preventDefault();
                refreshData();
                break;
            case 'e':
                e.preventDefault();
                exportData();
                break;
            case '1':
                e.preventDefault();
                document.getElementById('timeRange').value = '1d';
                updateTimeRange('1d');
                break;
            case '7':
                e.preventDefault();
                document.getElementById('timeRange').value = '7d';
                updateTimeRange('7d');
                break;
        }
    }
});

console.log('🌾 Kisaan Mitra Market Intelligence System Loaded');
console.log('💡 Keyboard shortcuts: Alt+R: Refresh, Alt+E: Export, Alt+1: 1 Day view, Alt+7: 7 Day view');
