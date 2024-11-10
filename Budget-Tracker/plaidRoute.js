// plaidRoutes.js
const express = require('express');
const plaidClient = require('./plaidClient'); // Import the Plaid client
const router = express.Router();

// Route to create a link token
router.get('/create_link_token', async (req, res) => {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: 'user_good' },
            client_name: 'BrokeAF',
            products: ['auth', 'transactions'],
            country_codes: ['CA'],
            language: 'en',
            redirect_uri: 'http://localhost:3000/'
        });
        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error("Error creating link token:", error);
        res.status(500).json({ error: "Failed to create link token" });
    }
});

// Route to exchange public token for access token
router.post('/exchange_public_token', async (req, res) => {
    const { public_token } = req.body;
    try {
        const response = await plaidClient.itemPublicTokenExchange({ public_token });
        const accessToken = response.data.access_token;
        res.json({ access_token: accessToken });
    } catch (error) {
        console.error("Error exchanging public token:", error);
        res.status(500).json({ error: "Failed to exchange public token" });
    }
});

// Route to get balance using access token
router.post('/getBalance', async (req, res) => {
    const { access_token } = req.body;
    console.log("Received access_token:", access_token); // Check if access_token is coming through

    try {
        const response = await plaidClient.accountsBalanceGet({ access_token });
        console.log("Plaid response:", response.data); // Log the entire response for debugging
        const accounts = response.data.accounts;
        res.json({ accounts });
    } catch (error) {
        console.error("Error fetching balance information:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch balance" });
    }
});


module.exports = router; // Export the router
