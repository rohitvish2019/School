const express = require('express');
const router = express.Router();
const reportsController = require('../controller/reports');
router.get('/students', reportsController.home);
router.get('/classList/get', reportsController.getClassList);
router.get('/admittedStudents', reportsController.getAdmittedStudentsReport);
router.get('/bulk/home', reportsController.bulkReportsHome);
module.exports = router;