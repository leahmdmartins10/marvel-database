
const express = require('express');
const router = express.Router();
const eventCtrl = require('../controllers/events');

router.get('/', eventCtrl.getAllEvents);
router.get('/getEventsbyCharacter', eventCtrl.getAllEventsByCharacter);

module.exports = router;