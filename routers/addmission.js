const express = require('express');
const router = express.Router();
const admissonController = require('../controller/admission');
router.get('/',admissonController.addmission);
router.post('/create', admissonController.addStudent)
module.exports = router;