const express = require('express');
const router = express.Router();
const reportsController = require('../controller/reports');
router.get('/students', reportsController.home);
router.get('/classList/get', reportsController.getClassList);
router.get('/allReports', reportsController.getReports);
router.get('/bulk/home', reportsController.bulkReportsHome);
router.get('/getExcel', reportsController.getCSV);
router.get('/cashbook/home', reportsController.cashBookHome);
router.post('/cashbook/update', reportsController.addCashTransaction);
router.get('/cashbook/getTransactions', reportsController.getCashTransactions);
router.get('/timeTableHome', reportsController.timeTableHome);
router.post('/savetimeTable', reportsController.saveTimeTable);
router.get('/getTimeTable', reportsController.getTimeTable);
router.get('/newReceipt', reportsController.otherReceiptsHome)
module.exports = router;