//This will be used to add/get last admission number
const mongoose = require('mongoose');
const db = require('../config/dbConnection');

const AdmissionNo = new mongoose.Schema({
    LastAdmission: {
        type:Number
    },
    LastRegistration : {
        type:Number,
        default:0
    },
    LastFeeReceiptNo:{
        type:Number,
        default:1
    },
    SchoolCode:{
        
        type:String
    }
},
{
    timestamps:true
});


const AdmissionNumber = mongoose.model('AdmissionNo', AdmissionNo);
module.exports = AdmissionNumber;