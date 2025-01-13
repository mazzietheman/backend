const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Mock database of transactions (including kioskId for filtering)
let transactions = [
    { id: 1, kioskId: 1, productId: 2, amount: 200, date: '2025-01-12' },
    { id: 2, kioskId: 1, productId: 3, amount: 150, date: '2025-01-12' },
    { id: 3, kioskId: 2, productId: 1, amount: 100, date: '2025-01-11' },
    { id: 4, kioskId: 1, productId: 2, amount: 250, date: '2025-01-13' },
];

// Middleware
app.use(bodyParser.json());

// Simulate authentication middleware
const authenticate = (req, res, next) => {
    const mockUserSession = { id: 4, role: 'Kiosk' }; // Replace with real session or token logic
    req.user = mockUserSession;
    next();
};

// Authorization middleware for kiosks
const authorizeKiosk = (req, res, next) => {
    if (req.user.role !== 'Kiosk') {
        return res.status(403).json({ message: 'Access denied. Kiosk only.' });
    }
    next();
};

// Endpoint to get transactions for the specific kiosk
app.get('/transactions', authenticate, authorizeKiosk, (req, res) => {
    const kioskId = req.user.id;  // In a real system, kioskId would come from user session
    const filteredTransactions = transactions.filter(transaction => transaction.kioskId === kioskId);
    res.status(200).json(filteredTransactions);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
