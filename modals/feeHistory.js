//This schema will store the history of fees for each student
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const FeesHistory = new mongoose.Schema({
    AdmissionNo : {
        type: String,
    },
    Class:{
        type:String
    },
    Amount :{
        type: Number
    },
    Payment_Date:{
        type:Date,
    }
},
{
    timestamps:true
});

const FeeHistory = mongoose.model('FeesHistory', FeesHistory);
module.exports = FeeHistory;