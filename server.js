require('dotenv').config();

// Backend: Express server code (server.js or app.js)
const express = require('express');
const CryptoJS = require('crypto-js');
const cors = require('cors');
const logger = require('morgan');

const characterRouter = require('./routes/characters');
const comicRouter = require('./routes/comics');


const app = express();
const port = 3000;

// Set up environment variables (e.g. for API keys)
const MARVEL_PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;
const MARVEL_PRIVATE_API_KEY = process.env.PRIVATE_API_KEY;
const MARVEL_API_URL = 'https://gateway.marvel.com/v1/public/';

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send({msg: `Welcome to the database! The server is running on port ${port}`});
})

// Set up the route to fetch character data
app.use('/getCharacters', characterRouter);

// set up the route to fetch comic data
app.use('/getComics', comicRouter);

// Serve static files (e.g. HTML, JS, CSS)
app.use(express.static('public')); // Assumes your frontend is in a 'public' folder

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
