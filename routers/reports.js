const express = require('express');
const router = express.Router();
const reportsController = require('../controller/reports');
router.get('/students', reportsController.home);
router.get('/classList/get', reportsController.getClassList);
module.exports = router;