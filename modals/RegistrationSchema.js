//Basic student details will be stored in this schema
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const RegisteredStudents = new mongoose.Schema({
    RegistrationNo:String,
    Session:Number,
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
    isThisCurrentRecord:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
});

const RegisteredStudent = mongoose.model('RegisteredStudents', RegisteredStudents);
module.exports = RegisteredStudent;