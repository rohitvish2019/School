const mongoose = require('mongoose');
const db = require('../config/dbConnection');

const AdmissionNo = new mongoose.Schema({
    LastAdmission: Number
},
{
    timestamps:true
});


const AdmissionNumber = mongoose.model('AdmissionNo', AdmissionNo);
module.exports = AdmissionNumber;