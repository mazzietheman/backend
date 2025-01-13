const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

// Middleware
app.use(express.json());

// Database setup
const sequelize = new Sequelize('sqlite::memory:');

// Models
const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING },
    group: { type: DataTypes.STRING }
});

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    pricePerGram: { type: DataTypes.FLOAT, allowNull: false }
});

const Transaction = sequelize.define('Transaction', {
    transId: { type: DataTypes.STRING, unique: true, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    memberId: { type: DataTypes.INTEGER, allowNull: false },
    kioskId: { type: DataTypes.INTEGER },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    weight: { type: DataTypes.FLOAT, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING }
});

// Routes
app.post('/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, city, group } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName, lastName, username, email, password: hashedPassword, city, group
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, group: user.group },
                'your_jwt_secret_key',
                { expiresIn: '1d' }
            );
            res.status(200).json({ accessToken: token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(403).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        if (decoded.group !== 'Administrator') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(403).json({ message: 'Unauthorized' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        if (decoded.group !== 'Administrator') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Initialize database and server
sequelize.sync({ force: true }).then(() => {
    console.log('Database synced');
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});
