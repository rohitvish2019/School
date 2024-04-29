const express = require('express');
const router = express.Router();
const resultController = require('../controller/result')
router.get('/get', resultController.getResult);
router.post('/update', resultController.updateResult);
router.post('/updateAll/:AdmissionNo', resultController.updateAllResults);
router.get('/search/:id', resultController.searchResult);
router.get('/subjects', resultController.getSubjectsListWithMarks);
router.get('/subjectsList', resultController.getSubjectsListOnly);
router.get('/terms', resultController.getTerms);
router.get('/bulkMarksHome', resultController.bulkMarksHome);
router.get('/getClassResult', resultController.getClassResult);
router.post('/updateSingleResult', resultController.updateResultSingle);
router.get('/getStudentName', resultController.getNamesByClassForResult);
router.post('/updateFinalGradeM', resultController.updateResultSingleNew);
module.exports = router;