
const express = require('express');
const router = express.Router();
const seriesCtrl = require('../controllers/series');

router.get('/', seriesCtrl.getAllSeries);
router.get('/getSeriesbyCharacter', seriesCtrl.getAllSeriesByCharacter);

module.exports = router;