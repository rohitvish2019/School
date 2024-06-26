//Basic student details will be stored in this schema
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const moment = require('moment');

const Students = new mongoose.Schema({
    RegistrationNo:String,
    AdmissionNo:String,
    AdmissionDate:{
        type:String,
        default: new Date().toISOString()
    },
    ResultPercentage:Number,
    AdmissionClass:String,
    Session:Number,
    SiblingsCount:String,
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
    LastClassGrade:String,
    quarterlyGrade:String,
    halfYearlyGrade:String,
    finalGrade:String,
    TotalGrade:String,
    loginEmail:String,
    SchoolCode:{
        type:String,
        default:'NA'
    },
    isThisCurrentRecord:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
});

const Student = mongoose.model('Student', Students);
module.exports = Student;