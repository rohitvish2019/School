const express = require('express');
const router = express.Router();
const resultController = require('../controller/result')
router.get('/get', resultController.getResult);
router.post('/update', resultController.addUpdateResult);
router.post('/updateAll/:AdmissionNo', resultController.updateAllResults);
router.get('/search/:id', resultController.searchResult);
module.exports = router;