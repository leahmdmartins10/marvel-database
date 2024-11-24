
const express = require('express');
const router = express.Router();
const characterCtrl = require('../controllers/characters');

router.get('/', characterCtrl.getAllCharacters);
router.get('/:id', characterCtrl.getCharacterById);

module.exports = router;