const express = require('express');
const router = express.Router();
const resultController = require('../controller/result')
router.get('/get', resultController.getResult);
router.post('/update', resultController.addUpdateResult);
router.get('/search/:id', resultController.searchResult);
module.exports = router;