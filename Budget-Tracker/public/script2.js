// script.js
async function initializePlaidLink() {
    try {
        // Fetch the link token from the server
        const response = await fetch('/api/create_link_token');
        const data = await response.json();
        const linkToken = data.link_token;

        // Initialize Plaid Link with the link token
        const handler = Plaid.create({
            token: linkToken,
            onSuccess: async function(publicToken, metadata) {
                try {
                    console.log("line 14 script.js")
                    // Exchange the public token for an access token
                    const exchangeResponse = await fetch('/api/exchange_public_token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ public_token: publicToken })
                    });
                    console.log("line 21")

                    const exchangeData = await exchangeResponse.json();
                    const accessToken = exchangeData.access_token;

                    // Fetch and display the balance
                    await fetchAndDisplayBalance(accessToken);
                    alert("Bank account linked successfully!");
                } catch (error) {
                    console.error("Error exchanging public token:", error);
                }
            },
            onExit: function(err, metadata) {
                if (err) {
                    console.error("Plaid Link error:", err);
                }
            },
        });

        // Open Plaid Link when the "Link Bank Account" button is clicked
        document.getElementById('link-bank-button').onclick = function() {
            handler.open();
        };
    } catch (error) {
        console.error("Error initializing Plaid Link:", error);
    }
}

// Function to fetch balance and update the UI
async function fetchAndDisplayBalance(accessToken) {
    try {
        console.log("Fetching balance...");

        // Send access_token to backend to get balance
        const response = await fetch('/api/getBalance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: accessToken })
        });

        const data = await response.json();
        const accounts = data.accounts;

        console.log("test1");
        // Update the balance display if accounts are found
        if (accounts && accounts.length > 0) {
            const balance = accounts[0].balances.current;
            console.log(balance);
            document.getElementById('display-balance').textContent = balance.toFixed(2);
        } else {
            console.warn("No accounts found to display balance");
        }
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}




// Initialize Plaid Link on page load
initializePlaidLink();
