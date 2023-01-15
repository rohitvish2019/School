const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const Fees = new mongoose.Schema({
    AdmissionNo : {
        type: String,
    },
    Class:{
        type:String
    },
    Total :{
        type: Number
    },
    Concession:{
        type:Number,
        default:0
    },
    Paid: {
        type: Number
    },
    Remaining: {
        type:Number
    },
    LastPaid: {
        type:String
    },
    PayHistory:{
        type:Array  
    }
},
{
    timestamps:true
});

const Fee = mongoose.model('Fee', Fees);
module.exports = Fee;

/*
    January:Number,
    February:Number,
    March: Number,
    April:Number,
    May:Number,
    June: Number,
    July:Number,
    August: Number,
    September: Number,
    October:Number,
    November: Number,
    December:Number,
*/