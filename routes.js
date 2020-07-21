const express = require('express');
const router = express.Router();
const Scraper = require('./controller/scraper.js');

router.get('/movie/:id', Scraper.scrapeMovie);
router.get('/movie', Scraper.scrapeMovies);
router.get('/odd', Scraper.scrapeOdd);
router.get('/odd', Scraper.scrapeOdd);
router.get('/stream', Scraper.stream);

module.exports = router;
