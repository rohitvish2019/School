const express = require('express');
const router = express.Router();
const TeachersController = require ('../controller/Teachers');
router.get('/home', TeachersController.home);
router.post('/addNew', TeachersController.addNewTeacher);
router.post('/update', TeachersController.updateTeacherDetails);
module.exports = router;