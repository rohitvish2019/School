const express = require('express');
const router = express.Router();
const studentController = require('../controller/student');
router.get('/get/:adm_no', studentController.getStudent)
router.get('/search', studentController.search)
module.exports = router;