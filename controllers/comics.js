require('dotenv').config();
const CryptoJS = require('crypto-js');

// Set up environment variables (e.g. for API keys)
const MARVEL_PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;
const MARVEL_PRIVATE_API_KEY = process.env.PRIVATE_API_KEY;
const MARVEL_API_URL = 'https://gateway.marvel.com/v1/public/';

module.exports = {
    getAllComics,
    getAllComicsByCharacter
}

async function getAllComics(req, res){
    const category = req.query.category; // Get category from query params
    const offset = req.query.offset || 0; // Get offset from query params (default to 0)
    const limit = req.query.limit || 100; // Get limit from query params (default to 100)

    console.log(`Fetching data for category: ${category}`);

    const ts = new Date().getTime(); // Timestamp for Marvel API
    const hash = CryptoJS.MD5(
        ts + MARVEL_PRIVATE_API_KEY + MARVEL_PUBLIC_API_KEY
    ).toString();
    let url;

    // Determine which Marvel endpoint to hit based on category
    if (category === "comics") {
        url = `${MARVEL_API_URL}comics?ts=${ts}&apikey=${MARVEL_PUBLIC_API_KEY}&hash=${hash}&offset=${offset}&limit=${limit}`;
    } else {
        return res.status(400).json({ error: "Invalid category" });
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data); // Return data to frontend
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from Marvel API" });
    }
}

async function getAllComicsByCharacter(req, res) {
    const characterId = req.query.characterId; // Character ID from query params
    const offset = req.query.offset || 0; // Offset from query params (default to 0)
    const limit = req.query.limit || 100; // Limit from query params (default to 100)

    if (!characterId) {
        return res.status(400).json({ error: "Character ID is required" });
    }

    console.log(`Fetching comics for character ID: ${characterId}`);

    const ts = new Date().getTime(); // Timestamp for Marvel API
    const hash = CryptoJS.MD5(
        ts + MARVEL_PRIVATE_API_KEY + MARVEL_PUBLIC_API_KEY
    ).toString();

    // Marvel API endpoint for comics by character
    const url = `${MARVEL_API_URL}characters/${characterId}/comics?ts=${ts}&apikey=${MARVEL_PUBLIC_API_KEY}&hash=${hash}&offset=${offset}&limit=${limit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Marvel API error: ${response.statusText}`);
        }
        const data = await response.json();

        res.json(data); // Return data to frontend
    } catch (error) {
        console.error("Error fetching data from Marvel API:", error);
        res.status(500).json({ error: "Error fetching data from Marvel API" });
    }
}