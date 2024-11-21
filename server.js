require('dotenv').config();

// Backend: Express server code (server.js or app.js)
const express = require('express');
const CryptoJS = require('crypto-js');
const cors = require('cors');
const logger = require('morgan');


const app = express();
const port = 3000;

// Set up environment variables (e.g. for API keys)
const MARVEL_PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;
const MARVEL_PRIVATE_API_KEY = process.env.PRIVATE_API_KEY;
const MARVEL_API_URL = 'https://gateway.marvel.com/v1/public/';

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

// Set up the route to fetch Marvel data
app.get('/api/getMarvelData', async (req, res) => {
    const category = req.query.category; // Get category from query params
    const offset = req.query.offset || 0; // Get offset from query params (default to 0)
    const limit = req.query.limit || 10; // Get limit from query params (default to 10)

    console.log(`Fetching data for category: ${category}`);

    const ts = new Date().getTime(); // Timestamp for Marvel API
    const hash = CryptoJS.MD5(ts + MARVEL_PRIVATE_API_KEY + MARVEL_PUBLIC_API_KEY).toString();
    let url;

    // Determine which Marvel endpoint to hit based on category
    if (category === 'character') {
        url = `${MARVEL_API_URL}characters?ts=${ts}&apikey=${MARVEL_PUBLIC_API_KEY}&hash=${hash}&offset=${offset}&limit=${limit}`;
    } else if (category === 'comic') {
        url = `${MARVEL_API_URL}comics?ts=${ts}&apikey=${MARVEL_PUBLIC_API_KEY}&hash=${hash}&offset=${offset}&limit=${limit}`;
    } else {
        return res.status(400).json({ error: 'Invalid category' });
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data); // Return data to frontend
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from Marvel API' });
    }
});

// Serve static files (e.g. HTML, JS, CSS)
app.use(express.static('public')); // Assumes your frontend is in a 'public' folder

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
