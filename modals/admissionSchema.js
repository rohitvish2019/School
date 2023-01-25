//Basic student details will be stored in this schema
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const Students = new mongoose.Schema({
    AdmissionNo:String,
    FirstName:String,
    LastName: String,
    FathersName:String,
    MothersName: String,
    Class:String,
    AadharNumber:String,
    SSSM:String,
    Mob: String,
    DOB:String,
    Caste:String,
    FullAddress:String,
    BankName:String,
    Branch:String,
    AccountNo:String,
    IFSC:String,
    Medium: String,
    Category: String,
    Religion:String,
    isHandicapped: String,
    Gender: String,
    FathersEducation:String,
    MothersEducation:String, 
    FathersOccupation:String, 
    MothersOccupation:String, 
    FathersWorkPlace:String, 
    MothersWorkPlace:String, 
    FathersAnnualIncome:String, 
    MothersAnnualIncome:String, 
    LastSchoolName:String, 
    LastPassingClass:String, 
    LastClassPassingYear:String, 
    LastClassGrade:String
});

const Student = mongoose.model('Student', Students);
module.exports = Student;