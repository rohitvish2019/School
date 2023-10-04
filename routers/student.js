const express = require('express');
const router = express.Router();
const studentController = require('../controller/student');


//old code 
router.get('/get/:adm_no', studentController.getStudent)
router.get('/search', studentController.search)
router.get('/showByClass', studentController.getStudentsByClassForm);
router.get('/showByClass/fee', studentController.getStudentsByClassFormFee);
router.get('/showByClass/result', studentController.getStudentsByClassFormResult);
router.get('/showByClass/tc', studentController.getStudentsByClassFormTC);
router.get('/showByClass/admission', studentController.getStudentsByClassFormAdmission);
router.get('/getStudentList', studentController.getStudentsList);
router.get('/upgradeClass', studentController.upgradeClassPage);
router.get('/upgrade/:AdmissionNo', studentController.upgradeOneStudent);
router.post('/upgradeClassBulk', studentController.upgradeClassBulk);
router.get('/getMarksheet/:AdmissionNo', studentController.getMarksheetUI);
router.post('/discharge/:AdmissionNo', studentController.dischargeStudent);
router.get('/getMe', studentController.getMe);
module.exports = router;