//This will be used to add/get last admission number
const mongoose = require('mongoose');
const db = require('../config/dbConnection');

const RegisteredSchool = new mongoose.Schema({
    SchoolName: {
        type:String
    },
    Address : {
        type:String,
    },
    AdminEmail:{
        type:String,
        default:1
    },
    AdminMobile:{
        type:String
    },
    StudentsCount:{
        type:Number
    }
},
{
    timestamps:true
});


const RegisteredSch = mongoose.model('RegisteredSchool', RegisteredSchool);
module.exports = RegisteredSch;