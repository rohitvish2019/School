const express = require('express');
const router = express.Router();

router.use('/admissions', require('./addmission'));
router.use('/student', require('./student'));
router.use('/fee', require('./fee'));
router.use('/result', require('./result'));

module.exports = router;