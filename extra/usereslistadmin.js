const express = require('express');
const app = express();
const PORT = 3000;

// Mock database of users
const users = [
    { id: 1, name: 'alex gorin', role: 'Member' },
    { id: 2, name: 'cayden nicholas', role: 'Kiosk' },
    { id: 3, name: 'joce philip', role: 'Plant' },
    { id: 4, name: 'saif adwan', role: 'Administrator' },
];

// Middleware to simulate authentication and user role
const authenticate = (req, res, next) => {
    // Mock user session
    const mockUserSession = { id: 4, role: 'Administrator' }; // Replace with real session or token logic
    req.user = mockUserSession;
    next();
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'Administrator') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

// Endpoint to get all registered users
app.get('/users', authenticate, authorizeAdmin, (req, res) => {
    res.status(200).json(users);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});