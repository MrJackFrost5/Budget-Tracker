// plaidClient.js
require('dotenv').config();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const config = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'plaid-client-id':'672fb5ecfda72b001a3536a2',
            'plaid-secret': '20e56ede89afe884af55d5ca4f9fd7',
        },
    },
});

const plaidClient = new PlaidApi(config);
module.exports = plaidClient;
