const express = require('express');
const router = express.Router();
const feeController = require('../controller/fee');
router.get('/:id', feeController.getFeeDetails);
router.post('/submit', feeController.feeSubmission);
module.exports = router;