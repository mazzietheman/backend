const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Mock database of products
let products = [
    { id: 1, name: 'Product A', price: 100, },
    { id: 2, name: 'Product B', price: 200, },
    { id: 3, name: 'Product C', price: 150, },
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

// Endpoint to get all products
app.get('/products', authenticate, authorizeAdmin, (req, res) => {
    res.status(200).json(products);
});

// Endpoint to update product name and price
app.put('/products/:id', authenticate, authorizeAdmin, (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price } = req.body;

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (price !== undefined) product.price = price;

    res.status(200).json({ message: 'Product updated successfully', product });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
