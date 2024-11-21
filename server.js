// server.js file - Express Server, backend logic

// dependencies requiremetnts
const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();
const cors = require('cors');
const logger = require('morgan');
const CryptoJS = require('crypto-js');

// configuring our express application
const PORT = process.env.PORT || 3000;
const app = express();

// loading the API keys from the .env file
// also loading the API key variables that I need
const ts = '1';
const publicAPIKey = process.env.PUBLIC_API_KEY;
const privateAPIKey = process.env.PRIVATE_API_KEY;
const hash = CryptoJS.MD5(ts + privateAPIKey + publicAPIKey).toString();
let url;

// middleware pipelines
app.use(cors());
app.use(logger('dev'));
app.use(express.json());

// routes
// api fetching route
app.get('/api/getMarvelData', async (req, res) => {
    const category = req.query.category;
    console.log('Fetching data from: ' + category + '...');
    url = `https://gateway.marvel.com/v1/public/${category}?ts=${ts}&apikey=${publicAPIKey}&hash=${hash}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json({results: data.data.results});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data from Marvel API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});