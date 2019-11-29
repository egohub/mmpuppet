const express = require('express');
const router = express.Router();
const Scraper = require('./controller/scraper.js');

router.get('/movie/:id', Scraper.scrapeMovie);

module.exports = router;
