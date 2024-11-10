require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User') // USER MODEL
const app = express();
const PORT = 3000;

const plaidRoutes = require('./PlaidRoute'); // Import Plaid routes
const expenseRoutes = require('./public/expense.js');

app.use(express.json()); // Parse JSON bodies 

app.use('/expenses', expenseRoutes);

// session middleware
const session = require('express-session');

app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using HTTPS
}));

// Connect to database
async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://localhost/Users");
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Use Plaid routes for any endpoints starting with /api
app.use('/api', plaidRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Serve the main HTML file
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html'); // Serve the sign up page
});

// Testing below
app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/public/testing.html'); // Serve the stupid testing page
});

// Create new user
app.post('/create_account', async (req, res) => {
    const { username, firstname, lastname, password, email, creation_date, last_logged_in, has_access, credit_score } = req.body;
    const user = new User({ username, firstname, lastname, password, email, creation_date, last_logged_in, has_access, credit_score });

    try {
        await user.save();
        res.status(201).send(user); // Send the created user as a response
    } catch (error) {
        res.status(400).send({ error: 'Failed to create user' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            req.session.userId = user._id; // Store the user ID in the session
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/user_data', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    try {
        const user = await User.findById(req.session.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load user data' });
    }
});

app.post('/update_credit_score', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    
    const { newCreditScore } = req.body;
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // new credit score
        user.credit_score = newCreditScore;
        await user.save();

        res.status(200).json({ message: 'Credit score updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update credit score' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from the database
        res.status(200).json(users); // Send users as a JSON response
    } catch (error) {
        res.status(400).send({ error: 'Failed to retrieve users' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
