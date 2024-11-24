
const express = require('express');
const router = express.Router();
const comicCtrl = require('../controllers/comics');

router.get('/', comicCtrl.getAllComics);
router.get('/getComicsbyCharacter', comicCtrl.getAllComicsByCharacter);

module.exports = router;