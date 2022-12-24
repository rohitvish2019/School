const express = require('express');
const router = express.Router();
const homeController = require('../controller/home')
router.use('/admissions', require('./addmission'));
router.use('/student', require('./student'));
router.use('/fee', require('./fee'));
router.use('/result', require('./result'));
router.get('/', homeController.home);
module.exports = router;