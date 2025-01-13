const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

// Mock database of users
let users = [
    { id: 1, name: 'alex gorin', role: 'Member' },
    { id: 2, name: 'cayden nicholas', role: 'Kiosk' },
    { id: 3, name: 'joce philip', role: 'Plant' },
    { id: 4, name: 'saif adwan', role: 'Administrator' },
];

// Middleware
app.use(bodyParser.json());

// Simulate authentication middleware
const authenticate = (req, res, next) => {
    const mockUserSession = { id: 4, role: 'Administrator' }; // Replace with real session or token logic
    req.user = mockUserSession;
    next();
};

// Authorization middleware for admins
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'Administrator') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

// Endpoint to get all users
app.get('/users', authenticate, authorizeAdmin, (req, res) => {
    res.status(200).json(users);
});

// Endpoint to edit a user
app.put('/users/:id', authenticate, authorizeAdmin, (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, role } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    if (name) user.name = name;
    if (role) user.role = role;

    res.status(200).json({ message: 'User updated successfully', user });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
