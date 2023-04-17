const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportLocal = require('passport-local');
const LocalStrategy = require('../config/passport-local-strategy');
router.use('/admissions', passport.checkAuthentication, require('./addmission'));
router.use('/student', passport.checkAuthentication, require('./student'));
router.use('/fee', passport.checkAuthentication, require('./fee'));
router.use('/result', passport.checkAuthentication, require('./result'));
router.use('/documents', passport.checkAuthentication, require('./documents'))
router.use('/user', require('./user'));

module.exports = router;