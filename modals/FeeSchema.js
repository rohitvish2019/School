// This schema will store the fee details of each student
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
        type:Array,
        ref:'FeeHistory'
    }
},
{
    timestamps:true
});

const Fee = mongoose.model('Fee', Fees);
module.exports = Fee;