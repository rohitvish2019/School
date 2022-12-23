const express = require('express');
const router = express.Router();
const feeController = require('../controller/fee');
router.get('/getFee/:id', feeController.getFeeDetails);
router.get('/getMyFee', feeController.getFee)
router.post('/submit', feeController.feeSubmission);
router.get('/updateFeeForm', feeController.updateFeeForm);
router.post('/updateFee', feeController.updateFee);
module.exports = router;