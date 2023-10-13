const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const LocalStrategy = require('../config/passport-local-strategy');

const userController = require('../controller/user');
router.get('/login', userController.login);
router.get('/sign-up', userController.signUp)
router.get('/logout', userController.logout);
router.get('/new',passport.checkAuthentication, userController.addUserPage);
router.post('/addNew',passport.checkAuthentication, userController.addNewUser);
router.get('/home', passport.checkAuthentication, userController.home);
router.post('/studentUser', userController.addStudentUser);
router.post('/updatePassword', userController.updatePassword)

router.post('/authenticate', passport.authenticate(
    'local',
    {failureRedirect: '/user/login'},
), userController.createSession);

module.exports = router