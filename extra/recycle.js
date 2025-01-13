const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Mock databases for members and recycle transactions
let members = [
    { id: '1', name: 'John Doe', role: 'Member' },
    { id: '2', name: 'Jane Smith', role: 'Member' },
];

let transactions = [];  // Store recycle transactions

// Simulate session or JWT for kiosk authorization
const authenticateKiosk = (req, res, next) => {
    const userRole = req.headers['role'];  // This could be fetched from JWT or session
    if (userRole !== 'Kiosk') {
        return res.status(403).json({ message: 'Access denied. Only kiosk can perform this action.' });
    }
    next();
};

// Middleware
app.use(bodyParser.json());

// Endpoint to fetch member details based on QR code result (member ID)
app.get('/member/:id', authenticateKiosk, (req, res) => {
    const memberId = req.params.id;
    const member = members.find(m => m.id === memberId);

    if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.json({ success: true, member });
});

// Endpoint to input a recycle transaction (Manual entry for product and weight)
app.post('/recycle', authenticateKiosk, (req, res) => {
    const { memberId, product, weight } = req.body;

    // Validate required fields
    if (!memberId || !product || !weight) {
        return res.status(400).json({ message: 'Missing required fields: memberId, product, weight' });
    }

    // Check if the member exists
    const member = members.find(m => m.id === memberId);
    if (!member) {
        return res.status(404).json({ message: 'Member not found' });
    }

    // Create a new recycle transaction
    const newTransaction = {
        id: transactions.length + 1,  // Simple ID generation
        memberId,
        product,
        weight,
    };

    // Save the new transaction
    transactions.push(newTransaction);

    res.status(201).json({
        message: 'Recycle transaction successfully recorded',
        transaction: newTransaction,
    });
});

// Endpoint to fetch all recycle transactions for a member
app.get('/member/:id/transactions', authenticateKiosk, (req, res) => {
    const memberId = req.params.id;
    const memberTransactions = transactions.filter(t => t.memberId === memberId);

    if (memberTransactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this member' });
    }

    res.json({ transactions: memberTransactions });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
