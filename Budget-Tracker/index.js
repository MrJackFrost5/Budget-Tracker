const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User') // USER MODEL
const app = express();
const PORT = 3000;

app.use(express.json()); // Parse JSON bodies 

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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Serve the main HTML file
});

// Create new user
app.post('/users2', async (req, res) => {
    const { username, firstname, lastname, password, email, creation_date, last_logged_in, has_access, plaid_access_token } = req.body;
    const user = new User({ username, firstname, lastname, password, email, creation_date, last_logged_in, has_access, plaid_access_token });

    try {
        await user.save();
        res.status(201).send(user); // Send the created user as a response
    } catch (error) {
        res.status(400).send({ error: 'Failed to create user' });
    }
});

// Get all users
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
