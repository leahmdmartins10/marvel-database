require('dotenv').config();
const CryptoJS = require('crypto-js');

// Set up environment variables (e.g. for API keys)
const MARVEL_PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;
const MARVEL_PRIVATE_API_KEY = process.env.PRIVATE_API_KEY;
const MARVEL_API_URL = 'https://gateway.marvel.com/v1/public/';

module.exports = {
    getAllCharacters,
    getCharacterById
}

async function getAllCharacters(req, res) {
    console.log(`You in the getCharacters route!`);
    const offset = req.query.offset || 0; // Get offset from query params (default to 0)
    const limit = req.query.limit || 100; // Get limit from query params (default to 100)

    console.log(`Fetching all characters...`);

    const ts = new Date().getTime(); // Timestamp for Marvel API
    const hash = CryptoJS.MD5(
        ts + MARVEL_PRIVATE_API_KEY + MARVEL_PUBLIC_API_KEY
    ).toString();
    let url;

    // Determine which Marvel endpoint to hit based on category
    url = `${MARVEL_API_URL}characters?ts=${ts}&apikey=${MARVEL_PUBLIC_API_KEY}&hash=${hash}&offset=${offset}&limit=${limit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data); // Return data to frontend
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from Marvel API" });
    }
}

async function getCharacterById(req, res) {
    console.log(`You in the getCharacterById route!`);
    const id = req.params.id;
    const ts = new Date().getTime(); // Timestamp for Marvel API
    const hash = CryptoJS.MD5(
        ts + MARVEL_PRIVATE_API_KEY + MARVEL_PUBLIC_API_KEY
    ).toString();
    const url = `${MARVEL_API_URL}characters/${id}?ts=${ts}&apikey=${MARVEL_PUBLIC_API_KEY}&hash=${hash}`;

    try{
        const response = await fetch(url);
        const data = await response.json();
        res.json(data); // Return data to frontend
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from Marvel API" });
    }
}
